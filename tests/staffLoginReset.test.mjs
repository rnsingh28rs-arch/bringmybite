import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app = fs.readFileSync('src/components/panels/PanelApp.tsx', 'utf8');
const login = fs.readFileSync('src/components/panels/SimpleStaffLogin.tsx', 'utf8');
test('staff panel uses the fresh simple username/password login', () => { assert.match(app, /SimpleStaffLogin/); assert.doesNotMatch(app, /StaffLoginGate/); assert.match(login, /Username/); assert.match(login, /Password/); assert.doesNotMatch(login, /email/i); assert.doesNotMatch(login, /bmb_admin_users/); assert.doesNotMatch(login, /staff-login/); });
