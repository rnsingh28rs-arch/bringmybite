-- Secure staff, inventory and purchase approval data. Keep stock changes in the ledger RPC.

CREATE OR REPLACE FUNCTION public.bmb_is_dadmin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.bmb_admin_users a
    WHERE a.user_id=auth.uid()::text AND a.active=true AND a.role_id='ceo-director'
  );
$function$;

CREATE OR REPLACE FUNCTION public.bmb_is_inventory_finance_staff()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.bmb_admin_users a
    WHERE a.user_id=auth.uid()::text AND a.active=true
      AND a.role_id IN ('manager','admin','ceo-director')
  );
$function$;

REVOKE ALL ON FUNCTION public.bmb_is_dadmin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_is_dadmin() TO authenticated;
REVOKE ALL ON FUNCTION public.bmb_is_inventory_finance_staff() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_is_inventory_finance_staff() TO authenticated;

-- Staff identity and role permissions are D-Admin-only.
DROP POLICY IF EXISTS "bmb admin users public delete" ON public.bmb_admin_users;
DROP POLICY IF EXISTS "bmb admin users public insert" ON public.bmb_admin_users;
DROP POLICY IF EXISTS "bmb admin users public read" ON public.bmb_admin_users;
DROP POLICY IF EXISTS "bmb admin users public update" ON public.bmb_admin_users;
ALTER TABLE public.bmb_admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY bmb_dadmin_users_read ON public.bmb_admin_users FOR SELECT TO authenticated USING (public.bmb_is_dadmin());
CREATE POLICY bmb_dadmin_users_insert ON public.bmb_admin_users FOR INSERT TO authenticated WITH CHECK (public.bmb_is_dadmin());
CREATE POLICY bmb_dadmin_users_update ON public.bmb_admin_users FOR UPDATE TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());
CREATE POLICY bmb_dadmin_users_delete ON public.bmb_admin_users FOR DELETE TO authenticated USING (public.bmb_is_dadmin());
REVOKE ALL ON public.bmb_admin_users FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmb_admin_users TO authenticated;

DROP POLICY IF EXISTS bmb_public_full_access ON public.bmb_permissions;
ALTER TABLE public.bmb_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY bmb_dadmin_permissions_read ON public.bmb_permissions FOR SELECT TO authenticated USING (public.bmb_is_dadmin());
CREATE POLICY bmb_dadmin_permissions_insert ON public.bmb_permissions FOR INSERT TO authenticated WITH CHECK (public.bmb_is_dadmin());
CREATE POLICY bmb_dadmin_permissions_update ON public.bmb_permissions FOR UPDATE TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());
CREATE POLICY bmb_dadmin_permissions_delete ON public.bmb_permissions FOR DELETE TO authenticated USING (public.bmb_is_dadmin());
REVOKE ALL ON public.bmb_permissions FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmb_permissions TO authenticated;

-- Inventory is private. Role policies control access and stock balances cannot be directly overwritten.
DROP POLICY IF EXISTS bmb_public_full_access ON public.bmb_inventory;
ALTER TABLE public.bmb_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY bmb_inventory_staff_read ON public.bmb_inventory FOR SELECT TO authenticated USING (public.bmb_has_staff_permission('inventory','read'));
CREATE POLICY bmb_inventory_staff_insert ON public.bmb_inventory FOR INSERT TO authenticated WITH CHECK (public.bmb_has_staff_permission('inventory','add'));
CREATE POLICY bmb_inventory_staff_update ON public.bmb_inventory FOR UPDATE TO authenticated USING (public.bmb_has_staff_permission('inventory','write')) WITH CHECK (public.bmb_has_staff_permission('inventory','write'));
CREATE POLICY bmb_inventory_staff_delete ON public.bmb_inventory FOR DELETE TO authenticated USING (public.bmb_has_staff_permission('inventory','delete'));
REVOKE ALL ON public.bmb_inventory FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmb_inventory TO authenticated;

