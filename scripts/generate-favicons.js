import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Genera un archivo binario .ico multi-resolución a partir de buffers PNG.
 * @param {Array<{width: number, height: number, buffer: Buffer}>} pngBuffers 
 * @returns {Buffer}
 */
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerLength = 6;
  const entryLength = 16;
  let offset = headerLength + (entryLength * count);

  const header = Buffer.alloc(headerLength);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const entries = [];
  const imageBuffers = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(entryLength);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Offset to image data

    entries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBuffers]);
}

async function generate() {
  const svgPath = path.resolve('public/favicon.svg');

  if (!fs.existsSync(svgPath)) {
    console.error('❌ No se encontró el archivo base public/favicon.svg');
    process.exit(1);
  }

  console.log('🎨 Generando suite completa de favicons de alto contraste...');
  const svgBuffer = fs.readFileSync(svgPath);

  const sizes = [16, 32, 48, 96, 180, 192, 512];
  const pngList = [];

  for (const size of sizes) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    if (size === 180) {
      fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), pngBuffer);
      console.log('  ✓ Creado public/apple-touch-icon.png (180x180)');
    } else {
      fs.writeFileSync(path.resolve(`public/favicon-${size}x${size}.png`), pngBuffer);
      console.log(`  ✓ Creado public/favicon-${size}x${size}.png`);
    }

    if ([16, 32, 48].includes(size)) {
      pngList.push({ width: size, height: size, buffer: pngBuffer });
    }
  }

  const icoBuffer = createIco(pngList);
  fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuffer);
  console.log('  ✓ Creado public/favicon.ico multi-resolución (16x16, 32x32, 48x48)');

  console.log('🚀 ¡Todos los favicons generados exitosamente en public/!');
}

generate().catch(err => {
  console.error('❌ Error generando favicons:', err);
  process.exit(1);
});
