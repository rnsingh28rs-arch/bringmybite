-- Inventory purchase payment workflow: PostgREST needs table privileges in addition to RLS policies.
-- The application uses the publishable/anon key for its REST calls, so grant only the
-- operations this workflow actually performs.

grant select, insert, update
  on table public.bmb_inventory_purchase_requests
  to anon, authenticated;

grant select, insert
  on table public.bmb_inventory_purchase_request_lines
  to anon, authenticated;