DROP POLICY IF EXISTS bmb_public_full_access ON public.bmb_chef_indents;
ALTER TABLE public.bmb_chef_indents ENABLE ROW LEVEL SECURITY;
CREATE POLICY bmb_chef_indents_staff_read ON public.bmb_chef_indents FOR SELECT TO authenticated USING (public.bmb_has_staff_permission('chef-indents','read'));
CREATE POLICY bmb_chef_indents_staff_insert ON public.bmb_chef_indents FOR INSERT TO authenticated WITH CHECK (public.bmb_has_staff_permission('chef-indents','add'));
CREATE POLICY bmb_chef_indents_staff_update ON public.bmb_chef_indents FOR UPDATE TO authenticated USING (public.bmb_has_staff_permission('chef-indents','write')) WITH CHECK (public.bmb_has_staff_permission('chef-indents','write'));
CREATE POLICY bmb_chef_indents_staff_delete ON public.bmb_chef_indents FOR DELETE TO authenticated USING (public.bmb_has_staff_permission('chef-indents','delete'));
REVOKE ALL ON public.bmb_chef_indents FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmb_chef_indents TO authenticated;

DROP POLICY IF EXISTS bmb_public_full_access ON public.bmb_inventory_purchase_requests;
DROP POLICY IF EXISTS bmb_public_full_access ON public.bmb_inventory_purchase_request_lines;
ALTER TABLE public.bmb_inventory_purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bmb_inventory_purchase_request_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY bmb_inventory_purchase_requests_finance_read ON public.bmb_inventory_purchase_requests FOR SELECT TO authenticated USING (public.bmb_is_inventory_finance_staff());
CREATE POLICY bmb_inventory_purchase_lines_finance_read ON public.bmb_inventory_purchase_request_lines FOR SELECT TO authenticated USING (public.bmb_is_inventory_finance_staff());
REVOKE ALL ON public.bmb_inventory_purchase_requests FROM PUBLIC, anon;
REVOKE ALL ON public.bmb_inventory_purchase_request_lines FROM PUBLIC, anon;
GRANT SELECT ON public.bmb_inventory_purchase_requests TO authenticated;
GRANT SELECT ON public.bmb_inventory_purchase_request_lines TO authenticated;

