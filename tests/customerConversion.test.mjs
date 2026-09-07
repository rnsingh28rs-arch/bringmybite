import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/components/customer/CustomerConversionHome.tsx', import.meta.url), 'utf8');

test('customer conversion home exposes two primary buying paths', () => {
  assert.match(source, /Monthly Meal Plan/);
  assert.match(source, /Order Today's Thali/);
});

test('subscription cards show concise decision information and clear CTAs', () => {
  assert.match(source, /13 meals per week/);
  assert.match(source, /Subscribe Now/);
  assert.match(source, /View 7-Day Menu/);
});

test('homepage includes a CMS-driven today menu section and instant ordering section', () => {
  assert.match(source, /Today's Menu/);
  assert.match(source, /Hungry Today/);
  assert.match(source, /setIsInstantOrderOpen/);
  assert.match(source, /setIsWeeklyMenuOpen/);
});

test('homepage provides mobile conversion actions', () => {
  assert.match(source, /sticky/);
  assert.match(source, /View Plans/);
  assert.match(source, /Order Today/);
});
