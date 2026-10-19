import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const chef = fs.readFileSync(new URL('../src/components/panels/ChefKitchenPanel.tsx', import.meta.url), 'utf8');
const recipes = fs.readFileSync(new URL('../src/components/panels/InventoryRecipeTools.tsx', import.meta.url), 'utf8');

test('suggested kitchen stock checks convert units and do not compare incompatible units', () => {
  assert.match(chef, /convertRecipeQuantity\(s\.quantity,s\.unit,item\.unit\)/);
  assert.match(chef, /Unit mismatch — cannot compare stock/);
  assert.match(recipes, /convertRecipeQuantity\(s\.quantity,s\.unit,stock\.unit\)/);
  assert.match(recipes, /Unit mismatch — cannot compare stock/);
});

test('recipe ingredient names are normalized and duplicate standards are updated rather than inserted twice', () => {
  assert.match(recipes, /normalizeName\(r\.ingredient_name\)===normalizeName\(ing\)/);
  assert.match(recipes, /supabasePatch\('bmb_recipe_ingredients'/);
  assert.match(recipes, /Existing recipe standard updated/);
});
