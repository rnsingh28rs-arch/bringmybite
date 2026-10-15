import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const central = fs.readFileSync(new URL('../src/utils/centralData.ts', import.meta.url), 'utf8');
const rest = fs.readFileSync(new URL('../src/cms/supabaseRest.ts', import.meta.url), 'utf8');
const migration = fs.readFileSync(new URL('../supabase/migrations/20261015152600_allow_public_pending_subscription_submissions.sql', import.meta.url), 'utf8');

test('public subscription submission does not request a protected row representation', () => {
  assert.ok(central.includes("supabaseInsertMinimal('bmb_subscriptions'"));
  assert.ok(rest.includes("Prefer:'return=minimal'"));
});

test('anonymous subscription inserts are limited to pending customer submissions', () => {
  assert.match(migration, /GRANT INSERT ON TABLE public\.bmb_subscriptions TO anon/);
  assert.match(migration, /FOR INSERT\s+TO anon\s+WITH CHECK/);
  assert.match(migration, /verification_status = 'Pending'/);
  assert.match(migration, /package_type = 'VEG CLASSIC' AND package_code = 'VC'/);
  assert.doesNotMatch(migration, /GRANT SELECT ON TABLE public\.bmb_subscriptions TO anon/);
});
