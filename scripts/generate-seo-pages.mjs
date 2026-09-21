import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const pages = [
  ['tiffin-service-greater-noida', 'Tiffin Service in Greater Noida West | Bring My Bite', 'Looking for tiffin service in Greater Noida? Bring My Bite is focused on Greater Noida West, including Gaur City, Bisrakh, Techzone IV and nearby residential areas.', 'Tiffin Service for Greater Noida West', 'Bring My Bite is shifting its service-area focus to Greater Noida West, with the kitchen planned around Bisrakh and delivery coverage centred on Gaur City, Techzone IV and nearby societies.'],
  ['tiffin-service-greater-noida-west', 'Tiffin Service in Greater Noida West | Home Food Delivery | Bring My Bite', 'Fresh home-style tiffin, monthly meal subscriptions and one-time thalis in Greater Noida West, including Gaur City, Bisrakh, Techzone IV, Sector 1, Sector 3 and nearby societies.', 'Home Food & Tiffin Service in Greater Noida West', 'Bring My Bite serves the Greater Noida West residential belt around Bisrakh and Noida Extension. Check delivery availability for your society or address before ordering.'],
  ['tiffin-service-gaur-city-1', 'Tiffin Service in Gaur City 1 | Home Food Delivery | Bring My Bite', 'Home-style tiffin and monthly meal delivery for Gaur City 1 and nearby Greater Noida West societies from Bring My Bite.', 'Tiffin Service in Gaur City 1', 'Looking for daily lunch, dinner or monthly tiffin near Gaur City 1? Bring My Bite provides home-style meal options with address-based delivery availability.'],
  ['tiffin-service-gaur-city-2', 'Tiffin Service in Gaur City 2 | Home Food Delivery | Bring My Bite', 'Fresh home-style tiffin, monthly meals and one-time thalis for Gaur City 2 and nearby Greater Noida West areas from Bring My Bite.', 'Tiffin Service in Gaur City 2', 'Bring My Bite offers a convenient home-food option for residents of Gaur City 2 and nearby societies, with monthly plans and one-time meals subject to delivery availability.'],
  ['tiffin-service-bisrakh', 'Tiffin Service in Bisrakh | Greater Noida West | Bring My Bite', 'Bring My Bite is setting up its Greater Noida West kitchen near Bisrakh, serving home-style tiffin and meal plans to nearby residential areas.', 'Tiffin Service in Bisrakh', 'Bisrakh is the operational hub for Bring My Bite\'s Greater Noida West expansion. Residents can check availability for monthly tiffin, lunch, dinner and one-time thalis.'],
  ['tiffin-service-techzone-iv', 'Tiffin Service in Techzone IV | Greater Noida West | Bring My Bite', 'Home food and tiffin delivery in Techzone IV, Greater Noida West, including nearby residential societies and office locations.', 'Tiffin Service in Techzone IV', 'Bring My Bite is targeting Techzone IV as part of its Greater Noida West delivery network, with monthly meal subscriptions and one-time thali ordering.'],
  ['tiffin-service-sector-1-greater-noida-west', 'Tiffin Service in Sector 1 Greater Noida West | Bring My Bite', 'Fresh home-style tiffin and monthly meal delivery for Sector 1, Greater Noida West and nearby residential societies.', 'Tiffin Service in Sector 1, Greater Noida West', 'Bring My Bite is building delivery coverage around Sector 1 and nearby Greater Noida West societies. Confirm your exact address before ordering.'],
  ['tiffin-service-sector-3-greater-noida-west', 'Tiffin Service in Sector 3 Greater Noida West | Bring My Bite', 'Home-style tiffin and meal subscriptions for Sector 3, Greater Noida West, with delivery availability based on your address.', 'Tiffin Service in Sector 3, Greater Noida West', 'Residents of Sector 3 can check Bring My Bite for monthly lunch, dinner and one-time thali options as coverage expands across Greater Noida West.'],
  ['tiffin-service-sector-4-greater-noida-west', 'Tiffin Service in Sector 4 Greater Noida West | Bring My Bite', 'Fresh tiffin and home-style meal delivery for Sector 4, Greater Noida West, including the Gaur City area.', 'Tiffin Service in Sector 4, Greater Noida West', 'Bring My Bite is targeting Sector 4 and the Gaur City belt for home-style lunch, dinner and monthly tiffin plans, subject to address availability.'],
  ['tiffin-service-sector-12-greater-noida-west', 'Tiffin Service in Sector 12 Greater Noida West | Bring My Bite', 'Home-style tiffin and monthly meal delivery for Sector 12 and nearby Greater Noida West residential societies.', 'Tiffin Service in Sector 12, Greater Noida West', 'Bring My Bite is expanding its Greater Noida West coverage toward Sector 12 and nearby societies. Check your address for current delivery availability.'],
  ['tiffin-service-sector-16c-greater-noida-west', 'Tiffin Service in Sector 16C Greater Noida West | Bring My Bite', 'Fresh home-style tiffin and meal subscriptions for Sector 16C and nearby Greater Noida West societies.', 'Tiffin Service in Sector 16C, Greater Noida West', 'Bring My Bite is targeting the Sector 16C and Gaur City 2 residential belt with monthly meal plans and one-time thalis, subject to delivery coverage.'],
  ['tiffin-service-noida-sector-62', 'Tiffin Service Near Sector 62 Noida | Bring My Bite', 'Home-style tiffin and monthly meal delivery near Sector 62, Noida, as Bring My Bite expands from its Greater Noida West kitchen toward nearby Noida areas.', 'Tiffin Service Near Sector 62, Noida', 'Sector 62 is a nearby office and residential demand area. Bring My Bite can target eligible addresses from the Greater Noida West kitchen, with exact delivery availability confirmed by address.'],
  ['tiffin-service-noida-sector-63', 'Tiffin Service Near Sector 63 Noida | Bring My Bite', 'Home-style tiffin and monthly meal delivery near Sector 63, Noida, with service availability checked by address from the Greater Noida West kitchen.', 'Tiffin Service Near Sector 63, Noida', 'Bring My Bite is targeting nearby Noida demand around Sector 63 for office lunch and regular meal delivery, subject to operational delivery coverage.'],
  ['monthly-meal-subscription', 'Monthly Meal Subscription in Greater Noida West | Bring My Bite', 'Monthly lunch and dinner meal subscriptions from Bring My Bite for residents and working professionals in Greater Noida West.', 'Monthly Meal Subscription', 'A practical monthly meal plan for residents, students and working professionals in Greater Noida West who want a dependable everyday tiffin routine.'],
  ['veg-meal-subscription', 'Veg Meal Subscription in Greater Noida West | Bring My Bite', 'Vegetarian monthly tiffin and meal subscription options from Bring My Bite for Greater Noida West.', 'Veg Meal Subscription', 'Choose a vegetarian monthly meal routine designed around familiar home-style food and convenient Greater Noida West delivery.'],
  ['egg-meal-subscription', 'Egg Meal Subscription in Greater Noida West | Bring My Bite', 'Egg-based monthly tiffin and meal subscription options from Bring My Bite for Greater Noida West.', 'Egg Meal Subscription', 'An egg-based monthly meal option for customers in Greater Noida West who want a convenient everyday tiffin routine.'],
  ['non-veg-meal-subscription', 'Non-Veg Meal Subscription in Greater Noida West | Bring My Bite', 'Non-vegetarian monthly tiffin and meal subscription options from Bring My Bite for Greater Noida West.', 'Non-Veg Meal Subscription', 'A non-vegetarian monthly meal option built for a convenient everyday food routine in Greater Noida West.'],
  ['instant-thali', 'Instant Thali in Greater Noida West | Bring My Bite', 'Order a one-time home-style Instant Thali from Bring My Bite in Greater Noida West without a monthly commitment.', 'Instant Thali Order', 'Need a meal today without a monthly plan? Use the existing Instant Thali ordering flow and confirm delivery availability for your address.'],
  ['weekly-menu', 'Weekly Tiffin Menu in Greater Noida West | Bring My Bite', 'See how the Bring My Bite weekly lunch and dinner menu is organised for Greater Noida West customers.', 'Weekly Meal Menu', 'Explore the weekly lunch and dinner menu structure and use the live menu in the main Bring My Bite ordering experience.'],
  ['how-it-works', 'How Bring My Bite Tiffin Service Works in Greater Noida West', 'Learn how Bring My Bite monthly meal subscriptions, weekly menus and one-time thali ordering work in Greater Noida West.', 'How Bring My Bite Works', 'From choosing a meal plan to receiving your food, the experience is designed to keep everyday meals simple for Greater Noida West customers.'],
  ['delivery-areas', 'Bring My Bite Delivery Areas | Greater Noida West & Nearby Noida', 'See Bring My Bite delivery focus across Greater Noida West and nearby Noida areas, including Gaur City, Bisrakh, Techzone IV, Sector 62 and Sector 63.', 'Delivery Areas', 'Our current SEO and operational focus is Greater Noida West, with nearby Noida demand areas considered subject to delivery feasibility and address confirmation.'],
  ['contact', 'Contact Bring My Bite | Greater Noida West Tiffin Service', 'Contact Bring My Bite for monthly meal subscriptions, Instant Thali orders, menu questions, delivery availability and customer support.', 'Contact Bring My Bite', 'Have a question about meals, subscriptions, menus or delivery coverage? Use the existing contact and WhatsApp support options.'],
];

