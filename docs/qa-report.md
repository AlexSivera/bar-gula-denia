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

---

## 7. Segunda revisión: auditoría contra el CLAUDE.md y sistema de movimiento (11/10/2026)

### Defectos encontrados en la auditoría y corregidos
| CLAUDE.md | Defecto | Corrección |
|---|---|---|
| §11 móvil estrecho | A 320 px el botón «Llamar» de la cabecera se salía y había scroll horizontal | Por debajo de 360 px: rótulo más pequeño y estado solo con el punto de color (el texto queda para lectores de pantalla). Comprobado: 305 px de contenido en 305 px de ventana. |
| §11 estados de interacción | Los `:hover` con movimiento (zoom de la galería, color del índice, flechas) se disparaban al tocar en móvil | Todos los `:hover` van dentro de `@media (hover: hover) and (pointer: fine)` |
| §17 «memorable» / §15 | Web casi estática; la portada solo enseñaba una hamburguesa | Sistema de movimiento con función (ver `design-direction.md`) |

### Defectos de la propia animación encontrados y corregidos al probarla
- **Contenido que podía quedarse oculto**: `IntersectionObserver` de Chromium tiene en cuenta el `clip-path` del elemento, así que los títulos (que empiezan recortados) no se revelaban nunca; además, con la página ocupada entrega los avisos tarde y un scroll rápido dejaba elementos sin revelar. Sustituido por una comprobación en cada fotograma de scroll que revela todo lo que ya está por encima del borde inferior. Prueba: recorrido completo a saltos de 600 px → 63/63 elementos revelados en la portada y todos en la carta.
- **Parpadeo al cargar**: los elementos ya visibles hacían una transición hacia oculto y vuelta. Ahora lo que está a la vista al cargar no se anima, y el estado inicial se aplica un fotograma antes que la transición (de 130 animaciones al cargar a solo las de la entrada).
- **Contador que podía quedarse en «0,0»**: ahora solo arranca en 0 si la sección está por debajo de la pantalla, y se lanza con la misma comprobación determinista.
- **Estrella de la valoración desplazada** sobre las citas (ancho mínimo excesivo del número) → eliminado; las cifras ya son tabulares.
- **Texto en contorno de la cinta** mostraba los solapes internos de la fuente variable → fila en turquesa macizo.
- **Controles del plato tapando la pegatina** en móvil → controles debajo del plato y pegatina anclada por arriba.
- Cinta demasiado rápida (≈1.900 px de recorrido) → reducida a la mitad.

### Pruebas
| Prueba | Resultado |
|---|---|
| Entrada de la portada (fotograma congelado a 450 ms) | ✅ «DATE EL» subiendo desde su máscara, plato terminando de girar, anillo y «CAPRICHO.» aún por entrar |
| Plato giratorio: siguiente manual, avance automático, pausa | ✅ hamburguesa → pizza (manual) → bocadillos (automático a los 4,5 s); con pausa no cambia en 6 s; `aria-pressed` y `aria-label` se actualizan |
| `prefers-reduced-motion: reduce` | ✅ 0 animaciones activas, sin `html.mo`, el plato no cambia solo (botón de pausa oculto), «siguiente» cambia la foto al instante, 0 elementos con opacidad 0, nota fija en 4,5 |
| Transición portada → carta | ✅ navegación correcta y sin errores en consola |
| `html-validate` | ✅ 0 errores |
| `check.mjs` | ✅ sin enlaces ni recursos rotos |
| axe-core 4.10.2 con el movimiento activo | ✅ 0 infracciones en portada y carta |
| 320 / 390 / 768 / 1024 / 1440 / 1920 px | ✅ sin scroll horizontal |
| Peso de la portada en móvil | 379 KB en 11 peticiones (CSS 36 KB, JS 16 KB; incluye la pizza precargada para el primer giro) |

### Limitaciones
- El navegador de pruebas iba limitado a ~4 fotogramas por segundo (ventana en segundo plano), así que la **fluidez** del movimiento no se ha podido juzgar aquí: conviene verlo en un navegador normal y en un móvil real.
- La cinta y el giro de los platos con el scroll usan `animation-timeline`, soportado en Chrome/Edge y Safari recientes; en Firefox se quedan quietos (sin fallo).
- La transición entre páginas (View Transitions entre documentos) solo funciona en Chrome/Edge/Safari recientes; en el resto la navegación es normal.
