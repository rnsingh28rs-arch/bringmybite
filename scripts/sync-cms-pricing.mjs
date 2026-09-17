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

  // Only normalize values that are unambiguously legacy. Do not perform
  // chained generic ₹100 replacements because ₹100 is the current Veg price.
  source = source.replaceAll('vegMonthly: 3500', 'vegMonthly: 3700');
  source = source.replaceAll('vegThaliInstant: 80', 'vegThaliInstant: 100');
  source = source.replaceAll('eggThaliInstant: 100', 'eggThaliInstant: 120');
  source = source.replaceAll('nonVegThaliInstant: 110', 'nonVegThaliInstant: 150');
  source = source.replaceAll('₹3500', '₹3700');
  source = source.replaceAll('₹3,500', '₹3,700');
  source = source.replaceAll('₹80', '₹100');

  if (source !== original) {
    fs.writeFileSync(file, source);
    console.log(`pricing sync: ${rel}`);
  }
}

for (const file of walk(root)) normalizeFile(file);
