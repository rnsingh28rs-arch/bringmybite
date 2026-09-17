import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const replacements = [
  [/5CP Pure Veg Platter/g, 'Veg Thali'],
  [/5CP Egg Protein Platter/g, 'Egg Thali'],
  [/5CP Non-Veg Platter/g, 'Non-Veg Thali'],
  [/5CP Leak-proof Tray/g, 'Fresh Meal Thali'],
  [/5CP Trays/g, 'Fresh Meal Service'],
  [/5CP Thali/g, 'Thali'],
  [/5CP/gi, ''],
  [/5-Compartment/gi, 'Meal'],
  [/Five CP/gi, 'Thali']
];

let changed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name))) {
      const before = fs.readFileSync(full, 'utf8');
      let after = before;
      for (const [pattern, replacement] of replacements) after = after.replace(pattern, replacement);
      if (after !== before) {
        fs.writeFileSync(full, after);
        changed += 1;
        console.log(`five-cp cleanup: ${path.relative(process.cwd(), full)}`);
      }
    }
  }
}

walk(root);
console.log(`five-cp cleanup: ${changed} source file(s) updated`);
