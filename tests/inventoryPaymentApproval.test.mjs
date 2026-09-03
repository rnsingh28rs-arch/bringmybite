import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateLineTotal, buildPaymentRequest, paymentStatusLabel } from '../src/utils/inventoryPaymentApproval.mjs';

test('calculates each purchase line and the complete payment request total', () => {
  const result = buildPaymentRequest([
    { id: 'IND-RICE', itemName: 'Basmati Rice', quantityNeeded: 10, unit: 'kg', purchasePrice: 70 },
    { id: 'IND-DAL', itemName: 'Toor Dal', quantityNeeded: 10, unit: 'kg', purchasePrice: 120 },
  ]);
  assert.equal(calculateLineTotal(10, 70), 700);
  assert.deepEqual(result.lines.map(x => x.lineTotal), [700, 1200]);
  assert.equal(result.totalAmount, 1900);
});

test('rejects a payment request when an approved indent has no valid purchase price', () => {
  assert.throws(() => buildPaymentRequest([
    { id: 'IND-RICE', itemName: 'Basmati Rice', quantityNeeded: 10, unit: 'kg', purchasePrice: 0 },
  ]), /purchase price/i);
});

test('payment status labels distinguish manager approval from admin payment approval', () => {
  assert.equal(paymentStatusLabel({ status: 'Approved', paymentStatus: 'Not Submitted' }), 'Waiting for Manager Purchase Price');
  assert.equal(paymentStatusLabel({ status: 'Approved', paymentStatus: 'Pending Admin Approval' }), 'Waiting for Admin Payment Approval');
  assert.equal(paymentStatusLabel({ status: 'Approved', paymentStatus: 'Approved' }), 'Payment Approved');
  assert.equal(paymentStatusLabel({ status: 'Approved', paymentStatus: 'Rejected' }), 'Payment Rejected');
});
