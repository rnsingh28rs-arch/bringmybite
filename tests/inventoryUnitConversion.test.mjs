import test from 'node:test';
import assert from 'node:assert/strict';
import { convertRecipeQuantity, normalizeInventoryUnit } from '../src/utils/inventoryUnits.mjs';

test('normalizes aliases before comparing recipe and stock units', () => {
  assert.equal(normalizeInventoryUnit(' Kilograms '), 'kg');
  assert.equal(normalizeInventoryUnit('PCS'), 'pieces');
  assert.equal(convertRecipeQuantity(2, 'kilograms', 'kg'), 2);
  assert.equal(convertRecipeQuantity(4, 'pcs', 'pieces'), 4);
});

test('converts mass and volume without confusing incompatible units', () => {
  assert.equal(convertRecipeQuantity(500, 'g', 'kg'), 0.5);
  assert.equal(convertRecipeQuantity(1.25, 'kg', 'grams'), 1250);
  assert.equal(convertRecipeQuantity(750, 'ml', 'liters'), 0.75);
  assert.equal(convertRecipeQuantity(2, 'litres', 'ml'), 2000);
  assert.equal(convertRecipeQuantity(1, 'packets', 'kg'), null);
  assert.equal(convertRecipeQuantity(1, 'pieces', 'packets'), null);
});

test('rejects invalid quantities and missing units', () => {
  assert.equal(convertRecipeQuantity(-1, 'kg', 'grams'), null);
  assert.equal(convertRecipeQuantity(Number.NaN, 'kg', 'grams'), null);
  assert.equal(convertRecipeQuantity(1, '', 'kg'), null);
});
