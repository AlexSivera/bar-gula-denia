// Genera dist/ a partir de src/: parciales, datos del negocio, precios de la
// carta y bloques generados (carta completa, índice de bocadillos, horario,
// JSON-LD). Sin dependencias.
//
// Sintaxis en las páginas:
//   <!-- meta {"title": "...", "description": "...", "path": "/carta.html"} -->
//   {{> cabecera}}                 parcial de src/partials/
//   {{tel}} {{telE164}} ...        datos de negocio.json (ver `vars`)
//   {{p:pizzas/San Remo}}          precio de un plato («11,50 €»); falla si no existe
//   {{foto:nombre|alt|sizes}}      <img> con srcset de src/assets/img/fotos
//   {{bloque:nombre}}              bloque generado (ver `bloques`)
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'src', DIST = 'dist';
const SITE = 'https://alexsivera.github.io/bar-gula-denia';
const negocio = JSON.parse(await fs.readFile(`${SRC}/data/negocio.json`, 'utf8'));
const carta = JSON.parse(await fs.readFile(`${SRC}/data/carta.json`, 'utf8'));
const fotosDisponibles = new Set(await fs.readdir(`${SRC}/assets/img/fotos`));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const euros = (n) => n.toFixed(2).replace('.', ',') + ' €';
const errores = [];

// ---------- carta ----------
const platosDe = (sec) => (sec.grupos ? sec.grupos.flatMap((g) => g.platos) : sec.platos);
function buscarPlato(ref) {
  const [secId, nombre] = ref.split('/');
  const sec = carta.secciones.find((s) => s.id === secId);
  const plato = sec && platosDe(sec).find((p) => p.nombre === nombre);
  if (!plato) errores.push(`Plato no encontrado en carta.json: ${ref}`);
  return plato;
}
function precio(ref) {
  const p = buscarPlato(ref);
  if (p && typeof p.precio !== 'number') errores.push(`Plato sin precio: ${ref}`);
  return p && typeof p.precio === 'number' ? euros(p.precio) : '';
}

// ---------- fotos ----------
function foto(nombre, alt, sizes = '(min-width: 900px) 40vw, 80vw', extra = '') {
  const anchos = [400, 720, 1080].filter((w) => fotosDisponibles.has(`${nombre}-${w}.webp`));
  if (!anchos.length) { errores.push(`Foto inexistente: ${nombre}`); return ''; }
  const srcset = anchos.map((w) => `assets/img/fotos/${nombre}-${w}.webp ${w}w`).join(', ');
  const media = anchos.includes(720) ? 720 : anchos.at(-1);
  const carga = /eager/.test(extra) ? '' : ' loading="lazy" decoding="async"';
  return `<img src="assets/img/fotos/${nombre}-${media}.webp" srcset="${srcset}" sizes="${sizes}" width="${media}" height="${media}" alt="${esc(alt)}"${carga}${extra ? ' ' + extra.replace('eager', 'fetchpriority="high"') : ''}>`;
}

// ---------- horario ----------
const DIAS = [['lunes', 'Lunes'], ['martes', 'Martes'], ['miercoles', 'Miércoles'], ['jueves', 'Jueves'], ['viernes', 'Viernes'], ['sabado', 'Sábado'], ['domingo', 'Domingo']];
const hora = (h) => h.replace(/^0/, '');
function tablaHorario() {
  const filas = DIAS.map(([k, nombre], i) => {
    const h = negocio.horario[k];
    return `<tr data-dia="${(i + 1) % 7}"><th scope="row">${nombre}</th><td>${h ? `${hora(h[0])}–${hora(h[1])}` : 'Cerrado'}</td></tr>`;
  }).join('\n          ');
  return `<table class="horario">
        <caption class="sr">Horario de apertura</caption>
        <tbody>
          ${filas}
        </tbody>
      </table>`;
}

