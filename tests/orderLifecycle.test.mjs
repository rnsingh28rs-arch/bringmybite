import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextOrderStatus, getOrderActions, ORDER_LIFECYCLE } from '../src/utils/orderLifecycle.mjs';

test('order lifecycle advances in order from verification to delivery', () => {
  let status = ORDER_LIFECYCLE[0];
  for (const expected of ORDER_LIFECYCLE.slice(1)) {
    assert.equal(getNextOrderStatus(status), expected);
    status = expected;
  }
  assert.equal(status, 'Delivered');
  assert.equal(getNextOrderStatus('Delivered'), null);
});

test('role actions expose the complete operational handoff', () => {
  assert.deepEqual(getOrderActions('Pending Verification', 'admin'), ['Approved', 'Declined']);
  assert.deepEqual(getOrderActions('Approved', 'chef'), ['Preparing']);
  assert.deepEqual(getOrderActions('Preparing', 'chef'), ['Dispatched']);
  assert.deepEqual(getOrderActions('Dispatched', 'manager'), ['Delivered']);
  assert.deepEqual(getOrderActions('Delivered', 'manager'), []);
});
