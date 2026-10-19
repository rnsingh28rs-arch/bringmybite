import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const migration = fs.readFileSync(new URL('../supabase/migrations/20261019160000_atomic_cooking_batch_consumption.sql', import.meta.url), 'utf8');
const chef = fs.readFileSync(new URL('../src/components/panels/ChefKitchenPanel.tsx', import.meta.url), 'utf8');

test('cooking batch consumption is atomic, permission-checked and idempotent', () => {
  assert.match(migration, /bmb_inventory_consumption_batches/);
  assert.match(migration, /bmb_has_staff_permission\('inventory','write'\)/);
  assert.match(migration, /bmb_record_inventory_movement_idempotent/);
  assert.match(migration, /Batch ID was already used for a different cooking payload/);
  assert.match(migration, /Insufficient stock for/);
  assert.match(migration, /Unit mismatch for/);
});

test('Chef can explicitly record actual cooked trays from saved recipe standards', () => {
  assert.match(chef, /bmb_consume_inventory_batch/);
  assert.match(chef, /Actual trays cooked/);
  assert.match(chef, /Only saved recipe standards are used/);
  assert.match(chef, /Configure the menu for this day/);
  assert.match(chef, /createInventoryIdempotencyKey\('cooking-batch'\)/);
});
