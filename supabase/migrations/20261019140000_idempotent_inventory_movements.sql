-- Add a consistent movement ledger and idempotent stock mutation RPCs.
ALTER TABLE public.bmb_inventory_movements
  ADD COLUMN IF NOT EXISTS quantity_delta numeric,
  ADD COLUMN IF NOT EXISTS balance_after numeric,
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS bmb_inventory_movements_idempotency_key_uq
  ON public.bmb_inventory_movements(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE OR REPLACE FUNCTION public.bmb_record_inventory_movement_core(
  p_inventory_id text,
  p_quantity numeric,
  p_movement_type text,
  p_source text,
  p_reference_id text,
  p_notes text,
  p_idempotency_key text
)
RETURNS public.bmb_inventory
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_item public.bmb_inventory;
  v_existing public.bmb_inventory_movements;
  v_next numeric;
  v_delta numeric;
  v_allowed boolean := false;
  v_id text := 'MOV-' || extract(epoch from clock_timestamp())::bigint || '-' || substr(md5(random()::text),1,8);
BEGIN
  IF p_movement_type NOT IN ('RECEIPT','CONSUMPTION','ADJUSTMENT') THEN
    RAISE EXCEPTION 'Invalid inventory movement type';
  END IF;
  IF p_quantity IS NULL OR p_quantity < 0 THEN
    RAISE EXCEPTION 'Quantity must be zero or greater';
  END IF;
  IF p_movement_type IN ('RECEIPT','CONSUMPTION') AND p_quantity <= 0 THEN
    RAISE EXCEPTION 'Receipt and consumption quantities must be greater than zero';
  END IF;

  IF p_movement_type IN ('RECEIPT','ADJUSTMENT') THEN
    v_allowed := public.bmb_has_staff_permission('inventory','write');
  ELSE
    v_allowed := public.bmb_has_staff_permission('inventory','write')
      OR public.bmb_has_staff_permission('chef-indents','write');
  END IF;
  IF NOT v_allowed THEN
    RAISE EXCEPTION 'You do not have permission to change inventory';
  END IF;

  SELECT * INTO v_item
  FROM public.bmb_inventory
  WHERE id=p_inventory_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inventory item not found'; END IF;

  IF p_idempotency_key IS NOT NULL THEN
    SELECT * INTO v_existing FROM public.bmb_inventory_movements
    WHERE idempotency_key=p_idempotency_key;
    IF FOUND THEN
      IF v_existing.inventory_id IS DISTINCT FROM p_inventory_id
         OR v_existing.movement_type IS DISTINCT FROM p_movement_type
         OR v_existing.quantity IS DISTINCT FROM p_quantity
         OR COALESCE(v_existing.source,'') IS DISTINCT FROM COALESCE(p_source,'')
         OR v_existing.reference_id IS DISTINCT FROM p_reference_id THEN
        RAISE EXCEPTION 'Idempotency key was already used for a different inventory operation';
      END IF;
      RETURN v_item;
    END IF;
  END IF;

  IF p_movement_type='RECEIPT' THEN
    v_next := COALESCE(v_item.current_stock,0)+p_quantity;
  ELSIF p_movement_type='CONSUMPTION' THEN
    v_next := COALESCE(v_item.current_stock,0)-p_quantity;
    IF v_next < 0 THEN
      RAISE EXCEPTION 'Insufficient stock: % % available, % requested',v_item.current_stock,v_item.unit,p_quantity;
    END IF;
  ELSE
    -- For ADJUSTMENT, p_quantity is the target physical balance, not a delta.
    v_next := p_quantity;
  END IF;
  v_delta := v_next-COALESCE(v_item.current_stock,0);

  PERFORM set_config('app.bmb_inventory_movement_rpc','true',true);
  UPDATE public.bmb_inventory
  SET current_stock=GREATEST(0,v_next),
      status=CASE
        WHEN GREATEST(0,v_next)<=0 THEN 'Critical'
        WHEN GREATEST(0,v_next)<=COALESCE(min_threshold,0) THEN 'Low Stock'
        ELSE 'In Stock'
      END,
      last_restocked=CASE WHEN p_movement_type='RECEIPT' THEN current_date ELSE last_restocked END,
      updated_at=now()
  WHERE id=p_inventory_id
  RETURNING * INTO v_item;

  INSERT INTO public.bmb_inventory_movements(
    id,inventory_id,ingredient_name,movement_type,quantity,quantity_delta,balance_after,
    unit,source,reference_id,notes,created_by,idempotency_key
  ) VALUES (
    v_id,p_inventory_id,v_item.name,p_movement_type,p_quantity,v_delta,v_next,
    v_item.unit,COALESCE(p_source,''),p_reference_id,COALESCE(p_notes,''),auth.uid(),p_idempotency_key
  );
  RETURN v_item;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_record_inventory_movement_core(text,numeric,text,text,text,text,text) FROM PUBLIC, anon, authenticated;

-- Preserve the existing six-argument RPC contract for legacy callers while recording delta/balance fields.
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
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN public.bmb_record_inventory_movement_core(
    p_inventory_id,p_quantity,p_movement_type,COALESCE(p_source,''),p_reference_id,COALESCE(p_notes,''),NULL
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.bmb_record_inventory_movement_idempotent(
  p_inventory_id text,
  p_quantity numeric,
  p_movement_type text,
  p_source text,
  p_reference_id text,
  p_notes text,
  p_idempotency_key text
)
RETURNS public.bmb_inventory
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NULLIF(trim(p_idempotency_key),'') IS NULL THEN
    RAISE EXCEPTION 'An idempotency key is required';
  END IF;
  RETURN public.bmb_record_inventory_movement_core(
    p_inventory_id,p_quantity,p_movement_type,COALESCE(p_source,''),p_reference_id,COALESCE(p_notes,''),trim(p_idempotency_key)
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_record_inventory_movement_idempotent(text,numeric,text,text,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_record_inventory_movement_idempotent(text,numeric,text,text,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.bmb_receive_inventory_purchase_idempotent(
  p_indent_id text,
  p_inventory_id text,
  p_quantity numeric,
  p_idempotency_key text
)
RETURNS TABLE(inventory_id text,item_name text,current_stock numeric,received_quantity numeric,quantity_needed numeric,unit text,status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_indent public.bmb_chef_indents;
  v_item public.bmb_inventory;
  v_existing public.bmb_inventory_movements;
  v_total_received numeric;
  v_status text;
BEGIN
  IF NULLIF(trim(p_idempotency_key),'') IS NULL THEN
    RAISE EXCEPTION 'An idempotency key is required';
  END IF;
  IF p_quantity IS NULL OR p_quantity<=0 THEN
    RAISE EXCEPTION 'Received quantity must be greater than zero';
  END IF;
  IF NOT public.bmb_has_staff_permission('inventory','write') THEN
    RAISE EXCEPTION 'You do not have permission to receive inventory';
  END IF;

  SELECT * INTO v_indent FROM public.bmb_chef_indents WHERE id=p_indent_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Purchase indent not found'; END IF;

  SELECT * INTO v_existing FROM public.bmb_inventory_movements WHERE idempotency_key=trim(p_idempotency_key);
  IF FOUND THEN
    IF v_existing.inventory_id IS DISTINCT FROM p_inventory_id
       OR v_existing.movement_type IS DISTINCT FROM 'RECEIPT'
       OR v_existing.quantity IS DISTINCT FROM p_quantity
       OR v_existing.reference_id IS DISTINCT FROM p_indent_id
       OR COALESCE(v_existing.source,'') IS DISTINCT FROM 'Admin-Approved Purchase Receipt' THEN
      RAISE EXCEPTION 'Idempotency key was already used for a different receipt';
    END IF;
    SELECT * INTO v_item FROM public.bmb_inventory WHERE id=p_inventory_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Inventory item not found'; END IF;
    RETURN QUERY SELECT v_item.id,v_item.name,v_item.current_stock,
      COALESCE(v_indent.received_quantity,0),v_indent.quantity_needed,v_item.unit,v_indent.status;
    RETURN;
  END IF;

  IF COALESCE(v_indent.status,'') NOT IN ('Approved','Ordered','Purchased') THEN
    RAISE EXCEPTION 'Only an approved, active purchase can be received';
  END IF;
  IF v_indent.payment_status<>'Approved' THEN
    RAISE EXCEPTION 'Admin payment approval is required before receiving stock';
  END IF;

  SELECT * INTO v_item FROM public.bmb_inventory WHERE id=p_inventory_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inventory item not found'; END IF;
  IF lower(regexp_replace(trim(v_indent.item_name),E'\\s+',' ','g'))
     <> lower(regexp_replace(trim(v_item.name),E'\\s+',' ','g')) THEN
    RAISE EXCEPTION 'Purchase item name does not match the selected inventory item';
  END IF;
  IF public.bmb_normalize_inventory_unit(v_indent.unit)<>public.bmb_normalize_inventory_unit(v_item.unit) THEN
    RAISE EXCEPTION 'Unit mismatch: purchase is %, inventory item is %',v_indent.unit,v_item.unit;
  END IF;

  v_total_received:=COALESCE(v_indent.received_quantity,0)+p_quantity;
  IF v_total_received>v_indent.quantity_needed THEN
    RAISE EXCEPTION 'Received quantity (%) exceeds ordered quantity (%)',v_total_received,v_indent.quantity_needed;
  END IF;

  PERFORM public.bmb_record_inventory_movement_core(
    p_inventory_id,p_quantity,'RECEIPT','Admin-Approved Purchase Receipt',p_indent_id,
    format('Requested %s %s; this receipt %s %s; cumulative received %s %s',
      v_indent.quantity_needed,v_indent.unit,p_quantity,v_indent.unit,v_total_received,v_indent.unit),
    trim(p_idempotency_key)
  );

  v_status:=CASE WHEN v_total_received>=v_indent.quantity_needed THEN 'Delivered' ELSE 'Approved' END;
  PERFORM set_config('app.bmb_inventory_receipt_rpc','true',true);
  UPDATE public.bmb_chef_indents
  SET received_quantity=v_total_received,received_at=now(),status=v_status,
      purchase_note=CASE WHEN v_status='Delivered'
        THEN 'Full ordered quantity received after Admin payment approval'
        ELSE format('Partial receipt: %s of %s %s received',v_total_received,v_indent.quantity_needed,v_indent.unit)
      END,
      updated_at=now()
  WHERE id=p_indent_id;

  SELECT * INTO v_item FROM public.bmb_inventory WHERE id=p_inventory_id;
  RETURN QUERY SELECT v_item.id,v_item.name,v_item.current_stock,v_total_received,
    v_indent.quantity_needed,v_item.unit,v_status;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_receive_inventory_purchase_idempotent(text,text,numeric,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_receive_inventory_purchase_idempotent(text,text,numeric,text) TO authenticated;
