import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function writeIfChanged(path, source) { fs.writeFileSync(path, source); console.log(`updated ${path}`); }
function replaceOnce(path, from, to) {
  let source = read(path);
  if (!source.includes(from)) return false;
  writeIfChanged(path, source.replace(from, to));
  return true;
}

// Kept for backwards compatibility with older local build scripts. Pricing is
// now source-controlled in the actual components, so this script performs only
// safe, idempotent migrations and never intentionally changes a valid total.
replaceOnce('src/components/customer/InstantOrderModal.tsx',
  'const totalAmount = unitPrice;',
  'const totalAmount = unitPrice * quantity;');
console.log('Pricing enforcement migration completed.');
