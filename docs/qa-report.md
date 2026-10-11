# Informe de QA — Bar Restaurante GULA

Fecha: 11/10/2026 · Entorno: `dist/` servido en local (`scripts/serve.mjs`, misma ruta que GitHub Pages) y probado con Playwright (Chromium).

## 1. Build y validación

| Comprobación | Resultado |
|---|---|
| `node scripts/build.mjs` | ✅ 4 páginas, 9 secciones de carta, 15 bocadillos. Falla si un plato o una foto citados no existen o queda una marca sin resolver. |
| `node scripts/check.mjs` | ✅ 0 enlaces internos rotos, 0 anclas inexistentes, 0 recursos ausentes (img, srcset, css, js, fuentes, máscaras), 1 `h1` por página, todas las `img` con `alt`, todos los `tel:` a +34 865 83 35 27 |
| `html-validate` 9.4 (recommended) | ✅ 0 errores. Desactivadas: `doctype-style`, `no-inline-style`, `long-title` y `tel-non-breaking` (el número ya usa espacios no separables; la regla marcaba los espacios de «Llamar al»). |
| Consola del navegador | ✅ 0 errores y 0 avisos en portada y carta |

## 2. Funcional

| Prueba | Resultado |
|---|---|
| Estado domingo 11:30 (hora real) | ✅ «Abierto hasta las 23:30», fila «Domingo · hoy» resaltada |
| Estado miércoles 12:00 (`?dia=3&hora=12:00`) | ✅ cabecera «Hoy cerrado · abre mañana»; portada «Los miércoles descansamos. Abrimos mañana a las 6:00.» |
| Pestañas «¿Qué te pide el cuerpo?» | ✅ clic, flechas izquierda/derecha, Inicio/Fin; `aria-selected` y `tabindex` correctos; la foto de cada pestaña se carga al mostrarse |
| Sin JavaScript | ✅ por diseño: la lista de pestañas lleva `hidden` y los seis paneles se ven seguidos; el estado de la cabecera queda oculto y la portada muestra el horario general |
| Mapa bajo demanda | ✅ el `iframe` de Google se crea solo al pulsar «Ver el mapa aquí», con `title` descriptivo |
| Carta: barra de categorías | ✅ salto a `#pizzas` con el título visible bajo la cabecera y la barra fijas; sección activa resaltada al hacer scroll |
| 404 bajo `/bar-gula-denia/` | ✅ estilos y enlaces correctos gracias a `<base>` |
| Enlaces externos | ✅ Glovo, Just Eat, Instagram y Facebook responden 200 (comprobado con curl) |
| Formularios | No hay. No existe sistema de reservas online; la acción principal es llamar. |

## 3. Responsive

| Ancho | Resultado |
|---|---|
| 1440 × 900 | ✅ titular «CAPRICHO.» montado sobre el plato a propósito; párrafo fuera del anillo |
| 1024 × 768 | ✅ misma composición; el anillo roza el párrafo sin tocarlo |
| 768 × 1024 | ✅ sin scroll horizontal |
| 390 × 844 | ✅ sin scroll horizontal; titular a 25vw, plato en la primera pantalla, «Llamar» siempre visible en la cabecera |

Corregido durante la revisión:
- Pestañas que se cortaban a la derecha en escritorio → ahora se ajustan en varias líneas.
- Círculos de bocadillos deformados (el flex los estiraba) → `align-items: flex-start`.
- Precio de cada bocadillo caía en una línea suelta en móvil → colocado en la primera fila.
- Desbordamiento horizontal en la carta móvil («HAMBURGUESAS» junto a la foto) → rejilla `minmax(0, 1fr)` y título fluido.
- Estado de la cabecera partido en dos líneas en móvil → en móvil solo «Abierto»/«Cerrado».
- Horarios del pie partidos («6:00–» / «23:30») → `nowrap`.

## 4. Accesibilidad

- **axe-core 4.10.2: 0 infracciones** en portada, carta, legal y 404 (tras corregir el contraste de los números del índice de bocadillos, 4,09:1 → 5:1).
- Contrastes de diseño: texto leche sobre marea `#1F737B` ≈ 5:1; marea sobre leche ≈ 5:1; tinta sobre marea ≈ 3,3:1 solo en titulares grandes; yema sobre marea solo en texto grande en negrita.
- Enlace «Saltar al contenido», foco visible (contorno tinta + halo yema), objetivos táctiles ≥ 44 px, `alt` descriptivo en todas las fotos, decoraciones con `aria-hidden`.
- `prefers-reduced-motion`: se detienen el giro del anillo, las transiciones de las pestañas y el scroll suave.

## 5. Rendimiento (portada, móvil, primera carga en local)

- 334 KB en 10 peticiones (medido con la Resource Timing API a 390 px y densidad 1) tras pasar las máscaras del logo a WebP; antes, 432 KB. LCP ≈ 0,2 s en local. En móviles de densidad 3 el navegador elige la foto de 1080 px del hero, así que el peso real será algo mayor.
- Fuente variable propia (128 KB, subconjunto latino, `preload` + `font-display: swap`), sin peticiones a Google Fonts.
- Fotos WebP en 400/720/1080 px con `srcset`/`sizes`, `width`/`height` declarados, carga diferida salvo la del hero (`fetchpriority="high"`).
- Sin dependencias en el cliente; JS de 6 KB.

## 6. Limitaciones conocidas

- No se ha probado en Safari/iOS ni en Firefox (solo Chromium). `mask-image` y `font-stretch` variables están soportados en los navegadores actuales, pero conviene una revisión en un iPhone real.
- Las fotos son de móvil y de calidad desigual; una sesión de fotos propia mejoraría mucho la web.
- Los precios de Glovo/Just Eat difieren de la carta; la web lo advierte.
