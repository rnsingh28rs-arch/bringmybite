CREATE OR REPLACE FUNCTION public.bmb_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.bmb_admin_users a
    WHERE a.user_id = auth.uid()::text
      AND a.active = true
      AND a.role_id IN ('admin','ceo-director')
  );
$function$;

CREATE OR REPLACE FUNCTION public.bmb_has_staff_permission(p_panel_id text, p_action text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.bmb_admin_users a
    JOIN public.bmb_permissions p ON p.role_id = a.role_id
    WHERE a.user_id = auth.uid()::text
      AND a.active = true
      AND p.panel_id = p_panel_id
      AND CASE p_action
        WHEN 'read' THEN p.can_read
        WHEN 'write' THEN p.can_write
        WHEN 'add' THEN p.can_add
        WHEN 'delete' THEN p.can_delete
        ELSE false
      END
  );
$function$;

CREATE OR REPLACE FUNCTION public.bmb_get_staff_account()
RETURNS TABLE(user_id uuid, username text, email text, role_id text, active boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT a.user_id::uuid, a.username, a.email, a.role_id, a.active
  FROM public.bmb_admin_users a
  WHERE a.user_id = auth.uid()::text
    AND a.active = true
  LIMIT 1;
$function$;
