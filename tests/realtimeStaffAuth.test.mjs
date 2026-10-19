import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const rest = fs.readFileSync(new URL('../src/cms/supabaseRest.ts', import.meta.url), 'utf8');
const realtime = fs.readFileSync(new URL('../src/cms/supabaseRealtime.ts', import.meta.url), 'utf8');

test('Realtime uses the current authenticated staff access token instead of the publishable key', () => {
  assert.match(rest, /export const getSupabaseRealtimeAccessToken\s*=\s*\(\)\s*=>\s*getStaffAccessToken\(\)\s*\|\|\s*config\.anonKey/);
  assert.match(realtime, /import \{ getSupabaseRealtimeAccessToken, getSupabaseUrl, getSupabasePublishableKey, hasValidStaffSession, isSupabaseConfigured \} from '\.\/supabaseRest'/);
  assert.match(realtime, /access_token:\s*activeAccessToken/);
});

test('Realtime reconnects when the staff access token rotates after session refresh', () => {
  assert.match(realtime, /getSupabaseRealtimeAccessToken\(\) !== activeAccessToken/);
  assert.match(realtime, /message\.ref === joinMessageRef/);
  assert.match(realtime, /reconnectAttempt = 0/);
});

test('CMS realtime subscribes only to tables in the Supabase Realtime publication', () => {
  const cms = fs.readFileSync(new URL('../src/cms/CmsContext.tsx', import.meta.url), 'utf8');
  assert.match(cms, /const tables=\['bmb_settings','bmb_pricing','bmb_banners','bmb_menus','bmb_registration_fields'\]/);
  assert.doesNotMatch(cms, /const tables=\[[^\]]*'bmb_admin_users'/);
});

test('Realtime wire format matches the V1 map serializer reported by production logs', () => {
  assert.ok(realtime.includes('vsn=1.0.0'));
  assert.ok(realtime.includes("event: 'phx_join'"));
  assert.ok(realtime.includes('current.send(JSON.stringify({'));
  assert.ok(!realtime.includes('JSON.stringify(['));
});

test('staff-only Realtime channels stop rather than reconnecting anonymously after expiry', () => {
  assert.match(realtime, /options\.requireStaffAuth && !hasValidStaffSession\(\)/);
  const app = fs.readFileSync(new URL('../src/context/AppContext.tsx', import.meta.url), 'utf8');
  const alerts = fs.readFileSync(new URL('../src/components/panels/OrderRequestAlerts.tsx', import.meta.url), 'utf8');
  assert.ok(app.includes('{requireStaffAuth:true}'));
  assert.ok(alerts.includes('requireStaffAuth: true'));
});


test('Realtime exposes explicit subscription status and does not call a socket open a live subscription', () => {
  assert.match(realtime, /export type RealtimeStatus = 'connecting' \| 'subscribed' \| 'error' \| 'disconnected'/);
  assert.match(realtime, /onStatus\?: \(status: RealtimeStatus, detail\?: string\) => void/);
  assert.match(realtime, /joinTimeout = window\.setTimeout/);
  assert.match(realtime, /Supabase did not acknowledge the live order subscription within 8 seconds/);
  assert.match(realtime, /message\.ref === joinMessageRef/);
  assert.match(realtime, /report\('subscribed', 'Supabase acknowledged the live order subscription\.'/);
});

test('Order request alerts display confirmed Realtime state while retaining REST polling fallback', () => {
  const alerts = fs.readFileSync(new URL('../src/components/panels/OrderRequestAlerts.tsx', import.meta.url), 'utf8');
  assert.match(alerts, /onStatus: \(status, detail\)/);
  assert.match(alerts, /LIVE UPDATES CONNECTED/);
  assert.match(alerts, /LIVE UPDATES RECONNECTING/);
  assert.match(alerts, /setInterval\(\(\) => void refresh\(false\), ALERT_POLL_MS\)/);
});