// ---------- bloques generados ----------
const FOTO_SECCION = {
  entrantes: ['huevos-rotos', 'Huevos rotos con jamón serrano y pimiento frito, en la cazuelita negra de Gula'],
  ensaladas: ['ensalada-cesar', 'Ensalada César de Gula con pollo crujiente, picatostes y salsa'],
  pastas: ['pasta-del-mar', 'Pasta del mar de Gula: tagliatelle con mejillones y gambas'],
  pizzas: ['pizza-san-remo', 'Pizza San Remo de Gula con jamón serrano, rúcula, tomate cherry y grana padano'],
  hamburguesas: ['burger-iberica', 'Hamburguesa Ibérica de Gula con jamón ibérico y patatas'],
  bocadillos: ['bocadillo-pollo', 'Bocadillo de Gula con pollo, bacón y huevo frito sobre tabla de madera'],
  combinados: ['costilla', 'Costilla a la barbacoa de Gula con patatas y verdura a la plancha'],
  ninos: ['burger-granito', 'Hamburguesa con patatas de Gula sobre tabla de madera'],
};
const AVISOS = {
  pizzas: 'Bebida de 33 cl incluida',
  hamburguesas: 'Patatas y bebida incluidas',
};

function filaPlato(p) {
  const pr = typeof p.precio === 'number' ? `<span class="plato__precio">${euros(p.precio)}</span>` : '';
  return `<li class="plato">
            <div class="plato__linea"><span class="plato__nombre">${esc(p.nombre)}</span>${pr}</div>${p.desc ? `\n            <p class="plato__desc">${esc(p.desc)}</p>` : ''}
          </li>`;
}

function cartaCompleta() {
  return carta.secciones.map((s) => {
    const f = FOTO_SECCION[s.id];
    const listas = (s.grupos || [{ platos: s.platos }]).map((g) => `${g.titulo ? `<h3 class="carta-grupo">${esc(g.titulo)}</h3>` : ''}
        <ul class="carta-lista">
          ${g.platos.map(filaPlato).join('\n          ')}
        </ul>`).join('\n        ');
    return `<section class="carta-sec" id="${s.id}" aria-labelledby="t-${s.id}">
      <header class="carta-sec__cab">
        ${f ? `<div class="carta-sec__foto">${foto(f[0], f[1], '(min-width: 900px) 220px, 34vw')}</div>` : ''}
        <div>
          <h2 class="carta-sec__titulo" id="t-${s.id}">${esc(s.titulo)}</h2>
          ${s.nota ? `<p class="carta-sec__nota">${esc(s.nota)}</p>` : ''}
          ${AVISOS[s.id] ? `<p class="pegatina pegatina--linea">${AVISOS[s.id]}</p>` : ''}
        </div>
      </header>
      <div class="carta-sec__cuerpo">
        ${listas}
      </div>
    </section>`;
  }).join('\n\n    ');
}

function navCarta() {
  return carta.secciones.map((s) => `<li><a href="#${s.id}">${esc(s.titulo)}</a></li>`).join('\n          ');
}

function indiceBocadillos() {
  const sec = carta.secciones.find((s) => s.id === 'bocadillos');
  return platosDe(sec).map((p, i) => `<li class="bocata">
            <span class="bocata__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="bocata__nombre">${esc(p.nombre)}</h3>
            <p class="bocata__desc">${esc(p.desc)}</p>
            <p class="bocata__precio">${euros(p.precio)}</p>
          </li>`).join('\n          ');
}

function jsonLd() {
  const h = negocio.horario;
  const map = { lunes: 'Monday', martes: 'Tuesday', miercoles: 'Wednesday', jueves: 'Thursday', viernes: 'Friday', sabado: 'Saturday', domingo: 'Sunday' };
  const horas = Object.entries(h).filter(([, v]) => v).map(([k, [a, b]]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: map[k], opens: a, closes: b }));
  const d = negocio.direccion;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: negocio.nombre,
    url: SITE + '/',
    image: SITE + '/assets/img/og-gula.jpg',
    logo: SITE + '/assets/img/apple-touch-icon.png',
    telephone: negocio.telefono.e164,
    address: { '@type': 'PostalAddress', streetAddress: d.calle, addressLocality: d.localidad, postalCode: d.cp, addressRegion: d.provincia, addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: negocio.geo.lat, longitude: negocio.geo.lng },
    hasMap: negocio.enlaces.maps,
    openingHoursSpecification: horas,
    servesCuisine: ['Pizza', 'Hamburguesas', 'Bocadillos', 'Cocina española'],
    hasMenu: SITE + '/carta.html',
    acceptsReservations: true,
    sameAs: [negocio.enlaces.instagram, negocio.enlaces.facebook],
  }, null, 2);
}

