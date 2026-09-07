import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/components/customer/CustomerConversionHome.tsx', import.meta.url), 'utf8');

assert.match(source, /const SPECIAL_NIGHT_BY_PLAN/, 'Customer menu must define package-specific special-night messaging.');
assert.match(source, /Veg Classic: 'Homely Special Night'/);
assert.match(source, /Egg Delight: 'Protein Special Night'/);
assert.match(source, /Non-Veg Club: 'Chicken Special Night'/);
assert.match(source, /todayMenu\.dinner/);
assert.match(source, /Dinner/);
assert.match(source, /Chicken Special Night/);

console.log('package menu tab requirements passed');
