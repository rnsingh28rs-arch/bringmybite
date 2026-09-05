import test from 'node:test';
import assert from 'node:assert/strict';
import { getCustomerSubscription, canCustomerSeeStaffPortals } from '../src/utils/customerMobileAccess.mjs';

test('unauthenticated customer does not receive a fake subscription fallback', () => {
  assert.equal(getCustomerSubscription([]), null);
});

test('customer subscription is selected by customer identity, never the first global row', () => {
  const subscriptions = [
    { id: 'A', customerName: 'Other Customer', mobileNumber: '9999999999' },
    { id: 'B', customerName: 'Rahul', mobileNumber: '9315075165' }
  ];
  assert.equal(getCustomerSubscription(subscriptions, '9315075165')?.id, 'B');
  assert.equal(getCustomerSubscription(subscriptions, '8888888888'), null);
});

test('customer view never exposes staff portals', () => {
  assert.equal(canCustomerSeeStaffPortals(), false);
});

test('staff view may expose operational portals', () => {
  assert.equal(canCustomerSeeStaffPortals('admin'), true);
  assert.equal(canCustomerSeeStaffPortals('manager'), true);
  assert.equal(canCustomerSeeStaffPortals('chef'), true);
  assert.equal(canCustomerSeeStaffPortals('d_admin'), true);
});
