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
const ANCHOS = [160, 400, 720, 1080];
function srcsetDe(nombre) {
  const anchos = ANCHOS.filter((w) => fotosDisponibles.has(`${nombre}-${w}.webp`));
  if (!anchos.length) errores.push(`Foto inexistente: ${nombre}`);
  return { anchos, srcset: anchos.map((w) => `assets/img/fotos/${nombre}-${w}.webp ${w}w`).join(', ') };
}
function foto(nombre, alt, sizes = '(min-width: 900px) 40vw, 80vw', extra = '') {
  const { anchos, srcset } = srcsetDe(nombre);
  if (!anchos.length) return '';
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
// Foto del plato grande de cada sección (y el plato al que corresponde, para su pie)
const FOTO_SECCION = {
  entrantes: ['huevos-rotos', 'entrantes/Huevos rotos con jamón serrano'],
  ensaladas: ['ensalada-cesar', 'ensaladas/César'],
  pastas: ['pasta-del-mar', 'pastas/Del mar'],
  pizzas: ['pizza-san-remo', 'pizzas/San Remo'],
  hamburguesas: ['burger-iberica', 'hamburguesas/Ibérica'],
  bocadillos: ['bocadillo-calamar', 'bocadillos/Calamar a la romana'],
  combinados: ['costilla', 'combinados/Costilla a la barbacoa'],
  ninos: ['burger-granito', 'ninos/Hamburguesa infantil con patatas'],
};
// Platos con foto real del propio restaurante (Glovo, Google Maps)
const FOTO_PLATO = {
  'entrantes/Huevos rotos con jamón serrano': 'huevos-rotos',
  'entrantes/Calamar a la romana': 'calamares',
  'entrantes/Albóndigas en salsa de tomate': 'albondigas',
  'entrantes/Patatas bravas': 'bravas',
  'entrantes/Alitas de pollo al grill': 'alitas',
  'entrantes/Sepia a la plancha con salsa verde': 'sepia',
  'entrantes/Alcachofitas crujientes con foie': 'alcachofitas',
  'ensaladas/César': 'ensalada-cesar',
  'pastas/Del mar': 'pasta-del-mar',
  'pastas/Cremosa': 'pasta-cremosa',
  'pizzas/San Remo': 'pizza-san-remo',
  'pizzas/Pulled pork': 'pizza-pulled',
  'pizzas/Calzone Gula': 'calzone',
  'pizzas/Cheesey': 'pizza-cheesey',
  'hamburguesas/Pulled pork': 'burger-pulled',
  'hamburguesas/Cabra burger': 'burger-cabra',
  'hamburguesas/Ibérica': 'burger-iberica',
  'hamburguesas/Supreme': 'burger-supreme',
  'bocadillos/Calamar a la romana': 'bocadillo-calamar',
  'combinados/Costilla a la barbacoa': 'costilla',
  'combinados/Pollo al curry': 'pollo-curry',
  'ninos/Hamburguesa infantil con patatas': 'burger-granito',
};
for (const ref of Object.keys(FOTO_PLATO)) buscarPlato(ref);
for (const [, ref] of Object.values(FOTO_SECCION)) buscarPlato(ref);

// Tono de fondo de cada sección: ritmo y agrupación (pizzas y hamburguesas comparten «bebida incluida»)
const TONO = { desayunos: 'tinta', pizzas: 'marea', hamburguesas: 'marea', bocadillos: 'tinta', ninos: 'yema' };
const AVISOS = {
  pizzas: 'Bebida de 33 cl incluida',
  hamburguesas: 'Patatas y bebida incluidas',
};
const PLATO_DESAYUNO = 'Café y tostada'; // los desayunos no tienen foto real: plato tipográfico

const esPlato = (p) => !/^Extra/.test(p.nombre);
function resumen(s) {
  const platos = platosDe(s).filter(esPlato);
  const precios = platos.map((p) => p.precio).filter((n) => typeof n === 'number');
  return { n: platos.length, desde: precios.length ? Math.min(...precios) : null };
}
const altPlato = (nombre, secTitulo) => `${nombre} de Gula (${secTitulo.toLowerCase()}), foto del restaurante`;

function filaPlato(p, s) {
  const ref = `${s.id}/${p.nombre}`;
  const pr = typeof p.precio === 'number' ? `<span class="plato__precio">${euros(p.precio)}</span>` : '';
  const fotoP = FOTO_PLATO[ref];
  let attrs = '', mini = '';
  if (fotoP) {
    const { srcset } = srcsetDe(fotoP);
    attrs = ` data-foto-srcset="${srcset}" data-foto-alt="${esc(altPlato(p.nombre, s.titulo))}" data-nombre="${esc(p.nombre)}" data-precio="${typeof p.precio === 'number' ? euros(p.precio) : ''}"`;
    mini = ` <span class="plato__mini" aria-hidden="true"><img src="assets/img/fotos/${fotoP}-160.webp" srcset="${srcset}" sizes="44px" width="44" height="44" alt="" loading="lazy" decoding="async"></span>`;
  }
  return `<li class="plato${fotoP ? ' plato--foto' : ''}"${attrs}>
            <div class="plato__linea"><span class="plato__nombre">${esc(p.nombre)}${mini}</span>${pr}</div>${p.desc ? `\n            <p class="plato__desc">${esc(p.desc)}</p>` : ''}
          </li>`;
}

function cabeceraPlato(s) {
  const f = FOTO_SECCION[s.id];
  if (!f) return `<div class="carta-sec__plato carta-sec__plato--letras" aria-hidden="true"><span>${PLATO_DESAYUNO}</span></div>`;
  const p = buscarPlato(f[1]);
  return `<figure class="carta-sec__plato" data-plato-seccion>
          <div class="carta-sec__foto">${foto(f[0], altPlato(p.nombre, s.titulo), '(min-width: 900px) 300px, 40vw')}</div>
          <figcaption class="carta-sec__pie"><span data-pie-nombre>${esc(p.nombre)}</span> <span class="carta-sec__pie-precio" data-pie-precio>${euros(p.precio)}</span></figcaption>
        </figure>`;
}

function cartaCompleta() {
  return carta.secciones.map((s) => {
    const { n, desde } = resumen(s);
    const datos = desde === null ? `${n} opciones en la pizarra` : `${n} en la carta · desde ${euros(desde)}`;
    const listas = (s.grupos || [{ platos: s.platos }]).map((g) => `${g.titulo ? `<h3 class="carta-grupo">${esc(g.titulo)}</h3>` : ''}
        <ul class="carta-lista">
          ${g.platos.map((p) => filaPlato(p, s)).join('\n          ')}
        </ul>`).join('\n        ');
    return `<section class="carta-sec carta-sec--${TONO[s.id] || 'leche'}" id="${s.id}" aria-labelledby="t-${s.id}">
      <div class="carta-sec__in">
      <header class="carta-sec__cab">
        <div class="carta-sec__titulos">
          <h2 class="carta-sec__titulo" id="t-${s.id}">${esc(s.titulo)} <span class="carta-sec__cuenta" aria-hidden="true">${n}</span></h2>
          <p class="carta-sec__datos">${datos}</p>
          ${s.nota ? `<p class="carta-sec__nota">${esc(s.nota)}</p>` : ''}
          ${AVISOS[s.id] ? `<p class="pegatina pegatina--linea">${AVISOS[s.id]}</p>` : ''}
        </div>
        ${cabeceraPlato(s)}
      </header>
      <div class="carta-sec__cuerpo">
        ${listas}
      </div>
      </div>
    </section>`;
  }).join('\n\n    ');
}

function navCarta() {
  return carta.secciones.map((s) => `<li><a href="#${s.id}">${esc(s.titulo)}</a></li>`).join('\n          ');
}

// «La mesa»: índice visual de la carta, un plato por sección
function mesa() {
  return carta.secciones.map((s, i) => {
    const { n, desde } = resumen(s);
    const f = FOTO_SECCION[s.id];
    const plato = f
      ? `<span class="mesa__plato">${foto(f[0], '', '(min-width: 900px) 170px, 22vw', i < 5 ? 'eager' : '')}</span>`
      : `<span class="mesa__plato mesa__plato--letras"><span>${PLATO_DESAYUNO}</span></span>`;
    return `<li style="--i:${i}"><a class="mesa__enlace" href="#${s.id}">
            ${plato}
            <span class="mesa__nombre">${esc(s.titulo)}</span>
            <span class="mesa__dato">${desde === null ? 'Por la mañana' : `${n} · desde ${euros(desde)}`}</span>
          </a></li>`;
  }).join('\n          ');
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

// Platos que van pasando por el plato giratorio de la portada
function platosHero() {
  const lista = [
    { foto: 'burger-pulled', nombre: 'Hamburguesa Pulled pork', precio: precio('hamburguesas/Pulled pork'), peg: ['Bebida', '33 cl', 'incluida'], alt: 'Hamburguesa Pulled pork de Gula, con cerdo mechado a fuego lento y salsa barbacoa' },
    { foto: 'pizza-san-remo', nombre: 'Pizza San Remo', precio: precio('pizzas/San Remo'), peg: ['Bebida', '33 cl', 'incluida'], alt: 'Pizza San Remo de Gula en su caja, con jamón serrano, rúcula y tomate cherry' },
    { foto: 'bocadillo-pollo', nombre: 'Bocadillos', precio: 'desde ' + precio('bocadillos/Francesa'), peg: ['Hay', '15', 'con nombre'], alt: 'Bocadillo de Gula con bacón y huevo frito sobre tabla de madera' },
    { foto: 'huevos-rotos', nombre: 'Huevos rotos con jamón', precio: precio('entrantes/Huevos rotos con jamón serrano'), peg: ['Para', 'picar', 'en terraza'], alt: 'Huevos rotos con jamón serrano y pimiento frito en cazuelita negra' },
  ];
  return esc(JSON.stringify(lista.map((p) => {
    const anchos = [400, 720, 1080].filter((w) => fotosDisponibles.has(`${p.foto}-${w}.webp`));
    if (!anchos.length) errores.push(`Foto inexistente: ${p.foto}`);
    return { ...p, src: `assets/img/fotos/${p.foto}-720.webp`, srcset: anchos.map((w) => `assets/img/fotos/${p.foto}-${w}.webp ${w}w`).join(', ') };
  })));
}

const bloques = {
  mesa,
  'platos-hero': platosHero,
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
