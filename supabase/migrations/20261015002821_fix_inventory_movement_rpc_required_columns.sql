CREATE OR REPLACE FUNCTION public.bmb_record_inventory_movement(
  p_inventory_id text,
  p_quantity numeric,
  p_movement_type text,
  p_source text DEFAULT ''::text,
  p_reference_id text DEFAULT NULL::text,
  p_notes text DEFAULT ''::text
)
RETURNS public.bmb_inventory
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_item public.bmb_inventory;
  v_next numeric;
  v_id text := 'MOV-' || extract(epoch from clock_timestamp())::bigint || '-' || substr(md5(random()::text),1,8);
  v_allowed boolean := false;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 0 THEN
    RAISE EXCEPTION 'Quantity must be zero or greater';
  END IF;

  IF p_movement_type IN ('RECEIPT','ADJUSTMENT') THEN
    v_allowed := public.bmb_has_staff_permission('inventory','write');
  ELSIF p_movement_type = 'CONSUMPTION' THEN
    v_allowed := public.bmb_has_staff_permission('inventory','write')
      OR public.bmb_has_staff_permission('chef-indents','write');
  END IF;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'You do not have permission to change inventory';
  END IF;

  SELECT * INTO v_item
  FROM public.bmb_inventory
  WHERE id = p_inventory_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item not found';
  END IF;

  IF p_movement_type = 'RECEIPT' THEN
    v_next := COALESCE(v_item.current_stock,0) + p_quantity;
  ELSIF p_movement_type = 'CONSUMPTION' THEN
    v_next := COALESCE(v_item.current_stock,0) - p_quantity;
    IF v_next < 0 THEN
      RAISE EXCEPTION 'Insufficient stock: % % available, % requested', v_item.current_stock, v_item.unit, p_quantity;
    END IF;
  ELSIF p_movement_type = 'ADJUSTMENT' THEN
    v_next := p_quantity;
  ELSE
    RAISE EXCEPTION 'Invalid inventory movement type';
  END IF;

  UPDATE public.bmb_inventory
  SET current_stock = GREATEST(0,v_next),
      status = CASE
        WHEN GREATEST(0,v_next) <= 0 THEN 'Critical'
        WHEN GREATEST(0,v_next) <= COALESCE(min_threshold,0) THEN 'Low Stock'
        ELSE 'In Stock'
      END,
      last_restocked = CASE WHEN p_movement_type = 'RECEIPT' THEN current_date ELSE last_restocked END,
      updated_at = now()
  WHERE id = p_inventory_id
  RETURNING * INTO v_item;

  INSERT INTO public.bmb_inventory_movements(
    id, inventory_id, ingredient_name, movement_type, quantity, unit,
    source, reference_id, notes, created_by
  )
  VALUES(
    v_id, p_inventory_id, v_item.name, p_movement_type, p_quantity, v_item.unit,
    COALESCE(p_source,''), p_reference_id, COALESCE(p_notes,''), auth.uid()
  );

  RETURN v_item;
END;
$function$;
