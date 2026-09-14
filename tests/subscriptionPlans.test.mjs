import test from 'node:test';
import assert from 'node:assert/strict';
import { getSubscriptionPlanOptions, getSubscriptionPlan } from '../src/utils/subscriptionPlans.js';

test('monthly Lunch + Dinner catalog exposes Veg ₹3700, Egg ₹4000, Non-Veg ₹4500', () => {
  assert.deepEqual(
    getSubscriptionPlanOptions('Lunch + Dinner').map(({ packageType, price }) => ({ packageType, price })),
    [
      { packageType: 'VEG CLASSIC', price: 3700 },
      { packageType: 'EGG DELIGHT', price: 4000 },
      { packageType: 'NON-VEG CLUB', price: 4500 },
    ]
  );
});

test('lunch has one plan and dinner has three plans', () => {
  assert.equal(getSubscriptionPlanOptions('Lunch Only').length, 1);
  assert.equal(getSubscriptionPlanOptions('Dinner Only').length, 3);
});

test('monthly plan lookup returns Lunch + Dinner meal preference', () => {
  assert.equal(getSubscriptionPlan('Lunch + Dinner', 'NON-VEG CLUB').mealPreference, 'Lunch + Dinner');
});
