-- Bring My Bite inventory receipts, adjustments and production accounting.
-- This migration matches the database migration applied as inventory_receipts_recipes_v2.

alter table public.bmb_chef_indents
  add column if not exists received_quantity numeric,
  add column if not exists purchase_price numeric,
  add column if not exists received_at timestamptz,
  add column if not exists purchase_note text;

create table if not exists public.bmb_inventory_movements (
  id text primary key,
  inventory_id text not null references public.bmb_inventory(id) on delete cascade,
  movement_type text not null check (movement_type in ('RECEIPT','CONSUMPTION','ADJUSTMENT')),
  quantity numeric not null,
  source text not null default '',
  reference_id text,
  notes text not null default '',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.bmb_recipe_ingredients (
  id text primary key,
  package_type text not null,
  meal text not null default 'lunch',
  dish_name text not null,
  ingredient_name text not null,
  quantity_per_tray numeric not null check (quantity_per_tray > 0),
  unit text not null default 'grams',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists bmb_inventory_movements_inventory_idx on public.bmb_inventory_movements(inventory_id, created_at desc);
create index if not exists bmb_recipe_ingredients_lookup_idx on public.bmb_recipe_ingredients(package_type, meal, dish_name, active);

alter table public.bmb_inventory_movements enable row level security;
alter table public.bmb_recipe_ingredients enable row level security;

drop policy if exists "bmb inventory movement staff read" on public.bmb_inventory_movements;
drop policy if exists "bmb inventory movement staff insert" on public.bmb_inventory_movements;
drop policy if exists "bmb recipe staff read" on public.bmb_recipe_ingredients;
drop policy if exists "bmb recipe staff write" on public.bmb_recipe_ingredients;
create policy "bmb inventory movement staff read" on public.bmb_inventory_movements for select to authenticated using (public.bmb_has_staff_permission('inventory','read'));
create policy "bmb inventory movement staff insert" on public.bmb_inventory_movements for insert to authenticated with check (public.bmb_has_staff_permission('inventory','write'));
create policy "bmb recipe staff read" on public.bmb_recipe_ingredients for select to authenticated using (public.bmb_has_staff_permission('inventory','read'));
create policy "bmb recipe staff write" on public.bmb_recipe_ingredients for all to authenticated using (public.bmb_has_staff_permission('inventory','write')) with check (public.bmb_has_staff_permission('inventory','write'));
grant select, insert on public.bmb_inventory_movements to authenticated;
grant select, insert, update, delete on public.bmb_recipe_ingredients to authenticated;

drop function if exists public.bmb_record_inventory_movement(text,numeric,text,text,text,text);
create function public.bmb_record_inventory_movement(p_inventory_id text,p_quantity numeric,p_movement_type text,p_source text default '',p_reference_id text default null,p_notes text default '')
returns public.bmb_inventory
language plpgsql security definer set search_path = public
as $$
declare v_item public.bmb_inventory; v_next numeric; v_id text := 'MOV-' || extract(epoch from clock_timestamp())::bigint || '-' || substr(md5(random()::text),1,8); v_allowed boolean := false;
begin
  if p_quantity is null or p_quantity < 0 then raise exception 'Quantity must be zero or greater'; end if;
  if p_movement_type in ('RECEIPT','ADJUSTMENT') then v_allowed := public.bmb_has_staff_permission('inventory','write');
  elsif p_movement_type='CONSUMPTION' then v_allowed := public.bmb_has_staff_permission('inventory','write') or public.bmb_has_staff_permission('chef-indents','write'); end if;
  if not v_allowed then raise exception 'You do not have permission to change inventory'; end if;
  select * into v_item from public.bmb_inventory where id=p_inventory_id for update;
  if not found then raise exception 'Inventory item not found'; end if;
  if p_movement_type='RECEIPT' then v_next:=coalesce(v_item.current_stock,0)+p_quantity;
  elsif p_movement_type='CONSUMPTION' then v_next:=coalesce(v_item.current_stock,0)-p_quantity; if v_next<0 then raise exception 'Insufficient stock: % % available, % requested',v_item.current_stock,v_item.unit,p_quantity; end if;
  elsif p_movement_type='ADJUSTMENT' then v_next:=p_quantity;
  else raise exception 'Invalid inventory movement type'; end if;
  update public.bmb_inventory set current_stock=greatest(0,v_next),status=case when greatest(0,v_next)<=0 then 'Critical' when greatest(0,v_next)<=coalesce(min_threshold,0) then 'Low Stock' else 'In Stock' end,last_restocked=case when p_movement_type='RECEIPT' then current_date else last_restocked end,updated_at=now() where id=p_inventory_id returning * into v_item;
  insert into public.bmb_inventory_movements(id,inventory_id,movement_type,quantity,source,reference_id,notes,created_by) values(v_id,p_inventory_id,p_movement_type,p_quantity,coalesce(p_source,''),p_reference_id,coalesce(p_notes,''),auth.uid());
  return v_item;
end; $$;
revoke all on function public.bmb_record_inventory_movement(text,numeric,text,text,text,text) from public,anon;
grant execute on function public.bmb_record_inventory_movement(text,numeric,text,text,text,text) to authenticated;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='bmb_inventory_movements') then alter publication supabase_realtime add table public.bmb_inventory_movements; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='bmb_recipe_ingredients') then alter publication supabase_realtime add table public.bmb_recipe_ingredients; end if;
end $$;
alter table public.bmb_inventory_movements replica identity full;
alter table public.bmb_recipe_ingredients replica identity full;
