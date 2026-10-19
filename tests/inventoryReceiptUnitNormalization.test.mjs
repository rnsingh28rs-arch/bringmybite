import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('purchase receipt compares canonical units and does not treat grams as kilograms', () => {
  const migration = read('supabase/migrations/20261019130000_normalize_inventory_receipt_units.sql');
  assert.match(migration, /bmb_normalize_inventory_unit\(v_indent\.unit\)/);
  assert.match(migration, /bmb_normalize_inventory_unit\(v_item\.unit\)/);
  assert.match(migration, /bmb_record_inventory_movement/);
  assert.match(migration, /Admin payment approval is required before receiving stock/);
  assert.match(migration, /v_total_received > v_indent\.quantity_needed/);
});
