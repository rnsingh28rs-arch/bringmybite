-- Record an actual cooking batch and consume all recipe ingredients atomically.
CREATE TABLE IF NOT EXISTS public.bmb_inventory_consumption_batches (
  batch_id text PRIMARY KEY,
  package_type text NOT NULL,
  meal text NOT NULL CHECK (meal IN ('lunch','dinner')),
  service_day text NOT NULL,
  tray_count integer NOT NULL CHECK (tray_count > 0),
  items jsonb NOT NULL,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bmb_inventory_consumption_batches ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.bmb_inventory_consumption_batches FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.bmb_inventory_consumption_batches TO authenticated;
DROP POLICY IF EXISTS bmb_inventory_consumption_batches_staff_read ON public.bmb_inventory_consumption_batches;
CREATE POLICY bmb_inventory_consumption_batches_staff_read
  ON public.bmb_inventory_consumption_batches
  FOR SELECT TO authenticated
  USING (public.bmb_has_staff_permission('inventory','read'));

CREATE OR REPLACE FUNCTION public.bmb_consume_inventory_batch(
  p_batch_id text,
  p_package_type text,
  p_meal text,
  p_service_day text,
  p_tray_count integer,
  p_items jsonb
)
RETURNS TABLE(
  batch_id text,
  consumed_items integer,
  status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_existing public.bmb_inventory_consumption_batches;
  v_line jsonb;
  v_item public.bmb_inventory;
  v_inventory_id text;
  v_quantity numeric;
  v_unit text;
  v_count integer;
  v_result record;
  v_notes text;
  v_key text;
BEGIN
  IF NOT (public.bmb_has_staff_permission('inventory','write')
          OR public.bmb_has_staff_permission('chef-indents','write')) THEN
    RAISE EXCEPTION 'You do not have permission to record cooking consumption';
  END IF;
  IF NULLIF(trim(p_batch_id),'') IS NULL OR NULLIF(trim(p_package_type),'') IS NULL
     OR NULLIF(trim(p_service_day),'') IS NULL THEN
    RAISE EXCEPTION 'Batch ID, package and service day are required';
  END IF;
  IF p_meal NOT IN ('lunch','dinner') THEN
    RAISE EXCEPTION 'Meal must be lunch or dinner';
  END IF;
  IF p_tray_count IS NULL OR p_tray_count<=0 THEN
    RAISE EXCEPTION 'Actual tray count must be greater than zero';
  END IF;
  IF p_items IS NULL OR jsonb_typeof(p_items)<>'array' OR jsonb_array_length(p_items)=0 THEN
    RAISE EXCEPTION 'At least one recipe ingredient is required for batch consumption';
  END IF;
  IF EXISTS (
    SELECT value->>'inventory_id'
    FROM jsonb_array_elements(p_items) AS x(value)
    GROUP BY value->>'inventory_id'
    HAVING count(*)>1
  ) THEN
    RAISE EXCEPTION 'A cooking batch must aggregate each inventory item into one line';
  END IF;

  SELECT * INTO v_existing
  FROM public.bmb_inventory_consumption_batches
  WHERE batch_id=trim(p_batch_id)
  FOR UPDATE;
  IF FOUND THEN
    IF v_existing.package_type IS DISTINCT FROM p_package_type
       OR v_existing.meal IS DISTINCT FROM p_meal
       OR v_existing.service_day IS DISTINCT FROM p_service_day
       OR v_existing.tray_count IS DISTINCT FROM p_tray_count
       OR v_existing.items IS DISTINCT FROM p_items THEN
      RAISE EXCEPTION 'Batch ID was already used for a different cooking payload';
    END IF;
    RETURN QUERY SELECT v_existing.batch_id,jsonb_array_length(v_existing.items),'already_recorded',v_existing.created_at;
    RETURN;
  END IF;

  -- Lock every ingredient in stable order before checking balances.
  PERFORM i.id
  FROM public.bmb_inventory i
  JOIN (
    SELECT DISTINCT value->>'inventory_id' AS inventory_id
    FROM jsonb_array_elements(p_items) AS x(value)
  ) x ON x.inventory_id=i.id
  ORDER BY i.id
  FOR UPDATE OF i;

  -- Recheck after locking; a concurrent retry may have committed while this call waited.
  SELECT * INTO v_existing
  FROM public.bmb_inventory_consumption_batches
  WHERE batch_id=trim(p_batch_id)
  FOR UPDATE;
  IF FOUND THEN
    IF v_existing.package_type IS DISTINCT FROM p_package_type
       OR v_existing.meal IS DISTINCT FROM p_meal
       OR v_existing.service_day IS DISTINCT FROM p_service_day
       OR v_existing.tray_count IS DISTINCT FROM p_tray_count
       OR v_existing.items IS DISTINCT FROM p_items THEN
      RAISE EXCEPTION 'Batch ID was already used for a different cooking payload';
    END IF;
    RETURN QUERY SELECT v_existing.batch_id,jsonb_array_length(v_existing.items),'already_recorded',v_existing.created_at;
    RETURN;
  END IF;

  v_count := 0;
  FOR v_line IN SELECT value FROM jsonb_array_elements(p_items) AS x(value) LOOP
    v_inventory_id := NULLIF(trim(v_line->>'inventory_id'),'');
    v_unit := NULLIF(trim(v_line->>'unit'),'');
    BEGIN
      v_quantity := NULLIF(v_line->>'quantity','')::numeric;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'Each batch quantity must be numeric';
    END;
    IF v_inventory_id IS NULL OR v_unit IS NULL OR v_quantity IS NULL OR v_quantity<=0 THEN
      RAISE EXCEPTION 'Each batch line needs an inventory ID, unit and positive quantity';
    END IF;
    SELECT * INTO v_item FROM public.bmb_inventory WHERE id=v_inventory_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Inventory item % was not found',v_inventory_id; END IF;
    IF public.bmb_normalize_inventory_unit(v_item.unit)<>public.bmb_normalize_inventory_unit(v_unit) THEN
      RAISE EXCEPTION 'Unit mismatch for %: stock is stored in %, but batch quantity uses %',v_item.name,v_item.unit,v_unit;
    END IF;
    IF COALESCE(v_item.current_stock,0)<v_quantity THEN
      RAISE EXCEPTION 'Insufficient stock for %: available %, required % %',v_item.name,COALESCE(v_item.current_stock,0),v_quantity,v_item.unit;
    END IF;
    v_count := v_count+1;
  END LOOP;

  INSERT INTO public.bmb_inventory_consumption_batches(
    batch_id,package_type,meal,service_day,tray_count,items,created_by
  ) VALUES (
    trim(p_batch_id),trim(p_package_type),p_meal,trim(p_service_day),p_tray_count,p_items,auth.uid()
  ) ON CONFLICT (batch_id) DO NOTHING
  RETURNING * INTO v_existing;

  IF NOT FOUND THEN
    SELECT * INTO v_existing FROM public.bmb_inventory_consumption_batches
    WHERE batch_id=trim(p_batch_id) FOR UPDATE;
    IF v_existing.package_type IS DISTINCT FROM p_package_type
       OR v_existing.meal IS DISTINCT FROM p_meal
       OR v_existing.service_day IS DISTINCT FROM p_service_day
       OR v_existing.tray_count IS DISTINCT FROM p_tray_count
       OR v_existing.items IS DISTINCT FROM p_items THEN
      RAISE EXCEPTION 'Batch ID was already used for a different cooking payload';
    END IF;
    RETURN QUERY SELECT v_existing.batch_id,jsonb_array_length(v_existing.items),'already_recorded',v_existing.created_at;
    RETURN;
  END IF;

  v_notes := format('%s / %s / %s / %s actual trays',trim(p_package_type),p_meal,trim(p_service_day),p_tray_count);
  FOR v_line IN SELECT value FROM jsonb_array_elements(p_items) AS x(value) LOOP
    v_inventory_id := trim(v_line->>'inventory_id');
    v_quantity := (v_line->>'quantity')::numeric;
    v_unit := trim(v_line->>'unit');
    v_key := 'batch:' || trim(p_batch_id) || ':' || v_inventory_id;
    SELECT * INTO v_result
    FROM public.bmb_record_inventory_movement_idempotent(
      v_inventory_id,v_quantity,'CONSUMPTION','Chef Cooking Batch',
      trim(p_batch_id),v_notes,v_key
    );
  END LOOP;

  RETURN QUERY SELECT trim(p_batch_id),v_count,'recorded',now();
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_consume_inventory_batch(text,text,text,text,integer,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_consume_inventory_batch(text,text,text,text,integer,jsonb) TO authenticated;
