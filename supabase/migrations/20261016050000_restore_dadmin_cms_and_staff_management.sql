-- Restore the D-Admin's intended management permissions for CMS configuration,
-- staff identity/roles, and the D-Admin control panels. Customer/order access remains
-- governed by the existing per-role permission policies.
BEGIN;

DROP POLICY IF EXISTS bmb_dadmin_manage_banners ON public.bmb_banners;
CREATE POLICY bmb_dadmin_manage_banners ON public.bmb_banners
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_menus ON public.bmb_menus;
CREATE POLICY bmb_dadmin_manage_menus ON public.bmb_menus
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_pricing ON public.bmb_pricing;
CREATE POLICY bmb_dadmin_manage_pricing ON public.bmb_pricing
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_settings ON public.bmb_settings;
CREATE POLICY bmb_dadmin_manage_settings ON public.bmb_settings
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_registration_fields ON public.bmb_registration_fields;
CREATE POLICY bmb_dadmin_manage_registration_fields ON public.bmb_registration_fields
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_payment_settings ON public.bmb_payment_settings;
CREATE POLICY bmb_dadmin_manage_payment_settings ON public.bmb_payment_settings
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_panels ON public.bmb_panels;
CREATE POLICY bmb_dadmin_manage_panels ON public.bmb_panels
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_roles ON public.bmb_roles;
CREATE POLICY bmb_dadmin_manage_roles ON public.bmb_roles
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_permissions ON public.bmb_permissions;
CREATE POLICY bmb_dadmin_manage_permissions ON public.bmb_permissions
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_admin_users ON public.bmb_admin_users;
CREATE POLICY bmb_dadmin_manage_admin_users ON public.bmb_admin_users
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_staff_salaries ON public.bmb_staff_salaries;
CREATE POLICY bmb_dadmin_manage_staff_salaries ON public.bmb_staff_salaries
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_gst_billing ON public.bmb_gst_billing;
CREATE POLICY bmb_dadmin_manage_gst_billing ON public.bmb_gst_billing
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

DROP POLICY IF EXISTS bmb_dadmin_manage_referrals ON public.bmb_referrals;
CREATE POLICY bmb_dadmin_manage_referrals ON public.bmb_referrals
  FOR ALL TO authenticated USING (public.bmb_is_dadmin()) WITH CHECK (public.bmb_is_dadmin());

COMMIT;
