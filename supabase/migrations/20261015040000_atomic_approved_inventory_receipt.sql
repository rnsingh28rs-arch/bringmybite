-- Atomically receive stock only after Admin payment approval.
-- This prevents stock movements from being saved while the indent receipt record fails.
CREATE OR REPLACE FUNCTION public.bmb_receive_inventory_purchase(
  p_indent_id text,
  p_inventory_id text,
  p_quantity numeric
)
RETURNS TABLE (
  inventory_id text,
  item_name text,
  current_stock numeric,
  received_quantity numeric,
  quantity_needed numeric,
  unit text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_indent public.bmb_chef_indents;
  v_item public.bmb_inventory;
  v_total_received numeric;
  v_status text;
BEGIN
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Received quantity must be greater than zero';
  END IF;

  IF NOT public.bmb_has_staff_permission('inventory','write') THEN
    RAISE EXCEPTION 'You do not have permission to receive inventory';
  END IF;

  SELECT * INTO v_indent
  FROM public.bmb_chef_indents
  WHERE id = p_indent_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Purchase indent not found';
  END IF;

  IF v_indent.payment_status <> 'Approved' THEN
    RAISE EXCEPTION 'Admin payment approval is required before receiving stock';
  END IF;

  SELECT * INTO v_item
  FROM public.bmb_inventory
  WHERE id = p_inventory_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item not found';
  END IF;

  IF lower(regexp_replace(trim(v_indent.item_name), '\s+', ' ', 'g'))
     <> lower(regexp_replace(trim(v_item.name), '\s+', ' ', 'g')) THEN
    RAISE EXCEPTION 'Purchase item name does not match the selected inventory item';
  END IF;

  IF lower(trim(v_indent.unit)) <> lower(trim(v_item.unit)) THEN
    RAISE EXCEPTION 'Unit mismatch: purchase is %, inventory item is %', v_indent.unit, v_item.unit;
  END IF;

  v_total_received := COALESCE(v_indent.received_quantity, 0) + p_quantity;
  IF v_total_received > v_indent.quantity_needed THEN
    RAISE EXCEPTION 'Received quantity (%) exceeds remaining order quantity (%)',
      v_total_received, v_indent.quantity_needed;
  END IF;

  PERFORM public.bmb_record_inventory_movement(
    p_inventory_id,
    p_quantity,
    'RECEIPT',
    'Admin-Approved Purchase Receipt',
    p_indent_id,
    format('Requested %s %s; this receipt %s %s; cumulative received %s %s',
      v_indent.quantity_needed, v_indent.unit, p_quantity, v_indent.unit,
      v_total_received, v_indent.unit)
  );

  v_status := CASE WHEN v_total_received >= v_indent.quantity_needed THEN 'Delivered' ELSE 'Approved' END;

  UPDATE public.bmb_chef_indents
  SET received_quantity = v_total_received,
      received_at = now(),
      status = v_status,
      purchase_note = CASE
        WHEN v_status = 'Delivered' THEN 'Full ordered quantity received after Admin payment approval'
        ELSE format('Partial receipt: %s of %s %s received', v_total_received, v_indent.quantity_needed, v_indent.unit)
      END,
      updated_at = now()
  WHERE id = p_indent_id;

  SELECT * INTO v_item FROM public.bmb_inventory WHERE id = p_inventory_id;

  RETURN QUERY
  SELECT v_item.id, v_item.name, v_item.current_stock, v_total_received,
         v_indent.quantity_needed, v_item.unit, v_status;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_receive_inventory_purchase(text,text,numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_receive_inventory_purchase(text,text,numeric) TO authenticated;
