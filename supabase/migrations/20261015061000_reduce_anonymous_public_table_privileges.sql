-- Public website data is read-only for anonymous visitors. All CMS writes remain staff/D-Admin-only.
REVOKE ALL ON TABLE public.bmb_banners, public.bmb_menus, public.bmb_pricing,
  public.bmb_registration_fields, public.bmb_settings
FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.bmb_banners, public.bmb_menus, public.bmb_pricing,
  public.bmb_registration_fields, public.bmb_settings TO anon;

-- The checkout view is read-only; do not expose other table privileges through defaults.
REVOKE ALL ON TABLE public.bmb_public_payment_settings FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.bmb_public_payment_settings TO anon, authenticated;

-- Payment base table remains limited to the specific checkout columns for anon.
REVOKE ALL ON TABLE public.bmb_payment_settings FROM PUBLIC, anon;
GRANT SELECT (id, bank_name, account_holder, upi_id, phone, qr_url)
ON TABLE public.bmb_payment_settings TO anon;
