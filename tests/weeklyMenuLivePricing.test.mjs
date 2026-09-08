import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/components/customer/WeeklyMenuModal.tsx', import.meta.url), 'utf8');

test('weekly menu modal reads package prices from live AppContext pricing', () => {
  assert.match(source, /pricing\s*[,}]/, 'WeeklyMenuModal must consume pricing from AppContext.');
  assert.match(source, /pricing\.vegMonthly/);
  assert.match(source, /pricing\.eggMonthly/);
  assert.match(source, /pricing\.nonVegMonthly/);
  assert.doesNotMatch(source, /₹3,500|₹4,000|₹4,500/, 'WeeklyMenuModal must not hardcode subscription prices.');
});
