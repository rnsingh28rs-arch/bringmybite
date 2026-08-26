-- Staff authentication source of truth: username + SHA-256 PIN hash.
alter table public.bmb_admin_users add column if not exists username text;
update public.bmb_admin_users set username = case role_id when 'admin' then 'admin' when 'manager' then 'manager' when 'chef' then 'chef' when 'ceo-director' then 'dadmin' else lower(regexp_replace(coalesce(role_id,'staff'), '[^a-z0-9_-]', '', 'g')) end where username is null or btrim(username) = '';
alter table public.bmb_admin_users alter column username set not null;
create unique index if not exists bmb_admin_users_username_key on public.bmb_admin_users (lower(username));
alter table public.bmb_admin_users add constraint bmb_admin_users_username_format check (username ~ '^[a-z0-9][a-z0-9._-]{2,31}$');

-- pin_hash is a SHA-256 hex digest and is never plaintext.
alter table public.bmb_admin_users add column if not exists pin_hash text;
