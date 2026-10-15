-- Remove permissive public CRUD policies that bypass staff authorization.
-- Keep customer-facing reads and order creation available; require authenticated
-- D-Admin access for CMS mutations and sensitive business records.
begin;

drop policy if exists "bmb_public_full_access" on public.bmb_banners;
drop policy if exists "bmb_public_full_access" on public.bmb_gst_billing;
drop policy if exists "bmb_public_full_access" on public.bmb_menus;
drop policy if exists "bmb_public_full_access" on public.bmb_panels;
drop policy if exists "bmb_public_full_access" on public.bmb_payment_settings;
drop policy if exists "bmb_public_full_access" on public.bmb_pricing;
drop policy if exists "bmb_public_full_access" on public.bmb_referrals;
drop policy if exists "bmb_public_full_access" on public.bmb_registration_fields;
drop policy if exists "bmb_public_full_access" on public.bmb_roles;
drop policy if exists "bmb_public_full_access" on public.bmb_settings;
drop policy if exists "bmb_public_full_access" on public.bmb_staff_salaries;
drop policy if exists "bmb_public_full_access" on public.bmb_subscriptions;
drop policy if exists "bmb_subscription_extensions_full_access" on public.bmb_subscription_extensions;

-- Remove policies that let anonymous clients read/update every customer's order.
drop policy if exists "bmb direct panel read orders" on public.bmb_orders;
drop policy if exists "bmb direct panel update orders" on public.bmb_orders;
drop policy if exists "bmb public create orders" on public.bmb_orders;
drop policy if exists "bmb_orders_public_insert" on public.bmb_orders;

-- Public site can read its published configuration. Writes are D-Admin-only.
drop policy if exists "bmb_public_read_banners" on public.bmb_banners;
create policy "bmb_public_read_banners" on public.bmb_banners
  for select to anon, authenticated using (true);
create policy "bmb_dadmin_manage_banners" on public.bmb_banners
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

drop policy if exists "bmb_public_read_menus" on public.bmb_menus;
create policy "bmb_public_read_menus" on public.bmb_menus
  for select to anon, authenticated using (true);
create policy "bmb_dadmin_manage_menus" on public.bmb_menus
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

drop policy if exists "bmb_public_read_pricing" on public.bmb_pricing;
create policy "bmb_public_read_pricing" on public.bmb_pricing
  for select to anon, authenticated using (true);
create policy "bmb_dadmin_manage_pricing" on public.bmb_pricing
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

drop policy if exists "bmb_public_read_settings" on public.bmb_settings;
create policy "bmb_public_read_settings" on public.bmb_settings
  for select to anon, authenticated using (true);
create policy "bmb_dadmin_manage_settings" on public.bmb_settings
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

drop policy if exists "bmb_public_read_fields" on public.bmb_registration_fields;
create policy "bmb_public_read_fields" on public.bmb_registration_fields
  for select to anon, authenticated using (true);
create policy "bmb_dadmin_manage_fields" on public.bmb_registration_fields
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

-- Payment display data is read-only for customers; edits are restricted.
create policy "bmb_public_read_payment_settings" on public.bmb_payment_settings
  for select to anon, authenticated using (true);
create policy "bmb_dadmin_manage_payment_settings" on public.bmb_payment_settings
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

-- Staff may read the role/panel catalogue needed to render their assigned UI.
-- Mutation remains D-Admin-only.
create policy "bmb_authenticated_read_panels" on public.bmb_panels
  for select to authenticated using (true);
create policy "bmb_authenticated_read_roles" on public.bmb_roles
  for select to authenticated using (true);
create policy "bmb_authenticated_read_permissions" on public.bmb_permissions
  for select to authenticated using (true);
create policy "bmb_staff_read_own_admin_user" on public.bmb_admin_users
  for select to authenticated using (user_id = auth.uid()::text);

create policy "bmb_dadmin_manage_panels" on public.bmb_panels
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());
create policy "bmb_dadmin_manage_roles" on public.bmb_roles
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

-- These tables contain customer, referral, payroll, GST, or extension records.
create policy "bmb_dadmin_manage_gst_billing" on public.bmb_gst_billing
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());
create policy "bmb_dadmin_manage_referrals" on public.bmb_referrals
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());
create policy "bmb_dadmin_manage_staff_salaries" on public.bmb_staff_salaries
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());
create policy "bmb_dadmin_manage_subscriptions" on public.bmb_subscriptions
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());
create policy "bmb_dadmin_manage_subscription_extensions" on public.bmb_subscription_extensions
  for all to authenticated using (public.bmb_is_dadmin()) with check (public.bmb_is_dadmin());

-- Subscription roles receive only their explicitly assigned panel actions.
create policy "bmb_staff_read_subscriptions" on public.bmb_subscriptions
  for select to authenticated using (public.bmb_has_staff_permission('customers', 'read'));
create policy "bmb_staff_add_subscriptions" on public.bmb_subscriptions
  for insert to authenticated with check (public.bmb_has_staff_permission('customers', 'add'));
create policy "bmb_staff_write_subscriptions" on public.bmb_subscriptions
  for update to authenticated using (public.bmb_has_staff_permission('customers', 'write'))
  with check (public.bmb_has_staff_permission('customers', 'write'));
create policy "bmb_staff_delete_subscriptions" on public.bmb_subscriptions
  for delete to authenticated using (public.bmb_has_staff_permission('customers', 'delete'));

create policy "bmb_staff_read_subscription_extensions" on public.bmb_subscription_extensions
  for select to authenticated using (public.bmb_has_staff_permission('customers', 'read'));
create policy "bmb_staff_add_subscription_extensions" on public.bmb_subscription_extensions
  for insert to authenticated with check (public.bmb_has_staff_permission('customers', 'add'));
create policy "bmb_staff_write_subscription_extensions" on public.bmb_subscription_extensions
  for update to authenticated using (public.bmb_has_staff_permission('customers', 'write'))
  with check (public.bmb_has_staff_permission('customers', 'write'));
create policy "bmb_staff_delete_subscription_extensions" on public.bmb_subscription_extensions
  for delete to authenticated using (public.bmb_has_staff_permission('customers', 'delete'));

-- Only active staff with explicit order permissions can view or update orders.
-- Public order creation cannot set its own approval or payment verification status.
create policy "bmb public create pending orders"
on public.bmb_orders for insert to anon, authenticated
with check (
  length(trim(coalesce(id, ''))) > 0
  and kind in ('instant', 'subscription')
  and length(trim(coalesce(customer_name, ''))) > 0
  and length(trim(coalesce(phone, ''))) between 10 and 20
  and amount >= 0
  and length(trim(coalesce(utr_number, ''))) > 0
  and payment_status = 'Pending Verification'
  and status = 'Pending Verification'
);

commit;
