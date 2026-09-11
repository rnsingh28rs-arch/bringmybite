import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/components/mobile/SecureCustomerMobileView.tsx', import.meta.url), 'utf8');
const frame = fs.readFileSync(new URL('../src/components/mobile/MobileAppFrame.tsx', import.meta.url), 'utf8');

test('customer mobile home is visually rich and uses the existing food image catalog', () => {
  assert.match(source, /FOOD_IMAGES/);
  assert.match(source, /FOOD_IMAGES\.instantTiffin/);
  assert.match(source, /FOOD_IMAGES\.vegThali/);
  assert.match(source, /FOOD_IMAGES\.eggThali/);
  assert.match(source, /FOOD_IMAGES\.nonVegThali/);
  assert.match(source, /Order Today/);
  assert.match(source, /Monthly Plans/);
});

test('customer mobile primary controls are real touch controls', () => {
  assert.match(source, /<button[\s\S]*onClick=/);
  assert.match(source, /setIsInstantOrderOpen\(true\)/);
  assert.match(source, /setIsRegistrationOpen\(true\)/);
  assert.match(source, /setIsWeeklyMenuOpen\(true\)/);
});

test('mobile customer view is not trapped inside a nested scrolling touch frame', () => {
  assert.doesNotMatch(frame, /<div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative">/);
  assert.match(frame, /<SecureCustomerMobileView\s*\/>/);
});

test('customer mobile renders the existing instant order and subscription modals', () => {
  assert.match(frame, /import \{ InstantOrderModal \} from '\.\.\/customer\/InstantOrderModal';/);
  assert.match(frame, /import \{ RegistrationModal \} from '\.\.\/customer\/RegistrationModal';/);
  assert.match(frame, /<InstantOrderModal\s*\/>/);
  assert.match(frame, /<RegistrationModal\s*\/>/);
});

test('customer mobile keeps live CMS pricing for all three instant thalis', () => {
  assert.match(source, /pricing\.vegThaliInstant/);
  assert.match(source, /pricing\.eggThaliInstant/);
  assert.match(source, /pricing\.nonVegThaliInstant/);
});
