import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/context/AppContext.tsx', import.meta.url), 'utf8');

test('public visitors do not trigger staff-only table reads', () => {
  const loadStart = source.indexOf('const loadData=async()=>{');
  const authGuard = source.indexOf('if(!hasValidStaffSession())', loadStart);
  const protectedRead = source.indexOf('listSubscriptions()', loadStart);
  assert.notEqual(loadStart, -1, 'loadData must exist');
  assert.notEqual(authGuard, -1, 'loadData must check staff authentication');
  assert.ok(protectedRead > authGuard, 'staff-only reads must occur after the authentication guard');
});

test('public visitors do not create staff-table Realtime subscriptions', () => {
  assert.match(source, /if\(!isSupabaseConfigured\|\|!hasValidStaffSession\(\)\)return;/);
  assert.ok(source.includes('subscribeToSupabaseChanges(tables,()=>{void loadData();},{requireStaffAuth:true}'));
});
