import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages() {
  const targetDir = path.resolve('public');

  if (!fs.existsSync(targetDir)) {
    console.log('Directory does not exist:', targetDir);
    return;
  }

  const files = fs.readdirSync(targetDir);
  const imageExtensions = /\.(png|jpg|jpeg)$/i;
  const images = files.filter(f => imageExtensions.test(f) && !f.endsWith('.webp'));

  if (images.length === 0) {
    console.log('No raw PNG/JPG images to optimize in public/.');
    return;
  }

  console.log(`Found ${images.length} image(s) to optimize...`);

  for (const file of images) {
    const filePath = path.join(targetDir, file);
    const baseName = path.basename(file, path.extname(file));
    const destPath = path.join(targetDir, `${baseName}.webp`);

    const inputBuffer = fs.readFileSync(filePath);
    const beforeSize = inputBuffer.length;

    try {
      const outputBuffer = await sharp(inputBuffer)
        .webp({ quality: 80, effort: 6 })
        .toBuffer();

      fs.writeFileSync(destPath, outputBuffer);
      const afterSize = outputBuffer.length;

      console.log(`Optimized ${file} -> ${baseName}.webp (${(beforeSize/1024).toFixed(1)} KB -> ${(afterSize/1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err.message);
    }
  }
}

optimizeImages();
