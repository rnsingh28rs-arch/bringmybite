import assert from 'node:assert/strict';
import test from 'node:test';
import { getStaffAccessTokenFromSession } from '../src/utils/staffSession.mjs';

test('uses the current access_token session field', () => {
  assert.equal(getStaffAccessTokenFromSession({ access_token: 'access-jwt' }), 'access-jwt');
});

test('accepts the existing staff login token field', () => {
  assert.equal(getStaffAccessTokenFromSession({ token: 'staff-jwt' }), 'staff-jwt');
});

test('prefers access_token and rejects empty/non-string credentials', () => {
  assert.equal(getStaffAccessTokenFromSession({ access_token: 'access-jwt', token: 'staff-jwt' }), 'access-jwt');
  assert.equal(getStaffAccessTokenFromSession({ access_token: '  ', token: 'staff-jwt' }), 'staff-jwt');
  assert.equal(getStaffAccessTokenFromSession({ access_token: 123, token: null }), '');
  assert.equal(getStaffAccessTokenFromSession(null), '');
});
