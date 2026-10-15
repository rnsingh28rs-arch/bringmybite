-- Remove role-only order policies that bypass explicit panel permissions.
drop policy if exists "bmb_orders_staff_read" on public.bmb_orders;
drop policy if exists "bmb_orders_staff_update" on public.bmb_orders;
