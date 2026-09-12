alter table public.bmb_subscriptions
  add column if not exists standard_amount numeric not null default 3700,
  add column if not exists discount_reason text;

alter table public.bmb_subscriptions
  drop column if exists discount_amount;

alter table public.bmb_subscriptions
  add column discount_amount numeric generated always as (greatest(0::numeric, standard_amount - amount_paid)) stored;

alter table public.bmb_subscriptions
  add constraint bmb_subscriptions_nonnegative_pricing check (standard_amount >= 0 and amount_paid >= 0),
  add constraint bmb_subscriptions_discount_reason_required check (amount_paid >= standard_amount or nullif(trim(discount_reason), '') is not null);

update public.bmb_subscriptions
set standard_amount = case when coalesce(monthly_price,0) > 0 then monthly_price else 3700 end,
    updated_at = now()
where standard_amount is null or standard_amount = 0;

create or replace function public.bmb_approve_subscription(
  p_subscription_id text,
  p_route_code text default null,
  p_exec_name text default null
)
returns public.bmb_subscriptions
language plpgsql
as $$
declare
  s public.bmb_subscriptions%rowtype;
  receipt text;
begin
  select * into s from public.bmb_subscriptions where id = p_subscription_id for update;
  if not found then
    raise exception 'Subscription % not found', p_subscription_id using errcode = 'P0002';
  end if;
  if s.amount_paid < s.standard_amount and nullif(trim(coalesce(s.discount_reason,'')), '') is null then
    raise exception 'Discount reason is required when amount paid is below standard price' using errcode = '22023';
  end if;
  receipt := coalesce(s.receipt_number, 'BMB-SUB-' || to_char(current_date,'YYYYMMDD') || '-' || upper(substr(md5(s.id || clock_timestamp()::text || random()::text),1,6)));
  update public.bmb_subscriptions
  set verification_status='Approved', active=true, approved_at=coalesce(approved_at,now()),
      original_expiry_date=coalesce(original_expiry_date,expiry_date), receipt_number=receipt,
      route_code=coalesce(nullif(trim(p_route_code),''),route_code),
      executive_name=coalesce(nullif(trim(p_exec_name),''),executive_name), updated_at=now()
  where id=s.id returning * into s;
  return s;
end;
$$;

with verified as (
  select o.id, max(o.updated_at) as updated_at
  from public.bmb_orders o
  where o.kind='subscription' and o.payment_status='Verified' and o.status in ('Confirmed','Delivered')
  group by o.id
)
update public.bmb_subscriptions s
set verification_status='Approved', active=true,
    approved_at=coalesce(s.approved_at,verified.updated_at,now()),
    original_expiry_date=coalesce(s.original_expiry_date,s.expiry_date),
    receipt_number=coalesce(s.receipt_number,'BMB-SUB-' || to_char(coalesce(s.payment_date,current_date),'YYYYMMDD') || '-' || upper(substr(md5(s.id),1,6))),
    updated_at=now()
from verified where s.id=verified.id;
