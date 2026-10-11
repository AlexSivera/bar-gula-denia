// Comprueba dist/: enlaces internos, anclas, recursos (img, srcset, css, js, fuentes),
// tel: correctos, ids duplicados, un solo h1 y alt en todas las imágenes.
import fs from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const paginas = (await fs.readdir(DIST)).filter((f) => f.endsWith('.html'));
const ids = {};
const htmls = {};
for (const p of paginas) {
  htmls[p] = await fs.readFile(path.join(DIST, p), 'utf8');
  ids[p] = [...htmls[p].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
}
const errores = [];
const existe = async (f) => fs.access(f).then(() => true, () => false);

for (const p of paginas) {
  const html = htmls[p];
  const dup = ids[p].filter((id, i) => ids[p].indexOf(id) !== i);
  if (dup.length) errores.push(`${p}: ids duplicados ${[...new Set(dup)]}`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errores.push(`${p}: ${h1} h1`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) errores.push(`${p}: img sin alt ${m[0].slice(0, 80)}`);
  for (const m of html.matchAll(/href="tel:([^"]+)"/g)) if (m[1] !== '+34865833527') errores.push(`${p}: teléfono raro ${m[1]}`);

  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0])),
  ];
  for (const r of refs) {
    if (/^(https?:|tel:|mailto:|data:)/.test(r)) continue;
    let [ruta, ancla] = r.split('#');
    if (p === '404.html') ruta = ruta.replace(/^\/bar-gula-denia\//, '');
    const destino = ruta === '' ? p : ruta === './' ? 'index.html' : ruta.replace(/^\.\//, '');
    if (!(await existe(path.join(DIST, destino)))) { errores.push(`${p}: recurso inexistente ${r}`); continue; }
    if (ancla && destino.endsWith('.html') && !(ids[destino] || []).includes(ancla)) errores.push(`${p}: ancla inexistente ${r}`);
  }
}
const css = await fs.readFile(path.join(DIST, 'assets/css/gula.css'), 'utf8');
for (const m of css.matchAll(/url\("?([^")]+)"?\)/g)) {
  if (!(await existe(path.join(DIST, 'assets/css', m[1])))) errores.push(`gula.css: recurso inexistente ${m[1]}`);
}
if (errores.length) { console.error('Comprobación con errores:\n- ' + errores.join('\n- ')); process.exit(1); }
console.log(`Comprobación OK · ${paginas.length} páginas sin enlaces rotos ni recursos ausentes`);
