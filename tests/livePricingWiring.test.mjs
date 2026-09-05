import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('AppContext exposes central CMS pricing instead of banner row prices', () => {
  const source = read('src/context/AppContext.tsx');
  assert.match(source, /const pricing:PlanPricing=\{[^}]*vegMonthly:cms\.pricing\.vegMonthly/);
  assert.doesNotMatch(source, /const vegBanner=cms\.banners\.find/);
});

test('customer price displays are wired to central CMS pricing', () => {
  const hero = read('src/components/customer/HeroBanner.tsx');
  const packages = read('src/components/customer/PackagesSection.tsx');
  const registration = read('src/components/customer/RegistrationModal.tsx');
  const instant = read('src/components/customer/InstantOrderModal.tsx');
  const renewal = read('src/components/customer/RenewalModal.tsx');

  assert.match(hero, /pricing\.vegThaliInstant/);
  assert.doesNotMatch(hero, /Veg Thali \(₹80\)|Egg Thali \(₹100\)|Non-Veg Thali \(₹110\)/);
  assert.match(packages, /pricing\.vegMonthly/);
  assert.match(registration, /pricing\.vegMonthly/);
  assert.doesNotMatch(registration, /selectedBanner.*highlight_price/);
  assert.match(instant, /pricing\.vegThaliInstant/);
  assert.doesNotMatch(instant, /configuredRateText.*banners\.find/);
  assert.match(renewal, /pricing\.vegMonthly/);
  assert.doesNotMatch(renewal, /configuredPriceText.*banners\.find/);
});
