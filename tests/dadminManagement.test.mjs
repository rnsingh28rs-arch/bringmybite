import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const migration = fs.readFileSync(new URL('../supabase/migrations/20261016050000_restore_dadmin_cms_and_staff_management.sql', import.meta.url), 'utf8');
const manager = fs.readFileSync(new URL('../src/components/panels/StaffPasswordManager.tsx', import.meta.url), 'utf8');
const edge = fs.readFileSync(new URL('../supabase/functions/staff-password-update/index.ts', import.meta.url), 'utf8');

test('D-Admin and Admin can select a staff account for password changes', () => {
  assert.match(manager, /const canManageOthers = isAdmin \|\| isDAdmin/);
  assert.match(manager, /\{canManageOthers &&/);
  assert.match(manager, /useState\(isDAdmin \? 'ceo-director' : 'admin'\)/);
  assert.match(manager, /useState\(isDAdmin \? 'dadmin' : 'admin'\)/);
});

test('password edge function permits only Admin and D-Admin to change another staff password', () => {
  assert.match(edge, /if \(!\['admin', 'ceo-director'\]\.includes\(actor\.role_id\)\)/);
  assert.match(edge, /Only Admin or D-Admin can change another staff member password/);
  assert.match(edge, /updateUserById\(targetId, \{ password: newPassword \}\)/);
});

test('D-Admin can persist CMS and role-management changes but customer/order permissions remain separate', () => {
  for (const policy of [
    'bmb_dadmin_manage_banners','bmb_dadmin_manage_menus','bmb_dadmin_manage_pricing',
    'bmb_dadmin_manage_settings','bmb_dadmin_manage_registration_fields',
    'bmb_dadmin_manage_payment_settings','bmb_dadmin_manage_panels','bmb_dadmin_manage_roles',
    'bmb_dadmin_manage_permissions','bmb_dadmin_manage_admin_users',
    'bmb_dadmin_manage_staff_salaries','bmb_dadmin_manage_gst_billing'
  ]) assert.ok(migration.includes(policy), 'missing policy ' + policy);
  assert.match(migration, /FOR ALL TO authenticated USING \(public\.bmb_is_dadmin\(\)\) WITH CHECK \(public\.bmb_is_dadmin\(\)\)/);
  assert.doesNotMatch(migration, /DROP POLICY IF EXISTS .* ON public\.bmb_orders/);
});
