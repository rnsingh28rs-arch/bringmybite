-- Central order routing: customer -> Admin verification -> Manager dispatch -> Chef preparation.
-- This migration is additive and does not change customer order creation.

alter table if exists public.bmb_orders add column if not exists assigned_role text;
alter table if exists public.bmb_orders add column if not exists assigned_to text;
alter table if exists public.bmb_orders add column if not exists preparation_requested_at timestamptz;

update public.bmb_orders
set assigned_role = case
  when status in ('Preparing') then 'chef'
  when status in ('Confirmed','Dispatched','Delivered') then 'manager'
  else 'admin'
end,
assigned_to = case
  when status in ('Preparing') then 'chef'
  when status in ('Confirmed','Dispatched','Delivered') then 'manager'
  else 'admin'
end
where coalesce(assigned_role,'') = '';

-- Customers can create orders; authenticated staff read/update according to their role permissions.
drop policy if exists "bmb staff read orders" on public.bmb_orders;
drop policy if exists "bmb staff update orders" on public.bmb_orders;
drop policy if exists "bmb admin read orders" on public.bmb_orders;
drop policy if exists "bmb admin update orders" on public.bmb_orders;

create policy "bmb staff read orders"
on public.bmb_orders for select to authenticated
using (public.bmb_has_staff_permission('orders','read'));

create policy "bmb staff update orders"
on public.bmb_orders for update to authenticated
using (public.bmb_has_staff_permission('orders','write'))
with check (public.bmb_has_staff_permission('orders','write'));

create index if not exists bmb_orders_assigned_role_idx on public.bmb_orders(assigned_role, status, created_at desc);
