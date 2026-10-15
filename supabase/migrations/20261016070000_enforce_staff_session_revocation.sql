-- Revoke staff sessions at the database boundary, not only in browser storage.
CREATE TABLE IF NOT EXISTS public.bmb_revoked_staff_sessions (
  session_id text PRIMARY KEY,
  revoked_at timestamptz NOT NULL DEFAULT now(),
  revoked_by text NOT NULL,
  reason text NOT NULL
);
ALTER TABLE public.bmb_revoked_staff_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.bmb_revoked_staff_sessions FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.bmb_staff_session_is_valid()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT auth.uid() IS NOT NULL
    AND NULLIF(auth.jwt()->>'session_id', '') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.bmb_revoked_staff_sessions r
      WHERE r.session_id = auth.jwt()->>'session_id'
    );
$function$;
REVOKE ALL ON FUNCTION public.bmb_staff_session_is_valid() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_staff_session_is_valid() TO authenticated;

CREATE OR REPLACE FUNCTION public.bmb_revoke_staff_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_session_id text := auth.jwt()->>'session_id';
BEGIN
  IF auth.uid() IS NULL OR NULLIF(v_session_id, '') IS NULL THEN
    RAISE EXCEPTION 'An authenticated staff session is required to revoke this session';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.bmb_admin_users a
    WHERE a.user_id = auth.uid()::text AND a.active = true
  ) THEN
    RAISE EXCEPTION 'An active staff account is required to revoke this session';
  END IF;
  INSERT INTO public.bmb_revoked_staff_sessions(session_id, revoked_by, reason)
  VALUES (v_session_id, auth.uid()::text, 'logout')
  ON CONFLICT (session_id) DO NOTHING;
  RETURN true;
END;
$function$;
REVOKE ALL ON FUNCTION public.bmb_revoke_staff_session() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_revoke_staff_session() TO authenticated;

CREATE OR REPLACE FUNCTION public.bmb_revoke_staff_sessions_for_user(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_count integer;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'A target staff user is required';
  END IF;
  INSERT INTO public.bmb_revoked_staff_sessions(session_id, revoked_by, reason)
  SELECT s.id::text, 'staff-password-update', 'password-reset'
  FROM auth.sessions s
  WHERE s.user_id = p_user_id
  ON CONFLICT (session_id) DO NOTHING;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$function$;
REVOKE ALL ON FUNCTION public.bmb_revoke_staff_sessions_for_user(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bmb_revoke_staff_sessions_for_user(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.bmb_has_staff_permission(p_panel_id text, p_action text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.bmb_admin_users a
    JOIN public.bmb_permissions p ON p.role_id = a.role_id
    WHERE public.bmb_staff_session_is_valid()
      AND a.user_id = auth.uid()::text
      AND a.active = true
      AND p.panel_id = p_panel_id
      AND CASE
        WHEN p_action = 'read' THEN p.can_read
        WHEN p_action = 'write' THEN p.can_write
        WHEN p_action = 'add' THEN p.can_add
        WHEN p_action = 'delete' THEN p.can_delete
        ELSE false
      END
  );
$function$


CREATE OR REPLACE FUNCTION public.bmb_is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.bmb_admin_users a
    WHERE public.bmb_staff_session_is_valid()
      AND a.user_id = auth.uid()::text AND a.active = true AND a.role_id = 'admin'
  );
$function$


CREATE OR REPLACE FUNCTION public.bmb_is_dadmin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.bmb_admin_users a
    WHERE public.bmb_staff_session_is_valid()
      AND a.user_id = auth.uid()::text
      AND a.active = true
      AND a.role_id = 'ceo-director'
  );
$function$


CREATE OR REPLACE FUNCTION public.bmb_is_inventory_finance_staff()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.bmb_admin_users a
    WHERE public.bmb_staff_session_is_valid()
      AND a.user_id = auth.uid()::text
      AND a.active = true
      AND a.role_id IN ('manager','admin','ceo-director')
  );
$function$


