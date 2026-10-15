-- The rider registry contains credentials and is private to active Admin/D-Admin users.
-- Keep anonymous access revoked; explicit policy documents the intended access boundary.
ALTER TABLE public.bmb_panel_riders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bmb_panel_riders_admin_manage ON public.bmb_panel_riders;
CREATE POLICY bmb_panel_riders_admin_manage
ON public.bmb_panel_riders
FOR ALL TO authenticated
USING (public.bmb_is_admin())
WITH CHECK (public.bmb_is_admin());
REVOKE ALL ON TABLE public.bmb_panel_riders FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.bmb_panel_riders TO authenticated;
