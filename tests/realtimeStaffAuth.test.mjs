import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const rest = fs.readFileSync(new URL('../src/cms/supabaseRest.ts', import.meta.url), 'utf8');
const realtime = fs.readFileSync(new URL('../src/cms/supabaseRealtime.ts', import.meta.url), 'utf8');

test('Realtime uses the current authenticated staff access token instead of the publishable key', () => {
  assert.match(rest, /export const getSupabaseRealtimeAccessToken\s*=\s*\(\)\s*=>\s*getStaffAccessToken\(\)\s*\|\|\s*config\.anonKey/);
  assert.match(realtime, /import \{ getSupabaseRealtimeAccessToken \} from '\.\/supabaseRest'/);
  assert.match(realtime, /access_token:\s*activeAccessToken/);
});

test('Realtime reconnects when the staff access token rotates after session refresh', () => {
  assert.match(realtime, /getSupabaseRealtimeAccessToken\(\) !== activeAccessToken/);
  assert.match(realtime, /if \(eventName === 'phx_reply' && payload\?\.status === 'ok'\) reconnectAttempt = 0/);
});