const bloques = {
  carta: cartaCompleta,
  'nav-carta': navCarta,
  bocadillos: indiceBocadillos,
  horario: tablaHorario,
  jsonld: jsonLd,
  'horario-json': () => esc(JSON.stringify(negocio.horario)),
};

const vars = {
  tel: negocio.telefono.visible.replace(/ /g, ' '),
  telE164: negocio.telefono.e164,
  calle: negocio.direccion.calle,
  cp: negocio.direccion.cp,
  localidad: negocio.direccion.localidad,
  comoLlegar: esc(negocio.enlaces.comoLlegar),
  mapsUrl: esc(negocio.enlaces.maps),
  mapaEmbed: esc(negocio.enlaces.embed),
  resenas: esc(negocio.enlaces.resenas),
  instagram: esc(negocio.enlaces.instagram),
  facebook: esc(negocio.enlaces.facebook),
  glovo: esc(negocio.enlaces.glovo),
  justEat: esc(negocio.enlaces.justEat),
  nota: negocio.valoracion.nota,
  numResenas: String(negocio.valoracion.resenas),
  site: SITE,
  anio: String(new Date().getFullYear()),
};

// ---------- render ----------
const parciales = {};
for (const f of await fs.readdir(`${SRC}/partials`)) parciales[path.basename(f, '.html')] = await fs.readFile(`${SRC}/partials/${f}`, 'utf8');

function render(html, meta, archivo) {
  let out = html;
  for (let i = 0; i < 3; i++) out = out.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => parciales[n] ?? (errores.push(`Parcial inexistente: ${n}`), ''));
  out = out.replace(/\{\{meta:(\w+)\}\}/g, (_, k) => esc(meta[k] ?? ''));
  out = out.replace(/\{\{p:([^}]+)\}\}/g, (_, ref) => precio(ref.trim()));
  out = out.replace(/\{\{foto:([^}]+)\}\}/g, (_, a) => { const [n, alt, sizes, extra] = a.split('|'); return foto(n.trim(), alt.trim(), sizes?.trim() || undefined, extra?.trim() || ''); });
  out = out.replace(/\{\{bloque:([\w-]+)\}\}/g, (_, n) => (bloques[n] ? bloques[n]() : (errores.push(`Bloque inexistente: ${n}`), '')));
  out = out.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : (errores.push(`Variable sin resolver en ${archivo}: ${k}`), '')));
  const resto = out.match(/\{\{[^}]*\}\}/g);
  if (resto) errores.push(`Marcas sin resolver en ${archivo}: ${resto.join(', ')}`);
  return out;
}

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });
await fs.cp(`${SRC}/assets`, `${DIST}/assets`, { recursive: true });

const paginas = (await fs.readdir(`${SRC}/pages`)).filter((f) => f.endsWith('.html'));
for (const f of paginas) {
  const raw = await fs.readFile(`${SRC}/pages/${f}`, 'utf8');
  const m = raw.match(/^<!--\s*meta\s*(\{[\s\S]*?\})\s*-->\s*/);
  const meta = m ? JSON.parse(m[1]) : {};
  meta.canonical = SITE + (meta.path ?? '/' + f);
  // Sin espacios al final de línea ni saltos de línea triples
  const html = render(raw.slice(m ? m[0].length : 0), meta, f).replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');
  await fs.writeFile(`${DIST}/${f}`, html);
}

const indexables = ['/', '/carta.html', '/legal.html'];
await fs.writeFile(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexables.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n')}
</urlset>
`);
await fs.writeFile(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await fs.writeFile(`${DIST}/.nojekyll`, '');

if (errores.length) {
  console.error('Build con errores:\n- ' + [...new Set(errores)].join('\n- '));
  process.exit(1);
}
console.log(`Build OK · ${paginas.length} páginas · ${carta.secciones.length} secciones de carta`);
