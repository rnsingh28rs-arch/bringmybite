import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const rest = fs.readFileSync(new URL('../src/cms/supabaseRest.ts', import.meta.url), 'utf8');
const realtime = fs.readFileSync(new URL('../src/cms/supabaseRealtime.ts', import.meta.url), 'utf8');
const alerts = fs.readFileSync(new URL('../src/components/panels/OrderRequestAlerts.tsx', import.meta.url), 'utf8');

test('Realtime uses the current authenticated staff access token instead of the publishable key', () => {
  assert.match(rest, /export const getSupabaseRealtimeAccessToken\s*=\s*\(\)\s*=>\s*getStaffAccessToken\(\)\s*\|\|\s*config\.anonKey/);
  assert.match(realtime, /import \{ getSupabaseRealtimeAccessToken \} from '\.\/supabaseRest'/);
  assert.match(realtime, /access_token:\s*activeAccessToken/);
});

test('Realtime reconnects when the staff access token rotates after session refresh', () => {
  assert.match(realtime, /getSupabaseRealtimeAccessToken\(\) !== activeAccessToken/);
  assert.match(realtime, /eventName === 'phx_reply'/);
});

test('Realtime does not report live delivery until Supabase acknowledges every requested table', () => {
  assert.match(realtime, /payload\?\.response\?\.postgres_changes/);
  assert.match(realtime, /accepted\.length < tables\.length/);
  assert.match(realtime, /report\('subscribed'/);
  assert.match(realtime, /did not acknowledge the Postgres-change subscription within 8 seconds/);
});

test('Staff order alerts expose Realtime failures instead of implying the polling fallback is live delivery', () => {
  assert.match(alerts, /LIVE DELIVERY CONNECTED/);
  assert.match(alerts, /CONNECTION OPEN — SUBSCRIPTION PENDING/);
  assert.match(alerts, /setRealtimeStatus\(status\)/);
  assert.match(alerts, /Order list also refreshes every 3 seconds as a fallback/);
});

test('CMS realtime subscribes only to tables in the Supabase Realtime publication', () => {
  const cms = fs.readFileSync(new URL('../src/cms/CmsContext.tsx', import.meta.url), 'utf8');
  assert.match(cms, /const tables=\['bmb_settings','bmb_pricing','bmb_banners','bmb_menus','bmb_registration_fields'\]/);
  assert.doesNotMatch(cms, /const tables=\[[^\]]*'bmb_admin_users'/);
});