-- Protect payment and receipt fields against direct table edits.
CREATE OR REPLACE FUNCTION public.bmb_guard_chef_indent_updates()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_role text;
BEGIN
  SELECT a.role_id INTO v_role FROM public.bmb_admin_users a
  WHERE a.user_id=auth.uid()::text AND a.active=true LIMIT 1;
  IF v_role IS NULL THEN RAISE EXCEPTION 'An active staff session is required to change stock requests'; END IF;

  IF TG_OP='INSERT' THEN
    IF COALESCE(NEW.payment_status,'Not Submitted')<>'Not Submitted'
       OR NEW.payment_request_id IS NOT NULL OR NEW.payment_approved_by IS NOT NULL
       OR NEW.payment_approved_at IS NOT NULL OR NEW.received_quantity IS NOT NULL
       OR NEW.received_at IS NOT NULL THEN
      RAISE EXCEPTION 'New chef indents cannot be inserted as payment-approved or received';
    END IF;
    RETURN NEW;
  END IF;

  IF (NEW.status IS DISTINCT FROM OLD.status OR NEW.approved_by IS DISTINCT FROM OLD.approved_by)
     AND v_role NOT IN ('manager','admin','ceo-director') THEN
    RAISE EXCEPTION 'Only Manager, Admin or D-Admin can approve or reject stock requests';
  END IF;
  IF NEW.purchase_price IS DISTINCT FROM OLD.purchase_price
     AND v_role NOT IN ('manager','admin','ceo-director') THEN
    RAISE EXCEPTION 'Only finance staff can change purchase prices';
  END IF;
  IF NEW.payment_request_id IS DISTINCT FROM OLD.payment_request_id
     AND v_role NOT IN ('manager','admin','ceo-director') THEN
    RAISE EXCEPTION 'Only finance staff can link a payment request';
  END IF;

  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    IF NEW.payment_status='Approved' THEN
      IF v_role NOT IN ('admin','ceo-director')
         OR current_setting('app.bmb_payment_approval_rpc',true) IS DISTINCT FROM 'true' THEN
        RAISE EXCEPTION 'Payment approval must use the Admin approval workflow';
      END IF;
    ELSIF NEW.payment_status='Rejected' AND OLD.payment_request_id IS NOT NULL THEN
      IF v_role NOT IN ('admin','ceo-director')
         OR current_setting('app.bmb_payment_rejection_rpc',true) IS DISTINCT FROM 'true' THEN
        RAISE EXCEPTION 'Payment rejection must use the Admin rejection workflow';
      END IF;
    ELSIF v_role NOT IN ('manager','admin','ceo-director') THEN
      RAISE EXCEPTION 'Only finance staff can change payment status';
    END IF;
  END IF;

  IF NEW.payment_approved_by IS DISTINCT FROM OLD.payment_approved_by
     OR NEW.payment_approved_at IS DISTINCT FROM OLD.payment_approved_at THEN
    IF v_role NOT IN ('admin','ceo-director')
       OR current_setting('app.bmb_payment_approval_rpc',true) IS DISTINCT FROM 'true' THEN
      RAISE EXCEPTION 'Payment approval audit fields are protected';
    END IF;
  END IF;

  IF NEW.payment_rejection_note IS DISTINCT FROM OLD.payment_rejection_note THEN
    IF v_role NOT IN ('admin','ceo-director')
       OR current_setting('app.bmb_payment_rejection_rpc',true) IS DISTINCT FROM 'true' THEN
      RAISE EXCEPTION 'Payment rejection notes are protected';
    END IF;
  END IF;

  IF NEW.received_quantity IS DISTINCT FROM OLD.received_quantity
     OR NEW.received_at IS DISTINCT FROM OLD.received_at
     OR NEW.purchase_note IS DISTINCT FROM OLD.purchase_note THEN
    IF v_role NOT IN ('manager','admin','ceo-director')
       OR current_setting('app.bmb_inventory_receipt_rpc',true) IS DISTINCT FROM 'true' THEN
      RAISE EXCEPTION 'Record received stock through the approved receipt workflow';
    END IF;
  END IF;

  IF NEW.status='Delivered' AND OLD.status IS DISTINCT FROM NEW.status
     AND current_setting('app.bmb_inventory_receipt_rpc',true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'A purchase can be marked Delivered only through the receipt workflow';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS bmb_guard_chef_indent_updates ON public.bmb_chef_indents;
CREATE TRIGGER bmb_guard_chef_indent_updates BEFORE INSERT OR UPDATE ON public.bmb_chef_indents
FOR EACH ROW EXECUTE FUNCTION public.bmb_guard_chef_indent_updates();
REVOKE ALL ON FUNCTION public.bmb_guard_chef_indent_updates() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.bmb_guard_inventory_stock_updates()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.current_stock IS DISTINCT FROM OLD.current_stock
     AND current_setting('app.bmb_inventory_movement_rpc',true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'Use the inventory receipt, consumption or adjustment workflow to change stock';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS bmb_guard_inventory_stock_updates ON public.bmb_inventory;
CREATE TRIGGER bmb_guard_inventory_stock_updates BEFORE UPDATE OF current_stock ON public.bmb_inventory
FOR EACH ROW EXECUTE FUNCTION public.bmb_guard_inventory_stock_updates();
REVOKE ALL ON FUNCTION public.bmb_guard_inventory_stock_updates() FROM PUBLIC, anon, authenticated;

-- Update the stock movement function to mark its authorized transactional write.
CREATE OR REPLACE FUNCTION public.bmb_record_inventory_movement(
  p_inventory_id text,
  p_quantity numeric,
  p_movement_type text,
  p_source text DEFAULT ''::text,
  p_reference_id text DEFAULT NULL::text,
  p_notes text DEFAULT ''::text
)
RETURNS public.bmb_inventory
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_item public.bmb_inventory;
  v_next numeric;
  v_id text := 'MOV-' || extract(epoch from clock_timestamp())::bigint || '-' || substr(md5(random()::text),1,8);
  v_allowed boolean := false;
BEGIN
  IF p_quantity IS NULL OR p_quantity<0 THEN RAISE EXCEPTION 'Quantity must be zero or greater'; END IF;
  IF p_movement_type IN ('RECEIPT','ADJUSTMENT') THEN
    v_allowed := public.bmb_has_staff_permission('inventory','write');
  ELSIF p_movement_type='CONSUMPTION' THEN
    v_allowed := public.bmb_has_staff_permission('inventory','write') OR public.bmb_has_staff_permission('chef-indents','write');
  END IF;
  IF NOT v_allowed THEN RAISE EXCEPTION 'You do not have permission to change inventory'; END IF;

  SELECT * INTO v_item FROM public.bmb_inventory WHERE id=p_inventory_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inventory item not found'; END IF;
  IF p_movement_type='RECEIPT' THEN
    v_next:=COALESCE(v_item.current_stock,0)+p_quantity;
  ELSIF p_movement_type='CONSUMPTION' THEN
    v_next:=COALESCE(v_item.current_stock,0)-p_quantity;
    IF v_next<0 THEN RAISE EXCEPTION 'Insufficient stock: % % available, % requested',v_item.current_stock,v_item.unit,p_quantity; END IF;
  ELSIF p_movement_type='ADJUSTMENT' THEN
    v_next:=p_quantity;
  ELSE
    RAISE EXCEPTION 'Invalid inventory movement type';
  END IF;

  PERFORM set_config('app.bmb_inventory_movement_rpc','true',true);
  UPDATE public.bmb_inventory
  SET current_stock=GREATEST(0,v_next),
      status=CASE WHEN GREATEST(0,v_next)<=0 THEN 'Critical'
                  WHEN GREATEST(0,v_next)<=COALESCE(min_threshold,0) THEN 'Low Stock'
                  ELSE 'In Stock' END,
      last_restocked=CASE WHEN p_movement_type='RECEIPT' THEN current_date ELSE last_restocked END,
      updated_at=now()
  WHERE id=p_inventory_id RETURNING * INTO v_item;

  INSERT INTO public.bmb_inventory_movements(
    id,inventory_id,ingredient_name,movement_type,quantity,unit,source,reference_id,notes,created_by
  ) VALUES(
    v_id,p_inventory_id,v_item.name,p_movement_type,p_quantity,v_item.unit,
    COALESCE(p_source,''),p_reference_id,COALESCE(p_notes,''),auth.uid()
  );
  RETURN v_item;
END;
$function$;
REVOKE ALL ON FUNCTION public.bmb_record_inventory_movement(text,numeric,text,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_record_inventory_movement(text,numeric,text,text,text,text) TO authenticated;

-- Admin rejection is atomic; no half-approved/half-rejected purchase request can remain.
CREATE OR REPLACE FUNCTION public.bmb_reject_inventory_purchase_payment(
  p_request_id text,
  p_rejection_note text DEFAULT 'Rejected by Admin'
)
RETURNS TABLE (request_id text, request_status text, rejected_items integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_request public.bmb_inventory_purchase_requests;
  v_username text;
  v_line_count integer;
  v_updated_count integer;
  v_note text:=COALESCE(NULLIF(trim(p_rejection_note),''),'Rejected by Admin');
BEGIN
  SELECT a.username INTO v_username FROM public.bmb_admin_users a
  WHERE a.user_id=auth.uid()::text AND a.active=true AND a.role_id IN ('admin','ceo-director') LIMIT 1;
  IF v_username IS NULL THEN RAISE EXCEPTION 'Only an active Admin or D-Admin can reject inventory payments'; END IF;

  SELECT * INTO v_request FROM public.bmb_inventory_purchase_requests WHERE id=p_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inventory payment request not found'; END IF;
  IF v_request.status<>'Pending Admin Approval' THEN RAISE EXCEPTION 'This payment request is not waiting for Admin approval'; END IF;

  SELECT count(*) INTO v_line_count FROM public.bmb_inventory_purchase_request_lines l WHERE l.request_id=p_request_id;
  IF v_line_count=0 THEN RAISE EXCEPTION 'Payment request has no purchase lines'; END IF;
  IF EXISTS (
    SELECT 1 FROM public.bmb_inventory_purchase_request_lines l
    LEFT JOIN public.bmb_chef_indents i ON i.id=l.indent_id
    WHERE l.request_id=p_request_id AND (i.id IS NULL OR i.payment_request_id IS DISTINCT FROM p_request_id)
  ) THEN RAISE EXCEPTION 'One or more purchase lines are not linked to their stock request'; END IF;

  UPDATE public.bmb_inventory_purchase_requests
  SET status='Rejected',reviewed_by=v_username,reviewed_at=now(),rejection_note=v_note,updated_at=now()
  WHERE id=p_request_id;

  PERFORM set_config('app.bmb_payment_rejection_rpc','true',true);
  UPDATE public.bmb_chef_indents i
  SET payment_status='Rejected',payment_request_id=NULL,payment_rejection_note=v_note,updated_at=now()
  FROM public.bmb_inventory_purchase_request_lines l
  WHERE l.request_id=p_request_id AND i.id=l.indent_id;
  GET DIAGNOSTICS v_updated_count=ROW_COUNT;
  IF v_updated_count<>v_line_count THEN RAISE EXCEPTION 'Not all stock requests were updated for payment rejection'; END IF;
  RETURN QUERY SELECT p_request_id,'Rejected'::text,v_updated_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_reject_inventory_purchase_payment(text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_reject_inventory_purchase_payment(text,text) TO authenticated;

-- Chef can view stock and record consumption, but cannot change inventory balances.
UPDATE public.bmb_permissions SET can_write=false,can_add=false,can_delete=false
WHERE role_id='chef' AND panel_id='inventory';

