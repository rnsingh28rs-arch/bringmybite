import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const migration = fs.readFileSync(new URL('../supabase/migrations/20261016070000_enforce_staff_session_revocation.sql', import.meta.url), 'utf8');
const rest = fs.readFileSync(new URL('../src/cms/supabaseRest.ts', import.meta.url), 'utf8');
const login = fs.readFileSync(new URL('../src/components/panels/SimpleStaffLogin.tsx', import.meta.url), 'utf8');
const realtime = fs.readFileSync(new URL('../src/cms/supabaseRealtime.ts', import.meta.url), 'utf8');
const password = fs.readFileSync(new URL('../supabase/functions/staff-password-update/index.ts', import.meta.url), 'utf8');

test('database revocation blocks old JWT session IDs and protects staff authorization helpers', () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.bmb_revoked_staff_sessions/);
  assert.match(migration, /auth\.jwt\(\)->>'session_id'/);
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.bmb_revoke_staff_session\(\)/);
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.bmb_revoke_staff_sessions_for_user\(p_user_id uuid\)/);
  assert.match(migration, /public\.bmb_staff_session_is_valid\(\)/);
  assert.match(migration, /REVOKE ALL ON FUNCTION public\.bmb_revoke_staff_sessions_for_user\(uuid\) FROM PUBLIC, anon, authenticated/);
  assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.bmb_revoke_staff_sessions_for_user\(uuid\) TO service_role/);
});

test('logout revokes the database session before signing out of Supabase Auth', () => {
  assert.match(rest, /rest\/v1\/rpc\/bmb_revoke_staff_session/);
  assert.ok(rest.indexOf('rpc/bmb_revoke_staff_session') < rest.indexOf('/auth/v1/logout'));
  assert.match(rest, /scope=global/);
});

test('staff panel rechecks sessions periodically and on focus/storage changes', () => {
  assert.match(login, /bmb_get_staff_account/);
  assert.match(login, /setInterval\(\(\) => \{\s*if \(document\.visibilityState === 'visible'\)/);
  assert.match(login, /addEventListener\('storage'/);
  assert.match(login, /bmb-staff-session-change/);
});

test('password reset revokes all target sessions before changing the password', () => {
  assert.match(password, /bmb_revoke_staff_sessions_for_user/);
  assert.ok(password.indexOf('bmb_revoke_staff_sessions_for_user') < password.indexOf('updateUserById'));
});

test('staff realtime stops when the staff session is revoked', () => {
  assert.match(realtime, /bmb-staff-session-change/);
  assert.match(realtime, /removeEventListener\('bmb-staff-session-change'/);
});
