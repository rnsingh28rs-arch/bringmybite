const PLAN_CATALOG = {
  'Lunch Only': [
    { mealPreference: 'Lunch Only', packageType: 'VEG CLASSIC', label: 'Veg Classic Thali', price: 2099 }
  ],
  'Dinner Only': [
    { mealPreference: 'Dinner Only', packageType: 'VEG CLASSIC', label: 'Veg Classic Thali', price: 2099 },
    { mealPreference: 'Dinner Only', packageType: 'EGG DELIGHT', label: 'Egg Delight Thali', price: 2399 },
    { mealPreference: 'Dinner Only', packageType: 'NON-VEG CLUB', label: 'Non-Veg Club Thali', price: 2699 }
  ],
  'Lunch + Dinner': [
    { mealPreference: 'Lunch + Dinner', packageType: 'VEG CLASSIC', label: 'Veg Classic Package', price: 3700 },
    { mealPreference: 'Lunch + Dinner', packageType: 'EGG DELIGHT', label: 'Egg Delight Package', price: 3700 },
    { mealPreference: 'Lunch + Dinner', packageType: 'NON-VEG CLUB', label: 'Non-Veg Club Package', price: 3700 }
  ]
};

export const getSubscriptionPlanOptions = (mealPreference) => PLAN_CATALOG[mealPreference] ? [...PLAN_CATALOG[mealPreference]] : [];

export const getSubscriptionPlan = (mealPreference, packageType) => {
  const plan = getSubscriptionPlanOptions(mealPreference).find((item) => item.packageType === packageType);
  if (!plan) throw new Error(`${packageType} is not available for ${mealPreference}.`);
  return { ...plan };
};

export const subscriptionPlanCatalog = PLAN_CATALOG;
