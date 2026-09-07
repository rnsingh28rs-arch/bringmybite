import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const read = (file) => fs.readFileSync(path.join(repoRoot, file), 'utf8');

test('customer UI has no referral reward or subscriber perk UI', () => {
  const app = read('src/App.tsx');
  const lowerFeatures = read('src/components/customer/LowerFeaturesGrid.tsx');

  assert.doesNotMatch(app, /ReferralModal/);
  assert.doesNotMatch(lowerFeatures, /Referral Rewards|Get Your Referral Code|Subscriber Perk|Subscriber Rewards & Referral/i);
  assert.doesNotMatch(lowerFeatures, /setIsReferralModalOpen/);
});
