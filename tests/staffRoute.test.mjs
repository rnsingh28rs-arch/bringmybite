import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveStaffRoute } from '../src/utils/staffRoute.mjs';

test('direct panel paths resolve without a hash credential', () => {
  assert.equal(resolveStaffRoute('/dadmin', '').role, 'd_admin');
  assert.equal(resolveStaffRoute('/admin', '').role, 'admin');
  assert.equal(resolveStaffRoute('/manager', '').role, 'manager');
  assert.equal(resolveStaffRoute('/chef', '').role, 'chef');
});

test('panel paths do not depend on hash credentials', () => {
  assert.equal(resolveStaffRoute('/dadmin', '#anything').role, 'd_admin');
  assert.equal(resolveStaffRoute('/admin', '#anything').role, 'admin');
  assert.equal(resolveStaffRoute('/manager', '#anything').role, 'manager');
  assert.equal(resolveStaffRoute('/chef', '#anything').role, 'chef');
});

test('customer path remains customer', () => {
  assert.equal(resolveStaffRoute('/', ''), null);
});
