alter table public.bmb_subscriptions
  add column if not exists map_latitude numeric,
  add column if not exists map_longitude numeric;

alter table public.bmb_orders
  add column if not exists map_latitude numeric,
  add column if not exists map_longitude numeric;

create index if not exists bmb_subscriptions_location_idx
  on public.bmb_subscriptions (map_latitude, map_longitude)
  where map_latitude is not null and map_longitude is not null;

create index if not exists bmb_orders_location_idx
  on public.bmb_orders (map_latitude, map_longitude)
  where map_latitude is not null and map_longitude is not null;
