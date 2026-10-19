import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rest = fs.readFileSync(new URL('../src/cms/supabaseRest.ts', import.meta.url), 'utf8');
const realtime = fs.readFileSync(new URL('../src/cms/supabaseRealtime.ts', import.meta.url), 'utf8');

test('Supabase client fails closed when environment variables are absent', () => {
  assert.match(rest, /VITE_SUPABASE_URL.*NEXT_PUBLIC_SUPABASE_URL.*\|\|''/);
  assert.match(rest, /VITE_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(rest, /if\(!config\.url\|\|!config\.anonKey\)throw new Error/);
  assert.doesNotMatch(rest, /tknmdgeikmlsprqppukf\.supabase\.co/);
  assert.doesNotMatch(rest, /sb_publishable_[A-Za-z0-9_-]{10,}/);
});

test('Realtime uses the shared Supabase config and never opens without configuration', () => {
  assert.match(realtime, /getSupabaseUrl\(\)/);
  assert.match(realtime, /getSupabasePublishableKey\(\)/);
  assert.match(realtime, /if \(!isSupabaseConfigured\)/);
  assert.doesNotMatch(realtime, /tknmdgeikmlsprqppukf\.supabase\.co/);
  assert.doesNotMatch(realtime, /sb_publishable_[A-Za-z0-9_-]{10,}/);
});
