import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/components/mobile/SecureCustomerMobileView.tsx', import.meta.url), 'utf8');

test('customer mobile home is visually rich and uses the existing food image catalog', () => {
  assert.match(source, /FOOD_IMAGES/);
  assert.match(source, /FOOD_IMAGES\.instantTiffin/);
  assert.match(source, /FOOD_IMAGES\.vegThali/);
  assert.match(source, /FOOD_IMAGES\.eggThali/);
  assert.match(source, /FOOD_IMAGES\.nonVegThali/);
  assert.match(source, /Order Today's Thali/);
  assert.match(source, /Monthly Plans/);
});

test('customer mobile keeps all customer-facing navigation areas', () => {
  assert.match(source, /\['home', 'Home', User\]/);
  assert.match(source, /\['menu', 'Menu', Utensils\]/);
  assert.match(source, /\['instant', 'Instant', Zap\]/);
  assert.match(source, /\['profile', 'Profile', QrCode\]/);
});

test('customer mobile keeps live CMS pricing for all three instant thalis', () => {
  assert.match(source, /pricing\.vegThaliInstant/);
  assert.match(source, /pricing\.eggThaliInstant/);
  assert.match(source, /pricing\.nonVegThaliInstant/);
  assert.match(source, /Live Central Pricing/);
});
