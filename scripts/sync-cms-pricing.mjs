import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'src');
const textExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.jsx']);
const skipDirs = new Set(['node_modules', 'dist', '.git']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (textExtensions.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function normalizeFile(file) {
  let source = fs.readFileSync(file, 'utf8');
  const original = source;
  const rel = path.relative(process.cwd(), file).replaceAll('\\', '/');

  source = source.replaceAll('vegMonthly: 3500', 'vegMonthly: 3700');
  source = source.replaceAll('vegThaliInstant: 80', 'vegThaliInstant: 100');
  source = source.replaceAll('eggThaliInstant: 100', 'eggThaliInstant: 120');
  source = source.replaceAll('nonVegThaliInstant: 110', 'nonVegThaliInstant: 150');
  source = source.replaceAll('₹3500', '₹3700');
  source = source.replaceAll('₹3,500', '₹3,700');

  if (rel.endsWith('cmsDefaults.ts')) {
    source = source.replaceAll("thali_rate: '₹100 Instant Single Thali'", "thali_rate: '₹120 Instant Single Thali'");
    source = source.replaceAll("thali_rate: '₹110 Instant Single Thali'", "thali_rate: '₹150 Instant Single Thali'");
    source = source.replaceAll("thali_rate: '₹80 Instant Single Thali'", "thali_rate: '₹100 Instant Single Thali'");
    source = source.replaceAll("highlight_price: 'From ₹80'", "highlight_price: 'From ₹100'");
    source = source.replaceAll("thali_rate: 'Veg: ₹80 | Egg: ₹100 | Non-Veg: ₹110'", "thali_rate: 'Veg: ₹100 | Egg: ₹120 | Non-Veg: ₹150'");
    source = source.replaceAll('Veg Thali (₹80)', 'Veg Thali (₹100)');
    source = source.replaceAll('Egg Thali (₹100)', 'Egg Thali (₹120)');
    source = source.replaceAll('Non-Veg Thali (₹110)', 'Non-Veg Thali (₹150)');
  }

  if (rel.endsWith('MobileAppView.tsx')) {
    source = source.replaceAll('₹110', '₹150');
    source = source.replaceAll('₹100', '₹120');
    source = source.replaceAll('₹80', '₹100');
    source = source.replaceAll('₹3,500', '₹3,700');
    source = source.replaceAll('5CP Tray', 'Thali');
  }

  if (source !== original) {
    fs.writeFileSync(file, source);
    console.log(`pricing sync: ${rel}`);
  }
}

for (const file of walk(root)) normalizeFile(file);
