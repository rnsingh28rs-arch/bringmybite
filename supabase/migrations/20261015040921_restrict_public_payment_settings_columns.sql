-- Expose only payment details intended for customer checkout.
-- Full bank/account fields remain available to the D-Admin through the base table.
create or replace view public.bmb_public_payment_settings as
select id, bank_name, account_holder, upi_id, phone, qr_url
from public.bmb_payment_settings;

grant select on public.bmb_public_payment_settings to anon, authenticated;
revoke select on public.bmb_payment_settings from anon;
drop policy if exists "bmb_public_read_payment_settings" on public.bmb_payment_settings;
create policy "bmb_public_read_payment_settings" on public.bmb_payment_settings
  for select to anon using (true);
