import test from 'node:test';
import assert from 'node:assert/strict';

const statuses = ['Pending Verification', 'Approved', 'Preparing', 'Dispatched', 'Delivered'];
const nextStatus = {
  'Pending Verification': 'Approved',
  'Approved': 'Preparing',
  'Preparing': 'Dispatched',
  'Dispatched': 'Delivered',
};

test('order lifecycle advances in order from verification to delivery', () => {
  let status = 'Pending Verification';
  for (const expected of statuses.slice(1)) {
    assert.equal(nextStatus[status], expected);
    status = expected;
  }
  assert.equal(status, 'Delivered');
});

test('only the lifecycle statuses are actionable after approval', () => {
  assert.deepEqual(Object.keys(nextStatus), statuses.slice(0, -1));
  assert.equal(nextStatus['Delivered'], undefined);
});
