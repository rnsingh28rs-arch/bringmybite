const aliases = new Map([
  ['kg', 'kg'], ['kilogram', 'kg'], ['kilograms', 'kg'],
  ['g', 'grams'], ['gram', 'grams'], ['grams', 'grams'],
  ['l', 'liters'], ['liter', 'liters'], ['liters', 'liters'], ['litre', 'liters'], ['litres', 'liters'],
  ['ml', 'ml'], ['milliliter', 'ml'], ['milliliters', 'ml'], ['millilitre', 'ml'], ['millilitres', 'ml'],
  ['piece', 'pieces'], ['pieces', 'pieces'], ['pc', 'pieces'], ['pcs', 'pieces'],
  ['packet', 'packets'], ['packets', 'packets'], ['pack', 'packets'], ['packs', 'packets'],
  ['box', 'boxes'], ['boxes', 'boxes']
]);

export function normalizeInventoryUnit(unit) {
  const normalized = String(unit ?? '').trim().toLowerCase().replace(/\\s+/g, ' ');
  return aliases.get(normalized) ?? normalized;
}

export function convertRecipeQuantity(quantity, fromUnit, toUnit) {
  const value = Number(quantity);
  if (!Number.isFinite(value) || value < 0) return null;
  const from = normalizeInventoryUnit(fromUnit);
  const to = normalizeInventoryUnit(toUnit);
  if (!from || !to) return null;
  if (from === to) return value;
  if (from === 'grams' && to === 'kg') return value / 1000;
  if (from === 'kg' && to === 'grams') return value * 1000;
  if (from === 'ml' && to === 'liters') return value / 1000;
  if (from === 'liters' && to === 'ml') return value * 1000;
  return null;
}
