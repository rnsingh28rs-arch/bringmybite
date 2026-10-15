import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const migration = fs.readFileSync(
  new URL('../supabase/migrations/20261015062000_restrict_order_payment_updates.sql', import.meta.url),
  'utf8'
);

test('order RPC requires payment-write permission to change payment status', () => {
  assert.match(migration, /p_payment_status IS NOT NULL AND NOT v_can_manage_payment/);
  assert.match(migration, /bmb_has_staff_permission\('payment', 'write'\)/);
  assert.match(migration, /Payment status updates require payment-write permission/);
});

test('order approval and rejection require payment-write permission', () => {
  assert.match(migration, /p_status IN \('Confirmed', 'Rejected'\) AND NOT v_can_manage_payment/);
  assert.match(migration, /Order approval\/rejection requires payment-write permission/);
});

test('order RPC still checks order-write permission before updates', () => {
  assert.match(migration, /bmb_has_staff_permission\('orders', 'write'\)/);
  assert.match(migration, /An active staff account with order-write permission is required/);
  assert.match(migration, /WHERE id = p_order_id/);
});
