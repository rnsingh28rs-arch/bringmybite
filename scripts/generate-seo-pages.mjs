import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const pages = [
  ['monthly-meal-subscription', 'Monthly Meal Subscription | Bring My Bite', 'Explore monthly meal subscriptions from Bring My Bite for convenient everyday tiffin meals and a simpler food routine.'],
  ['veg-meal-subscription', 'Veg Meal Subscription | Bring My Bite', 'Discover the Veg Classic monthly meal option from Bring My Bite and make everyday homely meals easier to plan.'],
  ['egg-meal-subscription', 'Egg Meal Subscription | Bring My Bite', 'Discover the Egg Delight monthly meal option from Bring My Bite for convenient everyday tiffin meals.'],
  ['non-veg-meal-subscription', 'Non-Veg Meal Subscription | Bring My Bite', 'Discover the Non-Veg Club monthly meal option from Bring My Bite for convenient everyday meals.'],
  ['instant-thali', 'Instant Thali Order | Bring My Bite', 'Order a one-time Instant Thali from Bring My Bite when you need a convenient homely meal without a monthly commitment.'],
  ['weekly-menu', 'Weekly Menu | Bring My Bite', 'See how the Bring My Bite weekly lunch and dinner menu is organised across Veg, Egg and Non-Veg meal options.'],
  ['how-it-works', 'How It Works | Bring My Bite Tiffin Service', 'Learn how Bring My Bite monthly meal subscriptions, weekly menus and one-time thali ordering work.'],
  ['delivery-areas', 'Delivery & Service Information | Bring My Bite', 'Learn about Bring My Bite delivery to college and office gates and how to check service availability before ordering.'],
  ['contact', 'Contact Bring My Bite | Shree Foods', 'Contact Bring My Bite for meal subscriptions, Instant Thali orders, menu questions and customer support.'],
];

function replaceTag(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

for (const [slug, title, description] of pages) {
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

  const outputDir = path.join(dist, slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

console.log(`Generated ${pages.length} SEO route documents.`);