function replaceTag(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function staticSeoBody(heading, intro, url) {
  const bullets = [
    'Home-style lunch and dinner options for customers around this location.',
    'Monthly Veg, Egg and Non-Veg meal options through the existing subscription flow.',
    'One-time Instant Thali ordering where delivery coverage supports the address.',
    'Confirm your exact society, tower, office or residential address before ordering.',
  ];
  return `<main style="max-width:1000px;margin:0 auto;padding:48px 20px;font-family:Arial,sans-serif;color:#1A261E"><p style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8C5E13">Bring My Bite · Greater Noida West</p><h1 style="font-size:42px;line-height:1.12;color:#124E33">${escapeHtml(heading)}</h1><p style="font-size:19px;line-height:1.7;max-width:780px">${escapeHtml(intro)}</p><h2 style="font-size:28px;color:#124E33;margin-top:40px">Home-style meals and tiffin delivery</h2><ul style="line-height:1.8;padding-left:24px">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul><p><a href="/monthly-meal-subscription">Monthly meal subscription</a> · <a href="/instant-thali">Instant Thali</a> · <a href="/weekly-menu">Weekly menu</a> · <a href="/delivery-areas">Delivery areas</a></p><p style="margin-top:30px"><a href="https://wa.me/919315075165">WhatsApp Bring My Bite</a></p></main>`;
}

for (const [slug, title, description, heading, intro] of pages) {
  const url = `https://bringmybite.com/${slug}`;
  let html = template;
  html = replaceTag(html, /<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  html = replaceTag(html, /<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta name="robots" content="[^"]*"\s*\/>/i, '<meta name="robots" content="index,follow,max-image-preview:large" />');
  html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${description}" />`);
  html = html.replace('<div id="root"></div>', `<div id="root">${staticSeoBody(heading, intro, url)}</div>`);

  const outputDir = path.join(dist, slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

const staffRoutes = ['admin', 'manager', 'chef', 'd-admin', 'staff'];
for (const slug of staffRoutes) {
  let html = template;
  html = replaceTag(html, /<meta name="robots" content="[^"]*"\s*\/>/i, '<meta name="robots" content="noindex,nofollow,noarchive" />');
  html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="https://bringmybite.com/${slug}" />`);
  const outputDir = path.join(dist, slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

console.log(`Generated ${pages.length} SEO route documents and ${staffRoutes.length} staff noindex documents.`);
