import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const migration = fs.readFileSync(new URL('../supabase/migrations/20261016060000_restore_permission_driven_dadmin_actions.sql', import.meta.url), 'utf8');

test('D-Admin actions use the configured permission matrix rather than a hard-coded read-only branch', () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.bmb_has_staff_permission/);
  assert.match(migration, /WHEN p_action = 'read' THEN p\.can_read/);
  assert.match(migration, /WHEN p_action = 'write' THEN p\.can_write/);
  assert.match(migration, /WHEN p_action = 'add' THEN p\.can_add/);
  assert.match(migration, /WHEN p_action = 'delete' THEN p\.can_delete/);
  assert.doesNotMatch(migration, /WHEN a\.role_id\s*=\s*'ceo-director'/);
  assert.match(migration, /REVOKE ALL ON FUNCTION public\.bmb_has_staff_permission\(text, text\) FROM PUBLIC, anon/);
  assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.bmb_has_staff_permission\(text, text\) TO authenticated/);
});
