import assert from 'node:assert/strict';
import test from 'node:test';

function instantTotal(unitPrice, quantity) {
  return unitPrice * quantity;
}

function subscriptionTotal(monthlyPrice, duration) {
  const multiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;
  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1;
  return Math.round(monthlyPrice * multiplier * discountFactor);
}

test('instant thali total increases with quantity', () => {
  assert.equal(instantTotal(80, 1), 80);
  assert.equal(instantTotal(80, 2), 160);
  assert.equal(instantTotal(80, 3), 240);
});

test('subscription total follows selected duration', () => {
  assert.equal(subscriptionTotal(3500, '1 Month'), 3500);
  assert.equal(subscriptionTotal(3500, '3 Months'), 9975);
  assert.equal(subscriptionTotal(3500, '6 Months'), 18900);
});
