import test from 'node:test';
import assert from 'node:assert/strict';
import { CUSTOMER_MOBILE_TABS, PANEL_ROLES, resolvePanelRole } from '../src/utils/mobilePanelRouting.mjs';

test('customer mobile uses one canonical set of tabs', () => {
  assert.deepEqual(CUSTOMER_MOBILE_TABS, ['home', 'menu', 'instant', 'profile']);
  assert.equal(CUSTOMER_MOBILE_TABS.includes('subscribe'), false);
});

test('panel app resolves all supported staff roles', () => {
  assert.deepEqual(PANEL_ROLES, ['admin', 'manager', 'chef', 'd_admin']);
  assert.equal(resolvePanelRole('/panel-app/admin'), 'admin');
  assert.equal(resolvePanelRole('/panel-app/manager'), 'manager');
  assert.equal(resolvePanelRole('/panel-app/chef'), 'chef');
  assert.equal(resolvePanelRole('/panel-app/d-admin'), 'd_admin');
  assert.equal(resolvePanelRole('/panel-app'), null);
});
