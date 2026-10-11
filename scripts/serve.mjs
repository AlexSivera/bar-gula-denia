// Servidor estático para dist/ que imita la ruta de GitHub Pages (/bar-gula-denia/).
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = '/bar-gula-denia';
const PORT = +process.env.PORT || 4322;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml' };

http.createServer(async (req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/' ) { res.writeHead(302, { Location: BASE + '/' }); return res.end(); }
  if (!url.startsWith(BASE)) { url = '/404'; } else url = url.slice(BASE.length) || '/';
  let file = path.join('dist', url.endsWith('/') ? url + 'index.html' : url);
  try {
    const data = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': TIPOS['.html'] });
    res.end(await fs.readFile('dist/404.html'));
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}${BASE}/`));
