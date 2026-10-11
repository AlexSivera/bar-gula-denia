# Bar Restaurante GULA · Dénia

Web de Bar Restaurante GULA (Av. de Ramón Ortega, 7 · detrás de la estación de autobuses de Dénia): bar de barrio desde las 6:00, almuerzos con 15 bocadillos con nombre, menú del día y, por la noche, pizzas de 33 cm y hamburguesas con la bebida incluida.

Concepto: **«Date el capricho»** — marea turquesa del logo, comida real en círculo y una grotesca condensada. Ver `docs/`.

Web estática (HTML + CSS + JS sin dependencias). Se edita en `src/` y se genera en `dist/`.

```
src/
  data/carta.json      ← la carta: platos y precios (todos los precios de la web salen de aquí)
  data/negocio.json    ← teléfono, dirección, horario, enlaces
  pages/               ← index, carta, legal, 404
  partials/            ← head, cabecera, pie
  assets/              ← css, js, fuente (Bricolage Grotesque), imágenes
scripts/
  build.mjs            ← genera dist/ (falla si un plato o una foto citados no existen)
  check.mjs            ← enlaces, anclas, recursos, alt, h1, teléfono
  serve.mjs            ← servidor local en http://localhost:4322/bar-gula-denia/
  images.mjs           ← procesa las fotos reales de raw/ (necesita sharp)
  logo.mjs             ← extrae el logo de la portada de la carta en capas recoloreables
docs/                  ← brief, referencias, dirección artística, contenidos y QA
```

## Uso

```bash
npm run dev      # build + servidor local
npm run check    # build + comprobación de enlaces y recursos
npm run images   # regenerar fotos (requiere npm install y las fuentes en raw/, que no se publican)
```

Para probar el estado abierto/cerrado a otra hora: `?dia=3&hora=12:00` (0 = domingo).

## Publicación

Cada `push` a `main` publica en GitHub Pages mediante `.github/workflows/pages.yml`.

## Pendiente con el negocio

- Razón social y NIF del titular para el aviso legal.
- Confirmar el uso de las fotos (son las que Gula publicó en Glovo, Google Maps e Instagram).
- Precio y días del menú del día, y precios actuales de desayunos y almuerzo.
- Enlazar esta web desde la ficha de Google Maps (hoy no tiene web asociada).
