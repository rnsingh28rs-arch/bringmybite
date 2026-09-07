import test from 'node:test';
import assert from 'node:assert/strict';
import { getNewOrders, formatNewOrderAlert } from '../src/utils/orderAlerts.mjs';

test('detects only genuinely new order IDs', () => {
  const previous = new Set(['ORD-100']);
  const orders = [
    { id: 'ORD-100', customerName: 'Existing Customer', amount: 100 },
    { id: 'ORD-101', customerName: 'New Customer', amount: 120 },
  ];

  assert.deepEqual(getNewOrders(previous, orders).map((order) => order.id), ['ORD-101']);
});

test('does not treat status changes as new orders', () => {
  const previous = new Set(['ORD-100']);
  const orders = [{ id: 'ORD-100', customerName: 'Customer', amount: 100, status: 'Approved' }];

  assert.deepEqual(getNewOrders(previous, orders), []);
});

test('formats a useful new-order alert', () => {
  const message = formatNewOrderAlert({ id: 'ORD-101', customerName: 'Rahul', amount: 250 });

  assert.match(message, /NEW ORDER REQUEST/);
  assert.match(message, /Rahul/);
  assert.match(message, /ORD-101/);
  assert.match(message, /₹250/);
});
