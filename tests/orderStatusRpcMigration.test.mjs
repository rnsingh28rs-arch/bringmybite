import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const migration = fs.readFileSync(
  new URL('../supabase/migrations/20261015154500_harden_public_order_status_lookup.sql', import.meta.url),
  'utf8'
);

test('public order status lookup rejects blank IDs and short phone inputs', () => {
  assert.match(migration, /NULLIF\(trim\(coalesce\(p_order_id, ''\)\), ''\)/);
  assert.match(migration, /length\(s\.phone_digits\) >= 10/);
  assert.match(migration, /length\(regexp_replace\(coalesce\(o\.phone, ''\), '\[\^0-9\]', '', 'g'\)\) >= 10/);
});

test('public order tracking remains callable without exposing table-wide SELECT', () => {
  assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.bmb_get_order_status\(text, text\) TO anon, authenticated/);
  assert.doesNotMatch(migration, /GRANT SELECT ON TABLE public\.bmb_orders TO anon/i);
});
