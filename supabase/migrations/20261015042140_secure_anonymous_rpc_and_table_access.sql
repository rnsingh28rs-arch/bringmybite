-- Defense-in-depth: remove anonymous table grants and close privileged RPC execution paths.
-- Keep only the public capabilities the customer app requires.
REVOKE ALL ON TABLE
  public.bmb_orders,
  public.bmb_staff_salaries,
  public.bmb_subscriptions,
  public.bmb_gst_billing,
  public.bmb_referrals,
  public.bmb_payment_settings,
  public.bmb_subscription_extensions,
  public.bmb_inventory,
  public.bmb_inventory_movements,
  public.bmb_inventory_purchase_requests,
  public.bmb_inventory_purchase_request_lines,
  public.bmb_chef_indents,
  public.bmb_admin_users,
  public.bmb_permissions,
  public.bmb_roles,
  public.bmb_panels,
  public.bmb_panel_riders,
  public.bmb_recipe_ingredients
FROM PUBLIC, anon;

-- Anonymous customers may submit a new pending order, but cannot read or update orders.
GRANT INSERT ON TABLE public.bmb_orders TO anon;

-- Public checkout gets only the approved payment columns, through an invoker-security view.
CREATE OR REPLACE VIEW public.bmb_public_payment_settings
WITH (security_invoker = true) AS
SELECT id, bank_name, account_holder, upi_id, phone, qr_url
FROM public.bmb_payment_settings;

GRANT SELECT ON TABLE public.bmb_public_payment_settings TO anon, authenticated;
GRANT SELECT (id, bank_name, account_holder, upi_id, phone, qr_url)
ON TABLE public.bmb_payment_settings TO anon;

-- A privileged RPC must never expose all orders to anonymous or ordinary authenticated users.
CREATE OR REPLACE FUNCTION public.bmb_get_panel_orders()
RETURNS SETOF public.bmb_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (public.bmb_has_staff_permission('orders','read') OR public.bmb_is_admin()) THEN
    RAISE EXCEPTION 'An active staff account with order-read permission is required';
  END IF;
  RETURN QUERY SELECT o.* FROM public.bmb_orders o ORDER BY o.created_at DESC LIMIT 500;
END;
$function$;
REVOKE ALL ON FUNCTION public.bmb_get_panel_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_get_panel_orders() TO authenticated;

-- Protect order mutation RPC with the same staff authorization used by table RLS.
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
DECLARE r public.bmb_orders;
BEGIN
  IF NOT (public.bmb_has_staff_permission('orders','write') OR public.bmb_is_admin()) THEN
    RAISE EXCEPTION 'An active staff account with order-write permission is required';
  END IF;
  UPDATE public.bmb_orders
  SET status = coalesce(p_status, status),
      payment_status = coalesce(p_payment_status, payment_status),
      assigned_role = coalesce(p_assigned_role, assigned_role),
      assigned_to = coalesce(p_assigned_to, assigned_to),
      details = coalesce(p_details, details),
      preparation_requested_at = CASE WHEN p_status = 'Preparing' THEN coalesce(preparation_requested_at, now()) ELSE preparation_requested_at END,
      updated_at = now()
  WHERE id = p_order_id
  RETURNING * INTO r;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order % not found', p_order_id; END IF;
  RETURN r;
END;
$function$;
REVOKE ALL ON FUNCTION public.bmb_update_panel_order(text,text,text,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_update_panel_order(text,text,text,text,text,text) TO authenticated;

-- These account/role helpers are staff-only. Customer order status remains available via
-- bmb_get_order_status(order_id, phone), which checks both identifiers.
REVOKE ALL ON FUNCTION public.bmb_get_staff_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_get_staff_account() TO authenticated;
REVOKE ALL ON FUNCTION public.bmb_is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_is_admin() TO authenticated;

-- Trigger functions are invoked by PostgreSQL triggers, not through the public RPC API.
REVOKE ALL ON FUNCTION public.bmb_guard_chef_indent_updates() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_banner_price_to_pricing() FROM PUBLIC, anon, authenticated;
