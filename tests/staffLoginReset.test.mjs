import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app = fs.readFileSync('src/components/panels/PanelApp.tsx', 'utf8');
const login = fs.readFileSync('src/components/panels/SimpleStaffLogin.tsx', 'utf8');
test('staff panel uses the simple username/password login with email recovery', () => {
  assert.match(app, /SimpleStaffLogin/);
  assert.doesNotMatch(app, /StaffLoginGate/);
  assert.match(login, /Username/);
  assert.match(login, /Password/);
  assert.match(login, /recoveryEmail/);
  assert.match(login, /\/auth\/v1\/recover/);
  assert.doesNotMatch(login, /bmb_admin_users/);
  assert.match(login, /\/functions\/v1\/staff-login/);
});

test('staff panel verifies the live Auth token and active database role before rendering', () => {
  assert.match(login, /\/auth\/v1\/user/);
  assert.match(login, /\/rest\/v1\/rpc\/bmb_get_staff_account/);
  assert.match(login, /account\.role_id !== getStaffDatabaseRole\(role\)/);
  assert.match(login, /session && sessionVerified/);
});
