import assert from 'node:assert/strict';
import test from 'node:test';
import { suggestedIngredientsForThali, calculateRequiredQuantity } from '../src/utils/inventorySuggestions.mjs';

test('suggested ingredients scale from one thali to requested quantity', () => {
  const suggestions = suggestedIngredientsForThali('VEG CLASSIC', 'lunch', 20);
  const rice = suggestions.find(x => x.ingredient.toLowerCase() === 'rice');
  assert.ok(rice);
  assert.equal(rice.quantity, 2.4);
  assert.equal(rice.unit, 'kg');
  assert.equal(rice.suggested, true);
});

test('unknown menu still returns useful generic suggestions instead of an empty recipe error', () => {
  const suggestions = suggestedIngredientsForThali('CUSTOM MENU', 'lunch', 10);
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.every(x => x.suggested === true));
});

test('required quantity reports shortage without changing actual stock', () => {
  const result = calculateRequiredQuantity(1, 'kg', 0.8, 'kg');
  assert.equal(result.required, 1);
  assert.equal(result.available, 0.8);
  assert.equal(result.shortage, 0.2);
  assert.equal(result.sufficient, false);
});

test('unit conversion handles grams and kilograms', () => {
  const result = calculateRequiredQuantity(500, 'grams', 0.8, 'kg');
  assert.equal(result.required, 0.5);
  assert.equal(result.shortage, 0);
  assert.equal(result.sufficient, true);
});
