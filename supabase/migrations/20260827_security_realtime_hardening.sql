create unique index if not exists bmb_admin_users_username_key on public.bmb_admin_users(username);

create or replace function public.bmb_is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.bmb_admin_users a where a.user_id = auth.uid() and a.active = true and a.role_id in ('admin','ceo-director'));
$$;

create or replace function public.bmb_has_staff_permission(p_panel_id text, p_action text)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.bmb_admin_users a
    join public.bmb_permissions p on p.role_id = a.role_id
    where a.user_id = auth.uid() and a.active = true and p.panel_id = p_panel_id
      and case p_action when 'read' then p.can_read when 'write' then p.can_write when 'add' then p.can_add when 'delete' then p.can_delete else false end
  );
$$;

drop function if exists public.bmb_get_staff_account();
create function public.bmb_get_staff_account()
returns table(user_id uuid, username text, email text, role_id text, active boolean)
language sql stable security definer set search_path = public
as $$
  select a.user_id, a.username, a.email, a.role_id, a.active from public.bmb_admin_users a
  where a.user_id = auth.uid() and a.active = true limit 1;
$$;

revoke all on function public.bmb_is_admin() from public, anon;
grant execute on function public.bmb_is_admin() to authenticated;
revoke all on function public.bmb_has_staff_permission(text,text) from public, anon;
grant execute on function public.bmb_has_staff_permission(text,text) to authenticated;
revoke all on function public.bmb_get_staff_account() from public, anon;
grant execute on function public.bmb_get_staff_account() to authenticated;
revoke all on function public.bmb_verify_staff_pin(text,text) from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

insert into public.bmb_panels (id,name,sort_order,active)
values ('customers','Customers',11,true),('inventory','Inventory',12,true),('staff','Staff & Permissions',13,true),('chef-indents','Chef Indents',14,true)
on conflict (id) do update set name=excluded.name, active=true;

insert into public.bmb_permissions (role_id,panel_id,can_read,can_write,can_add,can_delete)
values
('admin','customers',true,true,true,true),('ceo-director','customers',true,true,true,true),('manager','customers',true,true,true,false),
('admin','inventory',true,true,true,true),('ceo-director','inventory',true,true,true,true),('manager','inventory',true,true,true,false),('chef','inventory',true,true,false,false),('chef-helper','inventory',true,false,false,false),
('admin','staff',true,true,true,true),('ceo-director','staff',true,true,true,true),
('admin','chef-indents',true,true,true,true),('ceo-director','chef-indents',true,true,true,true),('manager','chef-indents',true,true,true,false),('chef','chef-indents',true,true,true,false),('chef-helper','chef-indents',true,false,false,false),
('admin','orders',true,true,true,true),('ceo-director','orders',true,true,true,true),('manager','orders',true,true,true,false),('chef','orders',true,true,false,false),('chef-helper','orders',true,true,false,false),
('admin','menus',true,true,true,true),('ceo-director','menus',true,true,true,true),('chef','menus',true,false,false,false),('chef-helper','menus',true,false,false,false)
on conflict (role_id,panel_id) do update set can_read=excluded.can_read,can_write=excluded.can_write,can_add=excluded.can_add,can_delete=excluded.can_delete;

drop policy if exists "bmb subscriptions staff read" on public.bmb_subscriptions;
drop policy if exists "bmb subscriptions staff update" on public.bmb_subscriptions;
drop policy if exists "bmb subscriptions staff delete" on public.bmb_subscriptions;
create policy "bmb subscriptions staff read" on public.bmb_subscriptions for select to authenticated using (public.bmb_has_staff_permission('customers','read'));
create policy "bmb subscriptions staff update" on public.bmb_subscriptions for update to authenticated using (public.bmb_has_staff_permission('customers','write')) with check (public.bmb_has_staff_permission('customers','write'));
create policy "bmb subscriptions staff delete" on public.bmb_subscriptions for delete to authenticated using (public.bmb_has_staff_permission('customers','delete'));

drop policy if exists "bmb inventory staff read" on public.bmb_inventory;
drop policy if exists "bmb inventory staff insert" on public.bmb_inventory;
drop policy if exists "bmb inventory staff update" on public.bmb_inventory;
drop policy if exists "bmb inventory staff delete" on public.bmb_inventory;
create policy "bmb inventory staff read" on public.bmb_inventory for select to authenticated using (public.bmb_has_staff_permission('inventory','read'));
create policy "bmb inventory staff insert" on public.bmb_inventory for insert to authenticated with check (public.bmb_has_staff_permission('inventory','add'));
create policy "bmb inventory staff update" on public.bmb_inventory for update to authenticated using (public.bmb_has_staff_permission('inventory','write')) with check (public.bmb_has_staff_permission('inventory','write'));
create policy "bmb inventory staff delete" on public.bmb_inventory for delete to authenticated using (public.bmb_has_staff_permission('inventory','delete'));

drop policy if exists "bmb indents staff read" on public.bmb_chef_indents;
drop policy if exists "bmb indents staff insert" on public.bmb_chef_indents;
drop policy if exists "bmb indents staff update" on public.bmb_chef_indents;
drop policy if exists "bmb indents staff delete" on public.bmb_chef_indents;
create policy "bmb indents staff read" on public.bmb_chef_indents for select to authenticated using (public.bmb_has_staff_permission('chef-indents','read'));
create policy "bmb indents staff insert" on public.bmb_chef_indents for insert to authenticated with check (public.bmb_has_staff_permission('chef-indents','add'));
create policy "bmb indents staff update" on public.bmb_chef_indents for update to authenticated using (public.bmb_has_staff_permission('chef-indents','write')) with check (public.bmb_has_staff_permission('chef-indents','write'));
create policy "bmb indents staff delete" on public.bmb_chef_indents for delete to authenticated using (public.bmb_has_staff_permission('chef-indents','delete'));

drop policy if exists "bmb referrals staff read" on public.bmb_referrals;
drop policy if exists "bmb referrals staff update" on public.bmb_referrals;
create policy "bmb referrals staff read" on public.bmb_referrals for select to authenticated using (public.bmb_has_staff_permission('customers','read'));
create policy "bmb referrals staff update" on public.bmb_referrals for update to authenticated using (public.bmb_has_staff_permission('customers','write')) with check (public.bmb_has_staff_permission('customers','write'));

drop policy if exists "bmb admin read orders" on public.bmb_orders;
drop policy if exists "bmb admin update orders" on public.bmb_orders;
drop policy if exists "bmb admin delete orders" on public.bmb_orders;
create policy "bmb staff read orders" on public.bmb_orders for select to authenticated using (public.bmb_has_staff_permission('orders','read'));
create policy "bmb staff update orders" on public.bmb_orders for update to authenticated using (public.bmb_has_staff_permission('orders','write')) with check (public.bmb_has_staff_permission('orders','write'));
create policy "bmb staff delete orders" on public.bmb_orders for delete to authenticated using (public.bmb_has_staff_permission('orders','delete'));

do $$
declare t text; tables text[] := array['bmb_settings','bmb_pricing','bmb_banners','bmb_menus','bmb_registration_fields','bmb_payment_settings','bmb_panels','bmb_roles','bmb_permissions','bmb_admin_users','bmb_orders','bmb_subscriptions','bmb_inventory','bmb_chef_indents','bmb_referrals','bmb_staff_salaries','bmb_gst_billing'];
begin foreach t in array tables loop
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then execute format('alter publication supabase_realtime add table public.%I',t); end if;
  execute format('alter table public.%I replica identity full',t);
end loop; end $$;
