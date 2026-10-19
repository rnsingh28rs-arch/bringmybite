import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('inventory movements record both signed delta and resulting balance', () => {
  const migration = read('supabase/migrations/20261019140000_idempotent_inventory_movements.sql');
  assert.match(migration, /ADD COLUMN IF NOT EXISTS quantity_delta numeric/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS balance_after numeric/);
  assert.match(migration, /v_delta := v_next-COALESCE\(v_item\.current_stock,0\)/);
  assert.match(migration, /balance_after/);
});

test('movement idempotency key is unique and payload mismatches are rejected', () => {
  const migration = read('supabase/migrations/20261019140000_idempotent_inventory_movements.sql');
  assert.match(migration, /CREATE UNIQUE INDEX IF NOT EXISTS bmb_inventory_movements_idempotency_key_uq/);
  assert.match(migration, /Idempotency key was already used for a different inventory operation/);
  assert.match(migration, /bmb_record_inventory_movement_idempotent/);
});

test('purchase receipt retry returns the existing result without adding stock twice', () => {
  const migration = read('supabase/migrations/20261019140000_idempotent_inventory_movements.sql');
  assert.match(migration, /bmb_receive_inventory_purchase_idempotent/);
  assert.match(migration, /WHERE idempotency_key=trim\(p_idempotency_key\)/);
  assert.match(migration, /Idempotency key was already used for a different receipt/);
  assert.match(migration, /v_total_received>v_indent\.quantity_needed/);
});

test('receipt and cooking UI reuse operation keys after a failed response', () => {
  const receipt = read('src/components/panels/InventoryPaymentApprovalPanel.tsx');
  const cooking = read('src/components/panels/ChefKitchenPanel.tsx');
  const manager = read('src/components/panels/ManagerStockPanel.tsx');
  assert.match(receipt, /requestKey\\?\\.fingerprint===fingerprint/);
  assert.match(receipt, /recordApprovedInventoryPurchaseWithGrn/);
  assert.match(cooking, /consumptionKey\?\.fingerprint===fingerprint/);
  assert.match(cooking, /disabled=\{consuming\}/);
  assert.match(manager, /movementKey\('manager-receipt'/);
  assert.match(manager, /movementKey\('manager-adjustment'/);
});
