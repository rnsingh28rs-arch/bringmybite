import test from 'node:test';
import assert from 'node:assert/strict';
import { toUiOrderStatus, toDatabaseOrderStatus } from '../src/utils/orderStatus.mjs';

test('customer tracking maps database Confirmed status to Approved', () => {
  assert.equal(toUiOrderStatus('Confirmed'), 'Approved');
  assert.equal(toUiOrderStatus('Preparing'), 'Preparing');
  assert.equal(toUiOrderStatus('Dispatched'), 'Dispatched');
  assert.equal(toUiOrderStatus('Delivered'), 'Delivered');
});

test('declined status maps consistently between database and customer UI', () => {
  assert.equal(toUiOrderStatus('Rejected'), 'Declined');
  assert.equal(toDatabaseOrderStatus('Declined'), 'Rejected');
  assert.equal(toDatabaseOrderStatus('Approved'), 'Confirmed');
});

test('pending verification remains pending until staff action', () => {
  assert.equal(toUiOrderStatus('Pending Verification'), 'Pending Verification');
  assert.equal(toDatabaseOrderStatus('Pending Verification'), 'Pending Verification');
});
