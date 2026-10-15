-- Keep payment verification and final approval/rejection limited to payment-authorized staff.
-- Order-write permission alone is not sufficient to verify or reject customer payments.
CREATE OR REPLACE FUNCTION public.bmb_update_panel_order(
  p_order_id text,
  p_status text DEFAULT NULL::text,
  p_payment_status text DEFAULT NULL::text,
  p_assigned_role text DEFAULT NULL::text,
  p_assigned_to text DEFAULT NULL::text,
  p_details text DEFAULT NULL::text
)
RETURNS public.bmb_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r public.bmb_orders;
  v_can_manage_payment boolean :=
    public.bmb_has_staff_permission('payment', 'write')
    OR public.bmb_is_admin();
BEGIN
  IF NOT (
    public.bmb_has_staff_permission('orders', 'write')
    OR public.bmb_is_admin()
  ) THEN
    RAISE EXCEPTION 'An active staff account with order-write permission is required';
  END IF;

  IF p_payment_status IS NOT NULL AND NOT v_can_manage_payment THEN
    RAISE EXCEPTION 'Payment status updates require payment-write permission';
  END IF;

  IF p_status IN ('Confirmed', 'Rejected') AND NOT v_can_manage_payment THEN
    RAISE EXCEPTION 'Order approval/rejection requires payment-write permission';
  END IF;

  UPDATE public.bmb_orders
  SET status = coalesce(p_status, status),
      payment_status = coalesce(p_payment_status, payment_status),
      assigned_role = coalesce(p_assigned_role, assigned_role),
      assigned_to = coalesce(p_assigned_to, assigned_to),
      details = coalesce(p_details, details),
      preparation_requested_at = CASE
        WHEN p_status = 'Preparing' THEN coalesce(preparation_requested_at, now())
        ELSE preparation_requested_at
      END,
      updated_at = now()
  WHERE id = p_order_id
  RETURNING * INTO r;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found', p_order_id;
  END IF;

  RETURN r;
END;
$function$;
