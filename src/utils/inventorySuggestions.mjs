const BASE_SUGGESTIONS = {
  'VEG CLASSIC': [
    ['Rice', 0.12, 'kg'], ['Dal', 0.06, 'kg'], ['Mixed Vegetables', 0.10, 'kg'],
    ['Gravy / Main Curry', 0.12, 'kg'], ['Cooking Oil', 0.02, 'liters'],
    ['Spices', 0.008, 'kg'], ['Salt', 0.004, 'kg']
  ],
  'EGG DELIGHT': [
    ['Rice', 0.12, 'kg'], ['Dal', 0.06, 'kg'], ['Mixed Vegetables', 0.10, 'kg'],
    ['Eggs', 1, 'pieces'], ['Gravy / Masala', 0.10, 'kg'], ['Cooking Oil', 0.02, 'liters'],
    ['Spices', 0.008, 'kg'], ['Salt', 0.004, 'kg']
  ],
  'NON-VEG CLUB': [
    ['Rice', 0.12, 'kg'], ['Dal', 0.06, 'kg'], ['Seasonal Vegetables', 0.08, 'kg'],
    ['Chicken', 0.12, 'kg'], ['Gravy / Masala', 0.10, 'kg'], ['Cooking Oil', 0.02, 'liters'],
    ['Spices', 0.008, 'kg'], ['Salt', 0.004, 'kg']
  ]
};

export function suggestedIngredientsForThali(menuType, meal = 'lunch', thalis = 1) {
  const count = Math.max(1, Number(thalis) || 1);
  const base = BASE_SUGGESTIONS[menuType] || BASE_SUGGESTIONS['VEG CLASSIC'];
  return base.map(([ingredient, perThali, unit]) => ({
    ingredient,
    perThali,
    quantity: Number((Number(perThali) * count).toFixed(3)),
    unit,
    meal,
    suggested: true
  }));
}

export function convertToBaseUnit(quantity, unit) {
  const q = Number(quantity) || 0;
  const u = String(unit || '').toLowerCase();
  if (u === 'grams' || u === 'g') return q / 1000;
  if (u === 'ml') return q / 1000;
  return q;
}

export function calculateRequiredQuantity(requiredQuantity, requiredUnit, availableQuantity, availableUnit) {
  const required = convertToBaseUnit(requiredQuantity, requiredUnit);
  const available = convertToBaseUnit(availableQuantity, availableUnit);
  const shortage = Math.max(0, Number((required - available).toFixed(3)));
  return { required, available, shortage, sufficient: shortage <= 0 };
}
