// scripts/optimize-images.js
// Usage: node scripts/optimize-images.js
// Reads raw photos from scripts/raw-photos/, outputs optimized images to static/images/leaders/
// Produces:
//   {slug}.jpg        — 400×500px headshot (for grid + games), target <80KB
//   {slug}-hero.jpg   — 600×800px hero (for bio pages in Phase 4), target <120KB

import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, basename, extname } from 'path';

const INPUT_DIR = './scripts/raw-photos';
const OUTPUT_DIR = './static/images/leaders';

if (!existsSync(INPUT_DIR)) {
  console.error(`ERROR: Input directory not found: ${INPUT_DIR}`);
  console.error('Download leader photos from:');
  console.error('  https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng');
  console.error('Place raw downloads in scripts/raw-photos/ named by leader slug (e.g. russell-m-nelson.jpg)');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(INPUT_DIR).filter(f => /\.(jpg|jpeg|png|webp|tiff?)$/i.test(f));

if (files.length === 0) {
  console.warn('No image files found in', INPUT_DIR);
  process.exit(0);
}

console.log(`Processing ${files.length} images...`);

for (const file of files) {
  const slug = basename(file, extname(file)).toLowerCase().replace(/\s+/g, '-');
  const inputPath = join(INPUT_DIR, file);

  // Headshot: 400×500px — used in grid and flash card game
  const headshotPath = join(OUTPUT_DIR, `${slug}.jpg`);
  await sharp(inputPath)
    .resize(400, 500, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(headshotPath);

  const headshotKb = Math.round(statSync(headshotPath).size / 1024);
  const warn = headshotKb > 80 ? ' WARNING: OVER 80KB target' : '';

  // Hero: 600×800px — used in bio pages (Phase 4)
  const heroPath = join(OUTPUT_DIR, `${slug}-hero.jpg`);
  await sharp(inputPath)
    .resize(600, 800, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(heroPath);

  const heroKb = Math.round(statSync(heroPath).size / 1024);
  console.log(`  ${slug}: headshot ${headshotKb}KB${warn}, hero ${heroKb}KB`);
}

console.log(`\nDone. Output in ${OUTPUT_DIR}`);
console.log('Verify headshots are under 80KB. If any are over, reduce quality to 75 and re-run.');
