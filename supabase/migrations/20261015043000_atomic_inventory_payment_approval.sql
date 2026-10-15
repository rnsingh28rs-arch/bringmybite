-- Keep payment approval and linked indent statuses in one transaction.
CREATE OR REPLACE FUNCTION public.bmb_approve_inventory_purchase_payment(p_request_id text)
RETURNS TABLE (request_id text, request_status text, approved_items integer)
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
  WHERE a.user_id = auth.uid()::text
    AND a.active = true
    AND a.role_id IN ('admin','ceo-director')
  LIMIT 1;

  IF v_username IS NULL THEN
    RAISE EXCEPTION 'Only an active Admin or D-Admin can approve inventory payments';
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
  SET status = 'Approved',
      reviewed_by = v_username,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_request_id;

  PERFORM set_config('app.bmb_payment_approval_rpc','true',true);

  UPDATE public.bmb_chef_indents i
  SET payment_status = 'Approved',
      payment_approved_by = v_username,
      payment_approved_at = now(),
      updated_at = now()
  FROM public.bmb_inventory_purchase_request_lines l
  WHERE l.request_id = p_request_id
    AND i.id = l.indent_id;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  IF v_updated_count <> v_line_count THEN
    RAISE EXCEPTION 'Not all stock requests were updated for payment approval';
  END IF;

  RETURN QUERY SELECT p_request_id, 'Approved'::text, v_updated_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_approve_inventory_purchase_payment(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_approve_inventory_purchase_payment(text) TO authenticated;
