-- Prevent inventory/recipe/purchase flows from silently mixing stock units.
-- The live database was updated with the same contract before this migration was committed.

create or replace function public.bmb_normalize_inventory_unit(p_unit text)
returns text
language sql
immutable
security invoker
set search_path = ''
as $$
  select case lower(trim(coalesce(p_unit,'')))
    when 'kilogram' then 'kg'
    when 'kilograms' then 'kg'
    when 'kg' then 'kg'
    when 'gram' then 'grams'
    when 'grams' then 'grams'
    when 'g' then 'grams'
    when 'liter' then 'liters'
    when 'litre' then 'liters'
    when 'litres' then 'liters'
    when 'liters' then 'liters'
    when 'l' then 'liters'
    when 'piece' then 'pieces'
    when 'pieces' then 'pieces'
    when 'pc' then 'pieces'
    when 'pcs' then 'pieces'
    when 'packet' then 'packets'
    when 'packets' then 'packets'
    when 'box' then 'boxes'
    when 'boxes' then 'boxes'
    else lower(trim(coalesce(p_unit,'')))
  end
$$;

create or replace function public.bmb_validate_inventory_unit_contract()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  existing_unit text;
begin
  if tg_table_name = 'bmb_inventory' and tg_op = 'UPDATE' then
    if public.bmb_normalize_inventory_unit(old.unit) <> public.bmb_normalize_inventory_unit(new.unit) then
      raise exception 'Inventory unit mismatch: % is configured as %, cannot change it to %. Use a recipe/purchase unit conversion instead of changing the stock unit.', new.name, old.unit, new.unit
        using errcode = '22023';
    end if;
  elsif tg_table_name = 'bmb_chef_indents' then
    select i.unit into existing_unit
    from public.bmb_inventory i
    where lower(trim(i.name)) = lower(trim(new.item_name))
    limit 1;

    if existing_unit is not null
       and public.bmb_normalize_inventory_unit(existing_unit) <> public.bmb_normalize_inventory_unit(new.unit) then
      raise exception 'Inventory unit mismatch for %: stock is stored in %, but Chef requested %. Use the configured stock unit.', new.item_name, existing_unit, new.unit
        using errcode = '22023';
    end if;
  elsif tg_table_name = 'bmb_inventory_purchase_request_lines' then
    select i.unit into existing_unit
    from public.bmb_inventory i
    where lower(trim(i.name)) = lower(trim(new.item_name))
    limit 1;

    if existing_unit is not null
       and public.bmb_normalize_inventory_unit(existing_unit) <> public.bmb_normalize_inventory_unit(new.unit) then
      raise exception 'Inventory purchase unit mismatch for %: stock is stored in %, but purchase line uses %. Use the configured stock unit.', new.item_name, existing_unit, new.unit
        using errcode = '22023';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists bmb_inventory_unit_contract on public.bmb_inventory;
create trigger bmb_inventory_unit_contract
before update on public.bmb_inventory
for each row execute function public.bmb_validate_inventory_unit_contract();

drop trigger if exists bmb_chef_indent_unit_contract on public.bmb_chef_indents;
create trigger bmb_chef_indent_unit_contract
before insert or update on public.bmb_chef_indents
for each row execute function public.bmb_validate_inventory_unit_contract();

drop trigger if exists bmb_purchase_line_unit_contract on public.bmb_inventory_purchase_request_lines;
create trigger bmb_purchase_line_unit_contract
before insert or update on public.bmb_inventory_purchase_request_lines
for each row execute function public.bmb_validate_inventory_unit_contract();
