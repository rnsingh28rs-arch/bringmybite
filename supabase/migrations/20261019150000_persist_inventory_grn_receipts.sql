-- Persist GRN metadata and stock receipt in one transaction.
CREATE TABLE IF NOT EXISTS public.bmb_inventory_receipts (
  receipt_id text PRIMARY KEY,
  grn_number text NOT NULL UNIQUE,
  indent_id text NOT NULL REFERENCES public.bmb_chef_indents(id) ON DELETE RESTRICT,
  inventory_id text NOT NULL REFERENCES public.bmb_inventory(id) ON DELETE RESTRICT,
  supplier_name text NOT NULL,
  supplier_contact text NOT NULL DEFAULT '',
  supplier_address text NOT NULL DEFAULT '',
  supplier_gstin text NOT NULL DEFAULT '',
  invoice_number text NOT NULL DEFAULT '',
  invoice_date date,
  received_date date NOT NULL,
  received_by text NOT NULL,
  store_name text NOT NULL,
  notes text NOT NULL DEFAULT '',
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  unit_cost numeric NOT NULL CHECK (unit_cost > 0),
  tax_rate numeric NOT NULL DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 100),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  tax_amount numeric NOT NULL CHECK (tax_amount >= 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  idempotency_key text NOT NULL UNIQUE,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bmb_inventory_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.bmb_inventory_receipts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.bmb_inventory_receipts TO authenticated;
DROP POLICY IF EXISTS bmb_inventory_receipts_staff_read ON public.bmb_inventory_receipts;
CREATE POLICY bmb_inventory_receipts_staff_read
  ON public.bmb_inventory_receipts
  FOR SELECT TO authenticated
  USING (public.bmb_has_staff_permission('inventory','read'));

CREATE OR REPLACE FUNCTION public.bmb_receive_inventory_purchase_with_grn(
  p_indent_id text,
  p_inventory_id text,
  p_quantity numeric,
  p_idempotency_key text,
  p_grn_number text,
  p_supplier_name text,
  p_supplier_contact text,
  p_supplier_address text,
  p_supplier_gstin text,
  p_invoice_number text,
  p_invoice_date date,
  p_received_date date,
  p_received_by text,
  p_store_name text,
  p_notes text,
  p_unit_cost numeric,
  p_tax_rate numeric
)
RETURNS TABLE(
  receipt_id text,
  grn_number text,
  inventory_id text,
  item_name text,
  current_stock numeric,
  received_quantity numeric,
  quantity_needed numeric,
  unit text,
  status text,
  subtotal numeric,
  tax_amount numeric,
  total_amount numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_indent public.bmb_chef_indents;
  v_item public.bmb_inventory;
  v_existing public.bmb_inventory_receipts;
  v_received record;
  v_subtotal numeric;
  v_tax_amount numeric;
  v_total numeric;
  v_receipt_id text;
BEGIN
  IF NOT public.bmb_has_staff_permission('inventory','write') THEN
    RAISE EXCEPTION 'You do not have permission to receive inventory';
  END IF;
  IF NULLIF(trim(p_idempotency_key),'') IS NULL OR NULLIF(trim(p_grn_number),'') IS NULL THEN
    RAISE EXCEPTION 'A receipt idempotency key and GRN number are required';
  END IF;
  IF NULLIF(trim(p_supplier_name),'') IS NULL OR NULLIF(trim(p_received_by),'') IS NULL OR NULLIF(trim(p_store_name),'') IS NULL THEN
    RAISE EXCEPTION 'Supplier, received-by and store fields are required';
  END IF;
  IF p_quantity IS NULL OR p_quantity<=0 THEN
    RAISE EXCEPTION 'Received quantity must be greater than zero';
  END IF;
  IF p_unit_cost IS NULL OR p_unit_cost<=0 THEN
    RAISE EXCEPTION 'Unit cost must be greater than zero';
  END IF;
  IF p_tax_rate IS NULL OR p_tax_rate<0 OR p_tax_rate>100 THEN
    RAISE EXCEPTION 'Tax rate must be between 0 and 100';
  END IF;
  IF p_received_date IS NULL THEN
    RAISE EXCEPTION 'Goods received date is required';
  END IF;

  SELECT * INTO v_indent FROM public.bmb_chef_indents WHERE id=p_indent_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Purchase indent not found'; END IF;

  SELECT * INTO v_existing FROM public.bmb_inventory_receipts
  WHERE idempotency_key=trim(p_idempotency_key);
  IF FOUND THEN
    IF v_existing.indent_id IS DISTINCT FROM p_indent_id
       OR v_existing.inventory_id IS DISTINCT FROM p_inventory_id
       OR v_existing.quantity IS DISTINCT FROM p_quantity
       OR v_existing.grn_number IS DISTINCT FROM trim(p_grn_number)
       OR v_existing.unit_cost IS DISTINCT FROM p_unit_cost
       OR v_existing.tax_rate IS DISTINCT FROM p_tax_rate THEN
      RAISE EXCEPTION 'Idempotency key was already used for a different GRN receipt';
    END IF;
    SELECT * INTO v_item FROM public.bmb_inventory WHERE id=p_inventory_id;
    RETURN QUERY SELECT v_existing.receipt_id,v_existing.grn_number,v_item.id,v_item.name,
      v_item.current_stock,COALESCE(v_indent.received_quantity,0),v_indent.quantity_needed,
      v_item.unit,v_indent.status,v_existing.subtotal,v_existing.tax_amount,v_existing.total_amount;
    RETURN;
  END IF;

  SELECT * INTO v_item FROM public.bmb_inventory WHERE id=p_inventory_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inventory item not found'; END IF;

  v_subtotal := round(p_quantity*p_unit_cost,2);
  v_tax_amount := round(v_subtotal*p_tax_rate/100,2);
  v_total := round(v_subtotal+v_tax_amount,2);
  v_receipt_id := 'GRNROW-' || extract(epoch from clock_timestamp())::bigint || '-' || substr(md5(random()::text),1,8);

  -- Keep cost, stock movement, indent receipt quantity and GRN metadata atomic.
  UPDATE public.bmb_inventory
  SET cost_per_unit=p_unit_cost, updated_at=now()
  WHERE id=p_inventory_id;

  SELECT * INTO v_received
  FROM public.bmb_receive_inventory_purchase_idempotent(
    p_indent_id,p_inventory_id,p_quantity,trim(p_idempotency_key)
  );

  INSERT INTO public.bmb_inventory_receipts(
    receipt_id,grn_number,indent_id,inventory_id,supplier_name,supplier_contact,
    supplier_address,supplier_gstin,invoice_number,invoice_date,received_date,
    received_by,store_name,notes,quantity,unit,unit_cost,tax_rate,subtotal,
    tax_amount,total_amount,idempotency_key,created_by
  ) VALUES (
    v_receipt_id,trim(p_grn_number),p_indent_id,p_inventory_id,trim(p_supplier_name),
    COALESCE(p_supplier_contact,''),COALESCE(p_supplier_address,''),COALESCE(p_supplier_gstin,''),
    COALESCE(p_invoice_number,''),p_invoice_date,p_received_date,trim(p_received_by),
    trim(p_store_name),COALESCE(p_notes,''),p_quantity,v_received.unit,p_unit_cost,p_tax_rate,
    v_subtotal,v_tax_amount,v_total,trim(p_idempotency_key),auth.uid()
  );

  RETURN QUERY SELECT v_receipt_id,trim(p_grn_number),v_received.inventory_id,v_received.item_name,
    v_received.current_stock,v_received.received_quantity,v_received.quantity_needed,
    v_received.unit,v_received.status,v_subtotal,v_tax_amount,v_total;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_receive_inventory_purchase_with_grn(text,text,numeric,text,text,text,text,text,text,text,date,date,text,text,text,numeric,numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_receive_inventory_purchase_with_grn(text,text,numeric,text,text,text,text,text,text,text,date,date,text,text,text,numeric,numeric) TO authenticated;
