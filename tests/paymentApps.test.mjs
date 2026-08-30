import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('payment card exposes app-specific UPI payment choices with dynamic amount', async () => {
  const source = await readFile(new URL('../src/components/common/PaymentDetailsCard.tsx', import.meta.url), 'utf8');
  assert.match(source, /Google Pay/);
  assert.match(source, /PhonePe/);
  assert.match(source, /Paytm/);
  assert.match(source, /getUpiPaymentUrl/);
  assert.match(source, /amount/);
});
