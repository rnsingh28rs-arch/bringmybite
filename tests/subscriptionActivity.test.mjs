import test from 'node:test';
import assert from 'node:assert/strict';
import { getSubscriptionActivityMetrics, getSubscriptionDay } from '../src/utils/subscriptionActivity.mjs';

const today = '2026-09-08';

const subscriptions = [
  { id: '1', active: true, verificationStatus: 'Approved', startDate: '2026-09-08', expiryDate: '2026-10-07' },
  { id: '2', active: true, verificationStatus: 'Approved', startDate: '2026-09-06', expiryDate: '2026-10-05' },
  { id: '3', active: true, verificationStatus: 'Approved', startDate: '2026-09-01', expiryDate: '2026-09-10' },
  { id: '4', active: false, verificationStatus: 'Approved', startDate: '2026-09-07', expiryDate: '2026-10-06' },
  { id: '5', active: true, verificationStatus: 'Pending', startDate: '2026-09-08', expiryDate: '2026-10-07' },
];

test('subscription day is calculated from the start date', () => {
  assert.equal(getSubscriptionDay('2026-09-06', today), 3);
  assert.equal(getSubscriptionDay('2026-09-08', today), 1);
  assert.equal(getSubscriptionDay('2026-09-10', today), 1);
});

test('subscription activity metrics separate active, new today, this week and expiring soon', () => {
  assert.deepEqual(getSubscriptionActivityMetrics(subscriptions, today), {
    active: 3,
    newToday: 1,
    startedThisWeek: 3,
    expiringSoon: 1,
  });
});
