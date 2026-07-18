import sharp from 'sharp';
import { readFileSync, statSync, globSync } from 'fs';

const DIRS = ['src/assets'];

const SUPPORTED = /\.(jpe?g|png)$/i;

async function optimize() {
  const files = globSync(`${DIRS[0]}/**/*.{jpg,jpeg,png,JPEG,JPG,PNG}`);

  console.log(`Found ${files.length} images\n`);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const input = readFileSync(file);
    const before = input.length;

    // Overwrite original with compressed version
    if (/\.png$/i.test(file)) {
      await sharp(input)
        .png({ quality: 80, palette: true, compressionLevel: 9 })
        .toFile(file);
    } else {
      await sharp(input)
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(file);
    }

    const after = statSync(file).size;
    const saved = before - after;
    totalBefore += before;
    totalAfter += after;

    const pct = before > 0 ? ((saved / before) * 100).toFixed(1) : '0';
    console.log(`${(before / 1024).toFixed(0).padStart(6)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB  (${pct}%)  ${file.replace(/^.*[\\/]/, '')}`);
  }

  const totalMbBefore = (totalBefore / 1024 / 1024).toFixed(1);
  const totalMbAfter = (totalAfter / 1024 / 1024).toFixed(1);
  const totalPct = totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : '0';
  console.log(`\nTotal: ${totalMbBefore} MB → ${totalMbAfter} MB  (${totalPct}% reduction)`);
  console.log(`Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB`);
}

optimize().catch(console.error);
