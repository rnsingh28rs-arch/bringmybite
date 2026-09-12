import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSubscriptionPricing, buildSubscriptionReceiptText } from '../src/utils/subscriptionReceipt.js';

test('calculates a ₹200 bulk discount from ₹3700 standard price and ₹3500 paid', () => {
  assert.deepEqual(calculateSubscriptionPricing(3700, 3500), {
    standardAmount: 3700,
    amountPaid: 3500,
    discountAmount: 200,
  });
});

test('receipt text shows actual paid amount, discount and reason', () => {
  const text = buildSubscriptionReceiptText({
    receiptNumber: 'BMB-SUB-20260912-ABC123',
    customerName: 'Bulk Student Group',
    packageType: 'VEG CLASSIC',
    standardAmount: 3700,
    amountPaid: 3500,
    discountReason: 'Bulk Group Subscription',
  });

  assert.match(text, /Standard Price: ₹3,700/);
  assert.match(text, /Discount: ₹200/);
  assert.match(text, /Actual Amount Paid: ₹3,500/);
  assert.match(text, /Reason: Bulk Group Subscription/);
});
