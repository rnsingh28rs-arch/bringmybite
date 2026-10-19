import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const config = fs.readFileSync(new URL('../src/data/paymentConfig.ts', import.meta.url), 'utf8');
const card = fs.readFileSync(new URL('../src/components/common/PaymentDetailsCard.tsx', import.meta.url), 'utf8');

test('UPI and QR generation use the live CMS payment destination, not hardcoded fallback data', () => {
  assert.match(config, /payment: Partial<BankDetails> = OFFICIAL_BANK_DETAILS/);
  assert.match(config, /String\(payment\.upiId \|\| ''\)\.trim\(\)/);
  assert.match(config, /getUpiPaymentUrl\(amount, note, payment\)/);
  assert.doesNotMatch(config, /\b\d{10}@[A-Z]+\b/);
  assert.match(card, /getUpiPaymentUrl\(payableAmount, orderReference, payment\)/);
  assert.match(card, /getQrCodeUrl\(payableAmount, orderReference, payment\)/);
});

test('public payment card does not render blank account number or IFSC rows', () => {
  assert.match(card, /payment\.accountNumber&&/);
  assert.match(card, /payment\.ifscCode&&/);
  assert.match(card, /Payment QR not configured/);
});
