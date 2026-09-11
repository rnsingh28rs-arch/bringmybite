import fs from 'node:fs/promises';
import sharp from 'sharp';

const source = 'public/branding/bmb-logo-source-v2.svg';
const outputs = [
  ['public/branding/bmb-logo-header-v2.png', 128],
  ['public/icons/bmb-logo-32-v2.png', 32],
  ['public/icons/bmb-logo-180-v2.png', 180],
  ['public/icons/bmb-logo-192-v2.png', 192],
  ['public/icons/bmb-logo-512-v2.png', 512],
  ['public/icons/bmb-logo-maskable-512-v2.png', 512]
];

const trimBackground = { r: 255, g: 255, b: 255, alpha: 1 };
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

await fs.access(source);
const base = sharp(source).trim({ background: trimBackground });

for (const [output, size] of outputs) {
  await fs.mkdir(output.substring(0, output.lastIndexOf('/')), { recursive: true });
  await base
    .clone()
    .resize(size, size, { fit: 'contain', background: transparent })
    .png()
    .toFile(output);
}

console.log(`Generated ${outputs.length} Bring My Bite v2 logo assets from ${source}`);
