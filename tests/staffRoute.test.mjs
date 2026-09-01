import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveStaffRoute } from '../src/utils/staffRoute.mjs';
import { adjustStock, stockStatus } from '../src/utils/inventoryStock.mjs';

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

test('stock adjustment calculates the new quantity and never goes below zero', () => {
  assert.equal(adjustStock(0, 5), 5);
  assert.equal(adjustStock(5, -2), 3);
  assert.equal(adjustStock(5, -10), 0);
});

test('stock status matches the saved quantity', () => {
  assert.equal(stockStatus(0, 0), 'Critical');
  assert.equal(stockStatus(3, 5), 'Low Stock');
  assert.equal(stockStatus(6, 5), 'In Stock');
});
