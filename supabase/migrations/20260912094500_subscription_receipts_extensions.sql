alter table public.bmb_subscriptions
  add column if not exists receipt_number text,
  add column if not exists approved_at timestamptz,
  add column if not exists original_expiry_date date,
  add column if not exists total_extension_days integer not null default 0,
  add column if not exists receipt_sent_at timestamptz,
  add column if not exists receipt_sent_channel text,
  add column if not exists subscriber_email text;

update public.bmb_subscriptions set original_expiry_date = coalesce(original_expiry_date, expiry_date) where original_expiry_date is null;
create unique index if not exists bmb_subscriptions_receipt_number_uidx on public.bmb_subscriptions(receipt_number) where receipt_number is not null;

create table if not exists public.bmb_subscription_extensions (
  id text primary key,
  subscription_id text not null references public.bmb_subscriptions(id) on delete cascade,
  days_added integer not null check (days_added > 0),
  reason text not null,
  notes text,
  old_expiry_date date not null,
  new_expiry_date date not null,
  extended_by text,
  created_at timestamptz not null default now()
);

alter table public.bmb_subscription_extensions enable row level security;
drop policy if exists bmb_subscription_extensions_full_access on public.bmb_subscription_extensions;
create policy bmb_subscription_extensions_full_access on public.bmb_subscription_extensions for all to anon, authenticated using (true) with check (true);
grant select, insert, update, delete on public.bmb_subscription_extensions to anon, authenticated;

create or replace function public.bmb_generate_subscription_receipt_number() returns text language plpgsql as $$
declare candidate text;
begin
  loop
    candidate := 'BMB-SUB-' || to_char(current_timestamp at time zone 'Asia/Kolkata','YYYYMMDD') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text),1,6));
    exit when not exists (select 1 from public.bmb_subscriptions where receipt_number=candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.bmb_subscription_receipt_fields() returns trigger language plpgsql as $$
begin
  if new.verification_status='Approved' and coalesce(old.verification_status,'')<>'Approved' then
    new.approved_at := coalesce(new.approved_at,now());
    new.original_expiry_date := coalesce(new.original_expiry_date,new.expiry_date);
    new.receipt_number := coalesce(new.receipt_number,public.bmb_generate_subscription_receipt_number());
  elsif new.original_expiry_date is null then
    new.original_expiry_date := new.expiry_date;
  end if;
  return new;
end;
$$;

drop trigger if exists bmb_subscription_receipt_fields on public.bmb_subscriptions;
create trigger bmb_subscription_receipt_fields before insert or update on public.bmb_subscriptions for each row execute function public.bmb_subscription_receipt_fields();

create or replace function public.bmb_extend_subscription(p_subscription_id text,p_days integer,p_reason text,p_extended_by text default null,p_notes text default null)
returns public.bmb_subscriptions language plpgsql as $$
declare s public.bmb_subscriptions%rowtype; old_expiry date; new_expiry date; extension_id text;
begin
  if p_days is null or p_days<=0 then raise exception 'Extension days must be greater than zero' using errcode='22023'; end if;
  if nullif(trim(coalesce(p_reason,'')),'') is null then raise exception 'Extension reason is required' using errcode='22023'; end if;
  select * into s from public.bmb_subscriptions where id=p_subscription_id for update;
  if not found then raise exception 'Subscription % not found',p_subscription_id using errcode='P0002'; end if;
  old_expiry:=s.expiry_date; new_expiry:=old_expiry+p_days;
  extension_id:='EXT-'||extract(epoch from clock_timestamp())::bigint::text||'-'||upper(substr(md5(random()::text),1,5));
  insert into public.bmb_subscription_extensions(id,subscription_id,days_added,reason,notes,old_expiry_date,new_expiry_date,extended_by) values(extension_id,s.id,p_days,trim(p_reason),nullif(trim(p_notes),''),old_expiry,new_expiry,nullif(trim(p_extended_by),''));
  update public.bmb_subscriptions set expiry_date=new_expiry,total_extension_days=coalesce(total_extension_days,0)+p_days,updated_at=now() where id=s.id returning * into s;
  return s;
end;
$$;

grant execute on function public.bmb_extend_subscription(text,integer,text,text,text) to anon, authenticated;
grant execute on function public.bmb_generate_subscription_receipt_number() to anon, authenticated;
