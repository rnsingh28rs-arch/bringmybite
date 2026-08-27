import fs from 'node:fs';

function patch(path, replacements) {
  let source = fs.readFileSync(path, 'utf8');
  const original = source;
  for (const [from, to] of replacements) {
    if (!source.includes(from)) throw new Error(`Banner pricing patch anchor not found in ${path}`);
    source = source.replace(from, to);
  }
  if (source !== original) fs.writeFileSync(path, source);
}

// Subscription registration: Banner stores the final price. Duration is a service
// selection and must never multiply or discount the configured selling price.
patch('src/components/customer/RegistrationModal.tsx', [[
`  const multiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;\n  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1.0;\n  const calculatedTotal = Math.round(baseMonthlyPrice * multiplier * discountFactor);`,
`  const calculatedTotal = baseMonthlyPrice;`
]]);

// Instant Thali: quantity remains an order selection; it must not change the
// configured/displayed Banner selling price.
patch('src/components/customer/InstantOrderModal.tsx', [[
`  const totalAmount = unitPrice * quantity;`,
`  const totalAmount = unitPrice;`
]]);

// Subscription renewal uses the same fixed Banner-controlled selling price.
patch('src/components/customer/RenewalModal.tsx', [[
`  const multiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;\n  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1.0;\n  const totalRenewalAmount = Math.round(basePrice * multiplier * discountFactor);`,
`  const totalRenewalAmount = basePrice;`
]]);

console.log('Banner pricing enforcement applied: subscription, instant thali, renewal.');
