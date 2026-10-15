DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.bmb_admin_users a
    LEFT JOIN auth.users u ON lower(u.email) = lower(a.username) || '@bringmybite.com'
    WHERE a.active = true AND u.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot align staff IDs: an active staff username has no matching Supabase Auth account.';
  END IF;
END $$;

UPDATE public.bmb_admin_users a
SET user_id = u.id::text
FROM auth.users u
WHERE lower(u.email) = lower(a.username) || '@bringmybite.com'
  AND a.user_id IS DISTINCT FROM u.id::text;
