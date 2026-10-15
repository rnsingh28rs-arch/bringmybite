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
