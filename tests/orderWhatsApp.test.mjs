import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOrderStatusMessage } from '../src/utils/orderWhatsApp.mjs';

const order = {
  id: 'BMB-1001',
  kind: 'instant',
  customerName: 'Rahul',
  amount: 130,
  utrNumber: 'UTR123',
};

test('builds a WhatsApp message for every lifecycle status', () => {
  for (const status of ['Pending Verification', 'Approved', 'Preparing', 'Dispatched', 'Delivered']) {
    const message = buildOrderStatusMessage(order, status);
    assert.match(message, /BMB-1001/);
    assert.match(message, new RegExp(status.toUpperCase()));
  }
});

test('delivered message includes rating and review instructions', () => {
  const message = buildOrderStatusMessage(order, 'Delivered');
  assert.match(message, /1.*5|5.*1/);
  assert.match(message, /rating/i);
  assert.match(message, /review/i);
});

test('declined message includes the decline reason', () => {
  const message = buildOrderStatusMessage(order, 'Declined', 'Payment could not be verified');
  assert.match(message, /DECLINED/);
  assert.match(message, /Payment could not be verified/);
});
