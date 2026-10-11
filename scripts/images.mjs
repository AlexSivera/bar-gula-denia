// Prepara las fotos reales de Gula para la web.
// Fuentes en raw/ (no se publican): fotos subidas por el restaurante a Glovo,
// Google Maps e Instagram. Salida: src/assets/img/fotos/<nombre>-<ancho>.webp
// Uso: npm run images
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = 'src/assets/img/fotos';
const SIZES = [160, 400, 720, 1080];

// nombre → { src, foco, zoom } · foco = punto (0–1) hacia el que se desplaza el recorte cuadrado;
// zoom > 1 cierra el encuadre cuando el plato sale pequeño en la foto
const FOTOS = {
  'burger-cabra':      { src: 'g33-hamburguesa-cabra-burger.jpg', foco: [0.5, 0.55] },
  'burger-pulled':     { src: 'g34-hamburguesa-pulled-pork.jpg', foco: [0.5, 0.5] },
  'burger-iberica':    { src: 'g32-hamburguesa-iberica.jpg', foco: [0.45, 0.5] },
  'burger-granito':    { src: 'burger-granito-maps.jpg', foco: [0.62, 0.55] },
  'bocadillo-pollo':   { src: 'g29-bocadillo-de-pollo.jpg', foco: [0.45, 0.5] },
  'bocadillo-calamar': { src: 'g27-bocadillo-de-calamar.jpg', foco: [0.5, 0.5] },
  'huevos-rotos':      { src: 'huevos-rotos-maps.png', foco: [0.5, 0.45] },
  'bocadillos-tabla':  { src: 'ig-bocadillos-2022.jpg', foco: [0.5, 0.5] },
  'calamares':         { src: 'g14-calamar-a-la-romana.jpg', foco: [0.5, 0.5] },
  'albondigas':        { src: 'g17-albondigas-en-salsa-de-tomate.jpg', foco: [0.5, 0.5] },
  'bravas':            { src: 'g23-patatas-bravas.jpg', foco: [0.5, 0.4] },
  'alitas':            { src: 'g15-alitas-de-pollo-al-grill.jpg', foco: [0.5, 0.5] },
  'sepia':             { src: 'g08-sepia-plancha-con-salsa-verde.jpg', foco: [0.5, 0.5] },
  'pizza-san-remo':    { src: 'g02-pizza-san-remo-33-cm.jpg', foco: [0.4, 0.5] },
  'pizza-pulled':      { src: 'g50-pizza-pulled-pork-33-cm.jpg', foco: [0.5, 0.5] },
  'costilla':          { src: 'g59-costillas-a-la-bbq.jpg', foco: [0.5, 0.5] },
  'pollo-curry':       { src: 'g63-pollo-al-curry.jpg', foco: [0.5, 0.5] },
  'pasta-del-mar':     { src: 'pasta-del-mar-maps.jpg', foco: [0.5, 0.5] },
  'calzone':           { src: 'g43-pizza-calzonne-gula-33-cm.jpg', foco: [0.5, 0.5] },
  'pasta-cremosa':     { src: 'g40-pasta-cremosa.jpg', foco: [0.5, 0.5] },
  'pizza-cheesey':     { src: 'g46-pizza-cheesey-33-cm.jpg', foco: [0.5, 0.5] },
  'alcachofitas':      { src: 'g09-alcachofitas-crujientes-con-foie.jpg', foco: [0.52, 0.5], zoom: 1.7 },
  'burger-supreme':    { src: 'g36-hamburguesa-supreme.jpg', foco: [0.5, 0.5] },
  'ensalada-cesar':    { src: 'g05-ensalada-cesar.jpg', foco: [0.5, 0.5] },
};

await fs.mkdir(OUT, { recursive: true });

async function cuadrado(file, [fx, fy], zoom = 1) {
  // Quita el marco blanco que añade Glovo y recorta un cuadrado hacia el foco
  const buf = await sharp(path.join('raw', file)).rotate().flatten({ background: '#ffffff' })
    .trim({ background: '#ffffff', threshold: 18 }).toBuffer();
  const { width: w, height: h } = await sharp(buf).metadata();
  const s = Math.round(Math.min(w, h) / zoom);
  const left = Math.round(Math.max(0, Math.min(w - s, fx * w - s / 2)));
  const top = Math.round(Math.max(0, Math.min(h - s, fy * h - s / 2)));
  return { img: sharp(buf).extract({ left, top, width: s, height: s }), lado: s };
}

const informe = [];
for (const [nombre, { src, foco, zoom }] of Object.entries(FOTOS)) {
  const { img, lado } = await cuadrado(src, foco, zoom);
  const base = await img.sharpen({ sigma: 0.6 }).toBuffer();
  for (const w of SIZES) {
    if (w > lado * 1.15 && w > 400) continue; // no ampliar fotos pequeñas
    await sharp(base).resize(w, w).webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${nombre}-${w}.webp`);
  }
  informe.push(`${nombre}: ${lado}px`);
}
console.log(informe.join('\n'));

// Imagen para redes (1200×630): marea turquesa, sello del logo y la hamburguesa en círculo
const marea = '#1F737B';
const pintar = async (file, color, w) => {
  const m = await sharp(file).resize(w).toBuffer();
  const { width, height } = await sharp(m).metadata();
  return sharp(m).composite([{ input: { create: { width, height, channels: 4, background: color } }, blend: 'in' }]).png().toBuffer();
};
const circ = Buffer.from('<svg width="560" height="560"><circle cx="280" cy="280" r="280"/></svg>');
const burger = await sharp(`${OUT}/burger-cabra-720.webp`).resize(560, 560).composite([{ input: circ, blend: 'dest-in' }]).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: marea } })
  .composite([
    { input: await pintar('raw/logo/logo-turquesa.png', '#F6F3EC', 440), left: 80, top: 66 },
    { input: await pintar('raw/logo/logo-tinta.png', '#111517', 440), left: 80, top: 66 },
    { input: burger, left: 580, top: 35 },
  ])
  .jpeg({ quality: 82, mozjpeg: true }).toFile('src/assets/img/og-gula.jpg');

// Iconos: el sello sobre leche
for (const [size, file] of [[180, 'apple-touch-icon.png'], [48, 'favicon-48.png']]) {
  const inner = Math.round(size * 0.86);
  const t = await pintar('raw/logo/logo-turquesa.png', '#2B848F', inner);
  const k = await pintar('raw/logo/logo-tinta.png', '#111517', inner);
  const { height } = await sharp(t).metadata();
  const top = Math.max(0, Math.round((size - height) / 2));
  await sharp({ create: { width: size, height: Math.max(size, height), channels: 4, background: '#F6F3EC' } })
    .composite([{ input: t, left: Math.round((size - inner) / 2), top }, { input: k, left: Math.round((size - inner) / 2), top }])
    .resize(size, size, { fit: 'cover', position: 'top' }).png().toFile(`src/assets/img/${file}`);
}
console.log('og + iconos ok');
