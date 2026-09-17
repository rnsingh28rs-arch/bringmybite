import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/components/panels/DAdminDesigner.tsx', import.meta.url), 'utf8');

const forbiddenFiveCp = /5\s*[- ]?CP|5-Compartment|Five\s*CP/i;

test('D-Admin menu editor uses the centralized weekly menus while keeping fields editable', () => {
  assert.match(source, /currentPackageMenus/);
  assert.match(source, /CURRENT_VEG_CLASSIC_MENU/);
  assert.match(source, /CURRENT_EGG_DELIGHT_MENU/);
  assert.match(source, /CURRENT_NON_VEG_CLUB_MENU/);
  assert.match(source, /cms\.saveMenu\(pkg, next\)/);
  assert.match(source, /setDraft\(\{\.\.\.draft/);
});

test('D-Admin menu editor hides lunch for dinner-only packages', () => {
  assert.match(source, /dinnerOnly/);
  assert.match(source, /dinnerOnly\s*\?\s*null/);
});

test('D-Admin menu editor contains no Five-CP customer concept', () => {
  assert.doesNotMatch(source, forbiddenFiveCp);
});
