-- Bring My Bite central CMS / D-Admin Designer schema
-- Run this once in Supabase SQL Editor. It is safe to re-run after dropping only these BMB tables.

create table if not exists public.bmb_settings (
  key text primary key,
  value text not null default ''
);

create table if not exists public.bmb_pricing (
  key text primary key,
  value numeric not null default 0
);

create table if not exists public.bmb_banners (
  id text primary key,
  sort_order integer not null default 1,
  active boolean not null default true,
  tag text not null default '',
  title text not null default '',
  highlight_price text not null default '',
  period text not null default '',
  thali_rate text not null default '',
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  package_key text not null default 'VEG CLASSIC',
  thali_key text not null default 'veg',
  image_url text not null default '',
  image_alt text not null default '',
  dish_highlights jsonb not null default '[]'::jsonb,
  tag_color text not null default '',
  badge_bg text not null default '',
  accent_color text not null default '',
  button_accent text not null default '',
  card_border text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.bmb_payment_settings (
  id text primary key,
  bank_name text not null default '',
  account_holder text not null default '',
  account_number text not null default '',
  ifsc_code text not null default '',
  account_type text not null default '',
  authorized_signatory text not null default '',
  upi_id text not null default '',
  phone text not null default '',
  qr_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.bmb_registration_fields (
  id text primary key,
  label text not null,
  field_key text not null unique,
  field_type text not null default 'text',
  required boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 1,
  placeholder text not null default '',
  options jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.bmb_menus (
  package_type text primary key,
  menu jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.bmb_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role_id text not null default 'ceo-director',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bmb_panels (
  id text primary key,
  name text not null,
  sort_order integer not null default 1,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.bmb_roles (
  id text primary key,
  name text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.bmb_permissions (
  role_id text not null references public.bmb_roles(id) on delete cascade,
  panel_id text not null references public.bmb_panels(id) on delete cascade,
  can_read boolean not null default false,
  can_write boolean not null default false,
  can_add boolean not null default false,
  can_delete boolean not null default false,
  primary key (role_id, panel_id)
);

create index if not exists bmb_banners_order_idx on public.bmb_banners(sort_order);
create index if not exists bmb_registration_fields_order_idx on public.bmb_registration_fields(sort_order);

-- Storage bucket for logos, banners, food images and QR files.
insert into storage.buckets (id, name, public) values ('bmb-media', 'bmb-media', true) on conflict (id) do nothing;

-- Development/launch policy: browser clients can read CMS data and D-Admin writes are protected later by Supabase Auth/RLS.
-- Keep the policies below intentionally simple for initial setup; tighten them before public production launch.
alter table public.bmb_admin_users enable row level security;
alter table public.bmb_settings enable row level security;
alter table public.bmb_pricing enable row level security;
alter table public.bmb_banners enable row level security;
alter table public.bmb_payment_settings enable row level security;
alter table public.bmb_registration_fields enable row level security;
alter table public.bmb_menus enable row level security;
alter table public.bmb_panels enable row level security;
alter table public.bmb_roles enable row level security;
alter table public.bmb_permissions enable row level security;

-- Idempotent policy recreation
drop policy if exists "bmb admin self read" on public.bmb_admin_users;
drop policy if exists "bmb admin manage users" on public.bmb_admin_users;
drop policy if exists "bmb admin manage settings" on public.bmb_settings;
drop policy if exists "bmb admin manage pricing" on public.bmb_pricing;
drop policy if exists "bmb admin manage banners" on public.bmb_banners;
drop policy if exists "bmb admin manage payment" on public.bmb_payment_settings;
drop policy if exists "bmb admin manage fields" on public.bmb_registration_fields;
drop policy if exists "bmb admin manage menus" on public.bmb_menus;
drop policy if exists "bmb admin manage panels" on public.bmb_panels;
drop policy if exists "bmb admin manage roles" on public.bmb_roles;
drop policy if exists "bmb admin manage permissions" on public.bmb_permissions;

create or replace function public.bmb_is_admin() returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.bmb_admin_users a
    where a.user_id = auth.uid() and a.active = true
  );
$$;

grant execute on function public.bmb_is_admin() to anon, authenticated;

create policy "bmb admin self read" on public.bmb_admin_users
  for select to authenticated using (user_id = auth.uid());
create policy "bmb admin manage users" on public.bmb_admin_users
  for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());

create policy "bmb public read settings" on public.bmb_settings for select using (true);
create policy "bmb public read pricing" on public.bmb_pricing for select using (true);
create policy "bmb public read banners" on public.bmb_banners for select using (true);
create policy "bmb public read payment" on public.bmb_payment_settings for select using (true);
create policy "bmb public read fields" on public.bmb_registration_fields for select using (true);
create policy "bmb public read menus" on public.bmb_menus for select using (true);
create policy "bmb public read panels" on public.bmb_panels for select using (true);
create policy "bmb public read roles" on public.bmb_roles for select using (true);
create policy "bmb public read permissions" on public.bmb_permissions for select using (true);

create policy "bmb admin manage settings" on public.bmb_settings for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage pricing" on public.bmb_pricing for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage banners" on public.bmb_banners for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage payment" on public.bmb_payment_settings for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage fields" on public.bmb_registration_fields for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage menus" on public.bmb_menus for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage panels" on public.bmb_panels for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage roles" on public.bmb_roles for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
create policy "bmb admin manage permissions" on public.bmb_permissions for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());

-- Also allow D-Admin to read the current admin identity.
-- First setup step after creating your Supabase Auth user:
-- insert into public.bmb_admin_users (user_id, email, role_id) values ('YOUR_AUTH_USER_UUID', 'YOUR_EMAIL', 'ceo-director');

-- ============================================================
-- Bring My Bite Order Request workflow (added by repair build)
-- Run this block once in Supabase SQL Editor.
-- Payment screenshots are compressed client-side and stored as text
-- so no Storage bucket is required for the order workflow.
-- ============================================================
create table if not exists public.bmb_orders (
  id text primary key,
  kind text not null check (kind in ('instant','subscription')),
  customer_name text not null,
  phone text not null,
  whatsapp text,
  plan_or_meal text not null,
  amount numeric not null default 0,
  utr_number text not null,
  payment_slip text,
  payment_status text not null default 'Pending Verification',
  status text not null default 'Pending Verification',
  details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bmb_orders enable row level security;

drop policy if exists "bmb public create orders" on public.bmb_orders;
drop policy if exists "bmb admin read orders" on public.bmb_orders;
drop policy if exists "bmb admin update orders" on public.bmb_orders;

create policy "bmb public create orders"
on public.bmb_orders for insert to anon, authenticated
with check (true);

create policy "bmb admin read orders"
on public.bmb_orders for select to authenticated
using (public.bmb_is_admin());

create policy "bmb admin update orders"
on public.bmb_orders for update to authenticated
using (public.bmb_is_admin())
with check (public.bmb_is_admin());

grant insert on public.bmb_orders to anon, authenticated;
grant select, update on public.bmb_orders to authenticated;


update public.bmb_payment_settings
set upi_id = '900484984@YBL', phone = '+91 9315075165'
where id = 'default';

create or replace function public.bmb_get_order_status(p_order_id text, p_phone text)
returns table (id text, payment_status text, status text, details text, updated_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select o.id, o.payment_status, o.status, o.details, o.updated_at
  from public.bmb_orders o
  where o.id = p_order_id
    and right(regexp_replace(coalesce(o.phone, ''), '[^0-9]', '', 'g'), 10) = right(regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g'), 10)
  limit 1;
$$;

revoke all on function public.bmb_get_order_status(text, text) from public;
grant execute on function public.bmb_get_order_status(text, text) to anon, authenticated;

-- ============================================================
-- Staff payroll + corporate/GST support
-- ============================================================
create table if not exists public.bmb_staff_salaries (
  id text primary key,
  name text not null,
  role text not null default 'other',
  phone text not null default '',
  monthly_salary numeric not null default 0,
  payment_day integer not null default 1,
  status text not null default 'Active',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.bmb_staff_salaries enable row level security;
drop policy if exists "bmb admin read salaries" on public.bmb_staff_salaries;
drop policy if exists "bmb admin manage salaries" on public.bmb_staff_salaries;
create policy "bmb admin read salaries" on public.bmb_staff_salaries for select to authenticated using (public.bmb_is_admin());
create policy "bmb admin manage salaries" on public.bmb_staff_salaries for all to authenticated using (public.bmb_is_admin()) with check (public.bmb_is_admin());
grant select, insert, update, delete on public.bmb_staff_salaries to authenticated;

insert into public.bmb_roles (id,name,active) values ('chef-helper','Chef Helper',true) on conflict (id) do nothing;
insert into public.bmb_panels (id,name,sort_order,active) values ('salaries','Staff Salaries',20,true) on conflict (id) do nothing;
insert into public.bmb_panels (id,name,sort_order,active) values ('gst-billing','GST / Corporate Billing',21,true) on conflict (id) do nothing;

-- D-Admin and Admin both get salary + GST billing access.
insert into public.bmb_permissions (role_id,panel_id,can_read,can_write,can_add,can_delete)
select r.id,p.id,true,true,true,true
from public.bmb_roles r cross join public.bmb_panels p
where r.id in ('ceo-director','admin') and p.id in ('salaries','gst-billing')
on conflict (role_id,panel_id) do update set can_read=excluded.can_read,can_write=excluded.can_write,can_add=excluded.can_add,can_delete=excluded.can_delete;
