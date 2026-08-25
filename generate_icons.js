import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_IMAGE = path.join(process.cwd(), 'src/assets/images/bmb_circle_app_icon_1786814588840.jpg');

const androidMipmaps = [
  { dir: 'android/app/src/main/res/mipmap-mdpi', size: 48 },
  { dir: 'android/app/src/main/res/mipmap-hdpi', size: 72 },
  { dir: 'android/app/src/main/res/mipmap-xhdpi', size: 96 },
  { dir: 'android/app/src/main/res/mipmap-xxhdpi', size: 144 },
  { dir: 'android/app/src/main/res/mipmap-xxxhdpi', size: 192 },
];

const webIcons = [
  { file: 'public/icons/icon-192.png', size: 192 },
  { file: 'public/icons/icon-512.png', size: 512 },
  { file: 'public/icons/icon-maskable-512.png', size: 512 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'public/favicon.png', size: 64 },
];

async function run() {
  console.log('Generating Android Mipmap & Circular Web Icons...');

  for (const m of androidMipmaps) {
    fs.mkdirSync(m.dir, { recursive: true });
    
    // Standard icon (Squircle / Rounded Box)
    await sharp(SOURCE_IMAGE)
      .resize(m.size, m.size, { fit: 'cover' })
      .png()
      .toFile(path.join(m.dir, 'ic_launcher.png'));

    // True Circular Icon (Like Zomato / Swiggy)
    const circleBuffer = Buffer.from(
      `<svg><circle cx="${m.size / 2}" cy="${m.size / 2}" r="${m.size / 2}" fill="#fff" /></svg>`
    );
    await sharp(SOURCE_IMAGE)
      .resize(m.size, m.size, { fit: 'cover' })
      .composite([{
        input: circleBuffer,
        blend: 'dest-in'
      }])
      .png()
      .toFile(path.join(m.dir, 'ic_launcher_round.png'));

    // Foreground icon for adaptive icon
    await sharp(SOURCE_IMAGE)
      .resize(m.size, m.size, { fit: 'cover' })
      .png()
      .toFile(path.join(m.dir, 'ic_launcher_foreground.png'));
  }

  for (const w of webIcons) {
    fs.mkdirSync(path.dirname(w.file), { recursive: true });
    await sharp(SOURCE_IMAGE)
      .resize(w.size, w.size, { fit: 'cover' })
      .png()
      .toFile(w.file);
  }

  console.log('Successfully generated all Bring My Bite circular icons!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

