import test from 'node:test';
import assert from 'node:assert/strict';
import { getSubscriptionPlan, getSubscriptionPlanOptions } from '../src/utils/subscriptionPlans.js';

test('lunch subscription offers only Veg Classic at ₹2,099', () => {
  assert.deepEqual(getSubscriptionPlan('Lunch Only', 'VEG CLASSIC'), { mealPreference: 'Lunch Only', packageType: 'VEG CLASSIC', label: 'Veg Classic Thali', price: 2099 });
  assert.equal(getSubscriptionPlanOptions('Lunch Only').length, 1);
});

test('dinner subscription offers the three requested thalis and prices', () => {
  assert.deepEqual(getSubscriptionPlanOptions('Dinner Only').map((p) => [p.packageType, p.label, p.price]), [
    ['VEG CLASSIC', 'Veg Classic Thali', 2099],
    ['EGG DELIGHT', 'Egg Delight Thali', 2399],
    ['NON-VEG CLUB', 'Non-Veg Club Thali', 2699]
  ]);
});

test('lunch rejects egg and non-veg subscriptions', () => {
  assert.throws(() => getSubscriptionPlan('Lunch Only', 'EGG DELIGHT'));
  assert.throws(() => getSubscriptionPlan('Lunch Only', 'NON-VEG CLUB'));
});

test('legacy Lunch + Dinner package pricing remains available', () => {
  assert.deepEqual(getSubscriptionPlan('Lunch + Dinner', 'VEG CLASSIC'), { mealPreference: 'Lunch + Dinner', packageType: 'VEG CLASSIC', label: 'Veg Classic Package', price: 3700 });
});
