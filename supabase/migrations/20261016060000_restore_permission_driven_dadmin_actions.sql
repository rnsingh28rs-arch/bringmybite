-- Use the configured permission matrix for D-Admin just as for other staff roles.
-- D-Admin is not implicitly read-only; access remains limited by the role's per-panel
-- can_read/can_write/can_add/can_delete flags.
CREATE OR REPLACE FUNCTION public.bmb_has_staff_permission(p_panel_id text, p_action text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.bmb_admin_users a
    JOIN public.bmb_permissions p ON p.role_id = a.role_id
    WHERE a.user_id = auth.uid()::text
      AND a.active = true
      AND p.panel_id = p_panel_id
      AND CASE
        WHEN p_action = 'read' THEN p.can_read
        WHEN p_action = 'write' THEN p.can_write
        WHEN p_action = 'add' THEN p.can_add
        WHEN p_action = 'delete' THEN p.can_delete
        ELSE false
      END
  );
$function$;

REVOKE ALL ON FUNCTION public.bmb_has_staff_permission(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_has_staff_permission(text, text) TO authenticated;
