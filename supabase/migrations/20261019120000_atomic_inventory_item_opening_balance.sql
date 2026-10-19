-- Create inventory items and their opening balances atomically.
-- Stock starts at zero; the ledger RPC is the only path that sets the requested opening balance.
CREATE OR REPLACE FUNCTION public.bmb_create_inventory_item_with_opening_balance(
  p_id text,
  p_name text,
  p_category text,
  p_opening_quantity numeric,
  p_unit text,
  p_min_threshold numeric,
  p_cost_per_unit numeric,
  p_supplier text,
  p_last_restocked date
)
RETURNS public.bmb_inventory
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_item public.bmb_inventory;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'An authenticated staff session is required';
  END IF;
  IF NOT public.bmb_has_staff_permission('inventory','add') THEN
    RAISE EXCEPTION 'You do not have permission to add inventory items';
  END IF;
  IF NOT public.bmb_has_staff_permission('inventory','write') THEN
    RAISE EXCEPTION 'You do not have permission to record an opening stock balance';
  END IF;
  IF p_opening_quantity IS NULL OR p_opening_quantity < 0 THEN
    RAISE EXCEPTION 'Opening quantity must be zero or greater';
  END IF;
  IF p_min_threshold IS NULL OR p_min_threshold < 0
     OR p_cost_per_unit IS NULL OR p_cost_per_unit < 0 THEN
    RAISE EXCEPTION 'Threshold and unit cost must be zero or greater';
  END IF;
  IF NULLIF(trim(p_id),'') IS NULL OR NULLIF(trim(p_name),'') IS NULL
     OR NULLIF(trim(p_unit),'') IS NULL OR NULLIF(trim(p_category),'') IS NULL THEN
    RAISE EXCEPTION 'Item ID, name, category and stock unit are required';
  END IF;

  INSERT INTO public.bmb_inventory(
    id, name, category, current_stock, unit, min_threshold, cost_per_unit,
    supplier, last_restocked, status, updated_at
  ) VALUES (
    trim(p_id), trim(p_name), trim(p_category), 0, trim(p_unit),
    p_min_threshold, p_cost_per_unit, COALESCE(p_supplier,''), p_last_restocked,
    'Critical', now()
  );

  -- ADJUSTMENT quantity represents the resulting physical balance, not a delta.
  -- This call also writes the opening-balance movement. Any error rolls back the item insert.
  PERFORM public.bmb_record_inventory_movement(
    trim(p_id), p_opening_quantity, 'ADJUSTMENT', 'Opening Balance',
    'OPENING:' || trim(p_id),
    format('Opening stock entered at item creation: %s %s', p_opening_quantity, trim(p_unit))
  );

  SELECT * INTO v_item FROM public.bmb_inventory WHERE id=trim(p_id);
  RETURN v_item;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_create_inventory_item_with_opening_balance(text,text,text,numeric,text,numeric,numeric,text,date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_create_inventory_item_with_opening_balance(text,text,text,numeric,text,numeric,numeric,text,date) TO authenticated;
