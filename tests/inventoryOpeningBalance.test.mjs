import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('inventory item creation uses one database RPC for item and opening balance', () => {
  const central = read('src/utils/centralData.ts');
  assert.match(central, /supabaseRpc\('bmb_create_inventory_item_with_opening_balance'/);
  assert.doesNotMatch(central, /export async function insertInventory\(item:InventoryItem\)\{centralRequired\(\);await supabaseInsert\('bmb_inventory'/);
});

test('opening balance RPC checks staff permission and records ledger before returning', () => {
  const migration = read('supabase/migrations/20261019120000_atomic_inventory_item_opening_balance.sql');
  assert.match(migration, /bmb_has_staff_permission\('inventory','add'\)/);
  assert.match(migration, /INSERT INTO public\.bmb_inventory[\s\S]*?current_stock[\s\S]*?VALUES \([\s\S]*?0,/);
  assert.match(migration, /bmb_record_inventory_movement\([\s\S]*?'ADJUSTMENT',[\s\S]*?'Opening Balance'/);
  assert.match(migration, /REVOKE ALL ON FUNCTION[\s\S]*FROM PUBLIC, anon/);
  assert.match(migration, /GRANT EXECUTE ON FUNCTION[\s\S]*TO authenticated/);
});
