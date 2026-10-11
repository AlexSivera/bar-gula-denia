// Extrae el logo real de GULA (portada de su carta 2026) en dos capas:
// tinta negra y turquesa. Cada capa es un PNG blanco con alfa, que en CSS
// se usa como mask-image para pintarla del color que toque.
// Uso: node scripts/logo.mjs   (necesita raw/carta-portada.jpg)
import sharp from 'sharp';
import fs from 'node:fs/promises';

const src = 'raw/carta-portada.jpg';
const box = { left: 232, top: 392, width: 606, height: 684 };
const { data, info } = await sharp(src).extract(box).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const n = W * H;
const ink = new Uint8Array(n), teal = new Uint8Array(n);
const clamp = (v) => Math.max(0, Math.min(1, v));

for (let i = 0; i < n; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const t = clamp(((g + b) / 2 - r - 22) / 55);
  teal[i] = Math.round(t * 255);
  ink[i] = Math.round(clamp((165 - lum) / 105) * (1 - t) * 255);
}

function rgba(mask, crop = { left: 0, top: 0, width: W, height: H }) {
  const out = Buffer.alloc(crop.width * crop.height * 4);
  for (let y = 0; y < crop.height; y++) {
    for (let x = 0; x < crop.width; x++) {
      const o = (y * crop.width + x) * 4;
      out[o] = out[o + 1] = out[o + 2] = 255;
      out[o + 3] = mask[(y + crop.top) * W + (x + crop.left)];
    }
  }
  return sharp(out, { raw: { width: crop.width, height: crop.height, channels: 4 } });
}

// Rótulo: solo las letras GULA con sus goteos. Se borran el borde inferior del
// muñeco (arriba) y el trazo con el tenedor (abajo, fuera de la zona de goteos).
const word = { left: 18, top: 318, width: 560, height: 262 };
const inkRotulo = ink.slice(), tealRotulo = teal.slice();
for (const capa of [inkRotulo, tealRotulo]) {
  for (let y = word.top; y < word.top + word.height; y++) {
    for (let x = word.left; x < word.left + word.width; x++) {
      const ry = y - word.top, rx = x - word.left;
      if ((capa === tealRotulo && ry < 34) || (ry > 182 && rx > 150)) capa[y * W + x] = 0;
    }
  }
}
const jobs = [
  [rgba(ink), 'logo-tinta', 560],
  [rgba(teal), 'logo-turquesa', 560],
  [rgba(inkRotulo, word), 'rotulo-tinta', 300],
  [rgba(tealRotulo, word), 'rotulo-turquesa', 300],
];
// PNG en raw/logo (fuente para la imagen social y los iconos) y WebP con alfa para la web
await fs.mkdir('raw/logo', { recursive: true });
for (const [img, name, w] of jobs) {
  const png = await img.resize(w).png({ compressionLevel: 9 }).toBuffer();
  await fs.writeFile(`raw/logo/${name}.png`, png);
  await sharp(png).webp({ quality: 60, alphaQuality: 85, effort: 6 }).toFile(`src/assets/img/${name}.webp`);
}

// Previsualización: sello en tinta + turquesa claro sobre turquesa de marca
const a = await sharp('raw/logo/logo-tinta.png').metadata();
await sharp({ create: { width: a.width, height: a.height, channels: 3, background: '#2B848F' } })
  .composite([
    { input: await sharp('raw/logo/logo-turquesa.png').composite([{ input: { create: { width: a.width, height: a.height, channels: 4, background: '#F5EFE3' } }, blend: 'in' }]).png().toBuffer() },
    { input: await sharp('raw/logo/logo-tinta.png').composite([{ input: { create: { width: a.width, height: a.height, channels: 4, background: '#111517' } }, blend: 'in' }]).png().toBuffer() },
  ])
  .jpeg().toFile('.playwright-mcp/logo-preview.jpg');
console.log('logo ok', a.width, a.height);