CREATE OR REPLACE FUNCTION public.bmb_get_staff_account()
 RETURNS TABLE(user_id uuid, username text, email text, role_id text, active boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT a.user_id::uuid, a.username, a.email, a.role_id, a.active
  FROM public.bmb_admin_users a
  WHERE public.bmb_staff_session_is_valid()
    AND a.user_id = auth.uid()::text
    AND a.active = true
  LIMIT 1;
$function$


CREATE OR REPLACE FUNCTION public.bmb_approve_inventory_purchase_payment(p_request_id text)
 RETURNS TABLE(request_id text, request_status text, approved_items integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_request public.bmb_inventory_purchase_requests;
  v_username text;
  v_line_count integer;
  v_updated_count integer;
BEGIN
  SELECT a.username INTO v_username
  FROM public.bmb_admin_users a
  WHERE public.bmb_staff_session_is_valid()
    AND a.user_id = auth.uid()::text AND a.active = true
    AND a.role_id IN ('admin','ceo-director')
  LIMIT 1;
  IF v_username IS NULL THEN
    RAISE EXCEPTION 'Only an active Admin or D-Admin can approve inventory payments';
  END IF;

  SELECT * INTO v_request FROM public.bmb_inventory_purchase_requests
  WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inventory payment request not found'; END IF;
  IF v_request.status <> 'Pending Admin Approval' THEN
    RAISE EXCEPTION 'This payment request is not waiting for Admin approval';
  END IF;

  SELECT count(*) INTO v_line_count
  FROM public.bmb_inventory_purchase_request_lines l WHERE l.request_id = p_request_id;
  IF v_line_count = 0 THEN RAISE EXCEPTION 'Payment request has no purchase lines'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.bmb_inventory_purchase_request_lines l
    LEFT JOIN public.bmb_chef_indents i ON i.id = l.indent_id
    WHERE l.request_id = p_request_id
      AND (i.id IS NULL OR i.payment_request_id IS DISTINCT FROM p_request_id)
  ) THEN
    RAISE EXCEPTION 'One or more purchase lines are not linked to their stock request';
  END IF;

  UPDATE public.bmb_inventory_purchase_requests
  SET status='Approved', reviewed_by=v_username, reviewed_at=now(), updated_at=now()
  WHERE id=p_request_id;

  PERFORM set_config('app.bmb_payment_approval_rpc','true',true);

  UPDATE public.bmb_chef_indents i
  SET payment_status='Approved', payment_approved_by=v_username,
      payment_approved_at=now(), updated_at=now()
  FROM public.bmb_inventory_purchase_request_lines l
  WHERE l.request_id=p_request_id AND i.id=l.indent_id;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  IF v_updated_count <> v_line_count THEN
    RAISE EXCEPTION 'Not all stock requests were updated for payment approval';
  END IF;

  RETURN QUERY SELECT p_request_id,'Approved'::text,v_updated_count;
END;
$function$


CREATE OR REPLACE FUNCTION public.bmb_reject_inventory_purchase_payment(p_request_id text, p_rejection_note text DEFAULT 'Rejected by Admin'::text)
 RETURNS TABLE(request_id text, request_status text, rejected_items integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_request public.bmb_inventory_purchase_requests;
  v_username text;
  v_line_count integer;
  v_updated_count integer;
  v_note text := COALESCE(NULLIF(trim(p_rejection_note),''),'Rejected by Admin');
BEGIN
  SELECT a.username INTO v_username
  FROM public.bmb_admin_users a
  WHERE public.bmb_staff_session_is_valid()
    AND a.user_id = auth.uid()::text
    AND a.active = true
    AND a.role_id IN ('admin','ceo-director')
  LIMIT 1;

  IF v_username IS NULL THEN
    RAISE EXCEPTION 'Only an active Admin or D-Admin can reject inventory payments';
  END IF;

  SELECT * INTO v_request
  FROM public.bmb_inventory_purchase_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory payment request not found';
  END IF;

  IF v_request.status <> 'Pending Admin Approval' THEN
    RAISE EXCEPTION 'This payment request is not waiting for Admin approval';
  END IF;

  SELECT count(*) INTO v_line_count
  FROM public.bmb_inventory_purchase_request_lines l
  WHERE l.request_id = p_request_id;

  IF v_line_count = 0 THEN
    RAISE EXCEPTION 'Payment request has no purchase lines';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.bmb_inventory_purchase_request_lines l
    LEFT JOIN public.bmb_chef_indents i ON i.id = l.indent_id
    WHERE l.request_id = p_request_id
      AND (i.id IS NULL OR i.payment_request_id IS DISTINCT FROM p_request_id)
  ) THEN
    RAISE EXCEPTION 'One or more purchase lines are not linked to their stock request';
  END IF;

  UPDATE public.bmb_inventory_purchase_requests
  SET status = 'Rejected',
      reviewed_by = v_username,
      reviewed_at = now(),
      rejection_note = v_note,
      updated_at = now()
  WHERE id = p_request_id;

  PERFORM set_config('app.bmb_payment_rejection_rpc','true',true);

  UPDATE public.bmb_chef_indents i
  SET payment_status = 'Rejected',
      payment_request_id = NULL,
      payment_rejection_note = v_note,
      updated_at = now()
  FROM public.bmb_inventory_purchase_request_lines l
  WHERE l.request_id = p_request_id
    AND i.id = l.indent_id;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  IF v_updated_count <> v_line_count THEN
    RAISE EXCEPTION 'Not all stock requests were updated for payment rejection';
  END IF;

  RETURN QUERY SELECT p_request_id, 'Rejected'::text, v_updated_count;
END;
$function$


CREATE OR REPLACE FUNCTION public.bmb_submit_inventory_purchase_request(p_request_id text, p_indent_ids text[])
 RETURNS TABLE(request_id text, total_amount numeric, line_count integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_username text;
  v_indent public.bmb_chef_indents;
  v_count integer := 0;
  v_unique_count integer := 0;
  v_updated_count integer;
  v_line_total numeric;
  v_total numeric := 0;
BEGIN
  SELECT a.username INTO v_username
  FROM public.bmb_admin_users a
  WHERE public.bmb_staff_session_is_valid()
    AND a.user_id = auth.uid()::text
    AND a.active = true
    AND a.role_id IN ('manager','admin','ceo-director')
  LIMIT 1;

  IF v_username IS NULL THEN
    RAISE EXCEPTION 'Only an active Manager, Admin or D-Admin can submit purchase requests';
  END IF;

  IF p_request_id IS NULL OR trim(p_request_id) = '' THEN
    RAISE EXCEPTION 'Purchase request ID is required';
  END IF;

  IF p_indent_ids IS NULL OR cardinality(p_indent_ids) = 0 THEN
    RAISE EXCEPTION 'Select at least one approved stock request';
  END IF;

  SELECT count(DISTINCT x) INTO v_unique_count
  FROM unnest(p_indent_ids) AS x;

  IF v_unique_count <> cardinality(p_indent_ids) THEN
    RAISE EXCEPTION 'Duplicate stock request IDs were submitted';
  END IF;

  FOR v_indent IN
    SELECT i.*
    FROM public.bmb_chef_indents i
    WHERE i.id = ANY(p_indent_ids)
    ORDER BY i.id
    FOR UPDATE
  LOOP
    IF v_indent.status <> 'Approved' THEN
      RAISE EXCEPTION 'Stock request % must have Manager approval before payment submission', v_indent.id;
    END IF;

    IF v_indent.payment_status IN ('Pending Admin Approval','Approved')
       OR v_indent.payment_request_id IS NOT NULL THEN
      RAISE EXCEPTION 'Stock request % is already linked to a payment request', v_indent.id;
    END IF;

    IF v_indent.purchase_price IS NULL OR v_indent.purchase_price <= 0 THEN
      RAISE EXCEPTION 'Enter a valid purchase price for % before submitting', v_indent.item_name;
    END IF;

    IF v_indent.quantity_needed IS NULL OR v_indent.quantity_needed <= 0 THEN
      RAISE EXCEPTION 'Requested quantity must be greater than zero for %', v_indent.item_name;
    END IF;

    v_line_total := round(v_indent.quantity_needed * v_indent.purchase_price, 2);
    IF v_line_total <= 0 THEN
      RAISE EXCEPTION 'Purchase total must be greater than zero for %', v_indent.item_name;
    END IF;

    v_total := v_total + v_line_total;
    v_count := v_count + 1;
  END LOOP;

  IF v_count <> cardinality(p_indent_ids) THEN
    RAISE EXCEPTION 'One or more selected stock requests could not be found';
  END IF;

  INSERT INTO public.bmb_inventory_purchase_requests(
    id,total_amount,status,requested_by,requested_at,created_at,updated_at
  ) VALUES (
    p_request_id,round(v_total,2),'Pending Admin Approval',v_username,now(),now(),now()
  );

  INSERT INTO public.bmb_inventory_purchase_request_lines(
    request_id,indent_id,item_name,quantity,unit,purchase_price,line_total
  )
  SELECT p_request_id,i.id,i.item_name,i.quantity_needed,i.unit,i.purchase_price,
         round(i.quantity_needed*i.purchase_price,2)
  FROM public.bmb_chef_indents i
  WHERE i.id = ANY(p_indent_ids);

  UPDATE public.bmb_chef_indents
  SET payment_request_id = p_request_id,
      payment_status = 'Pending Admin Approval',
      updated_at = now()
  WHERE id = ANY(p_indent_ids);

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  IF v_updated_count <> v_count THEN
    RAISE EXCEPTION 'Not all stock requests were linked to the payment request';
  END IF;

  RETURN QUERY SELECT p_request_id,round(v_total,2),v_count;
END;
$function$


CREATE OR REPLACE FUNCTION public.bmb_guard_chef_indent_updates()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_role text;
BEGIN
  SELECT a.role_id INTO v_role
  FROM public.bmb_admin_users a
  WHERE a.user_id = auth.uid()::text AND a.active = true
  LIMIT 1;

  IF v_role IS NULL OR NOT public.bmb_staff_session_is_valid() THEN
    RAISE EXCEPTION 'An active staff session is required to change stock requests';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.payment_status,'Not Submitted') <> 'Not Submitted'
       OR NEW.payment_request_id IS NOT NULL
       OR NEW.payment_approved_by IS NOT NULL
       OR NEW.payment_approved_at IS NOT NULL
       OR NEW.received_quantity IS NOT NULL
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
    IF NEW.payment_status = 'Approved' THEN
      IF v_role NOT IN ('admin','ceo-director')
         OR current_setting('app.bmb_payment_approval_rpc',true) IS DISTINCT FROM 'true' THEN
        RAISE EXCEPTION 'Payment approval must be completed by the Admin approval workflow';
      END IF;
    ELSIF NEW.payment_status = 'Rejected' AND OLD.payment_request_id IS NOT NULL THEN
      IF v_role NOT IN ('admin','ceo-director')
         OR current_setting('app.bmb_payment_rejection_rpc',true) IS DISTINCT FROM 'true' THEN
        RAISE EXCEPTION 'Payment rejection must be completed by the Admin rejection workflow';
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

  IF NEW.status = 'Delivered' AND OLD.status IS DISTINCT FROM NEW.status
     AND current_setting('app.bmb_inventory_receipt_rpc',true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'A purchase can be marked Delivered only through the receipt workflow';
  END IF;

  RETURN NEW;
END;
$function$;

DROP POLICY IF EXISTS bmb_staff_read_own_admin_user ON public.bmb_admin_users;
CREATE POLICY bmb_staff_read_own_admin_user ON public.bmb_admin_users
  FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text AND public.bmb_staff_session_is_valid());
