import assert from 'node:assert/strict';
import test from 'node:test';
import { getStaffAccessTokenFromSession } from '../src/utils/staffSession.mjs';

test('uses the Supabase access_token session field', () => {
  assert.equal(getStaffAccessTokenFromSession({ access_token: 'valid-supabase-access-jwt' }), 'valid-supabase-access-jwt');
});

test('rejects the legacy opaque staff token because it is not a Supabase access token', () => {
  assert.equal(getStaffAccessTokenFromSession({ token: 'random-uuid-from-legacy-login' }), '');
});

test('rejects empty/non-string access tokens and never falls back to an opaque token', () => {
  assert.equal(getStaffAccessTokenFromSession({ access_token: 'valid-supabase-access-jwt', token: 'opaque-token' }), 'valid-supabase-access-jwt');
  assert.equal(getStaffAccessTokenFromSession({ access_token: '  ', token: 'opaque-token' }), '');
  assert.equal(getStaffAccessTokenFromSession({ access_token: 123, token: null }), '');
  assert.equal(getStaffAccessTokenFromSession(null), '');
});

import { getStaffDatabaseRole, isStaffSessionShapeValid } from '../src/utils/staffSession.mjs';

test('maps each panel role to its authoritative database role', () => {
  assert.equal(getStaffDatabaseRole('admin'), 'admin');
  assert.equal(getStaffDatabaseRole('d_admin'), 'ceo-director');
  assert.equal(getStaffDatabaseRole('manager'), 'manager');
  assert.equal(getStaffDatabaseRole('chef'), 'chef');
  assert.equal(getStaffDatabaseRole('customer'), '');
});

test('staff session shape requires the expected role, both tokens, and future expiry', () => {
  const valid = { role: 'admin', access_token: 'a'.repeat(30), refresh_token: 'r'.repeat(30), expires_at: 2000 };
  assert.equal(isStaffSessionShapeValid(valid, 'admin', 1000), true);
  assert.equal(isStaffSessionShapeValid(valid, 'd_admin', 1000), false);
  assert.equal(isStaffSessionShapeValid({ ...valid, expires_at: 1000 }, 'admin', 1000), false);
  assert.equal(isStaffSessionShapeValid({ ...valid, refresh_token: '' }, 'admin', 1000), false);
  assert.equal(isStaffSessionShapeValid(null, 'admin', 1000), false);
});
