# Dirección artística — GULA, Dénia

## Concepto: «Date el capricho»

Las palabras son del propio negocio: *«Ven darte un capricho cualquier día de la semana».* Gula se llama como el pecado de comer con ganas, y su logo es un muñeco con una pizza en una mano y una hamburguesa en la otra. La web no lo esconde: **pone la comida real delante, grande y redonda, sobre el turquesa de la marca**, y pregunta lo que pregunta la barra: *¿qué te pide el cuerpo?*

En tres frases:
- Una **marea turquesa** (el color medido en su logo) ocupa la primera pantalla y las secciones clave, como el rojo de Délice.
- La comida aparece en **círculos**, como sus platos vistos desde arriba y como el sello de su logo, con un anillo de texto que gira igual que «Bar · Restaurante · Pizzería».
- **Tipografía condensada muy pesada** que se monta encima de las fotos y un índice gigante para los 15 bocadillos con nombre.

### Por qué este concepto y no otro
- Sale de tres evidencias: su lema («capricho»), su logo (sello redondo, turquesa y tinta) y sus fotos reales de producto, que son cálidas (pan brioche, huevo, fritura) y saltan sobre el turquesa por contraste complementario.
- Es útil: la pregunta «¿qué te pide el cuerpo?» es un selector de carta con precios reales, no un adorno.
- Se diferencia de la propuesta anterior para el mismo negocio («El reloj de Gula»: papel crema, pincel Knewave, máscaras de papel rasgado, fotos de Unsplash organizadas por horas). Aquí no hay papel, ni pincel tipográfico, ni línea del tiempo; hay color plano, círculos, una grotesca condensada y **solo fotos reales del restaurante**.
- Se diferencia de los demás proyectos del estudio: Basilico ya fue un periódico (por eso se descartó el papel de periódico que aparece en las fotos de Gula), Pizza del Barrio usó Big Shoulders y el viaje de la caja; ninguno ha usado una grotesca variable condensada sobre un color de marca a sangre.

## Público y emoción

Trabajadores madrugadores, vecinos, familias, gente de paso por la estación y quien pide a domicilio. La web tiene que dar **hambre y confianza**: «esto se ve rico, esto cuesta esto, está aquí al lado y me lo cogen al teléfono». Tono desenfadado y cercano, tuteando, con humor sobre el nombre sin convertirlo en chiste continuo.

Posicionamiento percibido: bar de barrio generoso y con marca propia. Ni gastrobar de diseño, ni cadena de fast food.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--marea` | `#1F737B` | superficie principal de marca (turquesa del logo `#2B848F` oscurecido para que el texto claro cumpla AA) |
| `--turquesa` | `#2B848F` | turquesa exacto del logo: capas del sello, detalles |
| `--agua` | `#8ED2D5` | turquesa claro: acentos sobre tinta |
| `--tinta` | `#111517` | texto, titulares, secciones oscuras |
| `--leche` | `#F6F3EC` | fondo claro, texto sobre marea |
| `--yema` | `#F4B63F` | pegatinas y foco (yema de huevo, pan tostado): solo para lo que decide la compra |
| `--abierto` / `--cerrado` | `#7DDB9A` / `#FF9A86` | punto de estado sobre fondo oscuro |

Reglas: sin degradados, sin sombras difusas, sin cristal. Color plano y fotos con su color natural (la comida no se tiñe de turquesa).

## Tipografía

**Bricolage Grotesque** (variable: peso 200–800, anchura 75–100, tamaño óptico 12–96), servida desde el propio dominio, una sola familia:
- **Titulares**: anchura 75, peso 800, óptico 96, mayúsculas, interlineado 0,86. Condensada y pesada, con remates de tinta que dialogan con el rótulo a brocha sin imitarlo.
- **Nombres de platos y precios**: anchura 80–85, peso 700, cifras tabulares.
- **Texto**: anchura 100, peso 400, óptico 14.

El rótulo «GULA» nunca se compone con una fuente: es siempre el **logo real** extraído de su carta, recoloreado con `mask-image`.

## Fotografía

- Solo fotos reales del restaurante (Glovo, Google Maps, Instagram). Ningún banco de imágenes, ninguna imagen generada.
- Se descartan las fotos de la ficha de Glovo que son claramente de stock.
- **Tratamiento**: recorte en círculo (platos, sello) para las fotos protagonistas; rejilla rectangular a sangre para la galería. Ajuste mínimo de exposición y nitidez en el proceso; sin filtros de color.
- Las fotos son de móvil y de calidad irregular: por eso se muestran a tamaños contenidos (no se estiran a pantalla completa) y se eligen las de mejor luz.

## Composición y ritmo

| Sección | Fondo | Composición |
|---|---|---|
| Cabecera | leche | rótulo GULA (logo real) · estado abierto/cerrado · Carta · Llamar |
| 1. Primera pantalla | marea | titular gigante «Date el capricho» que se monta sobre el círculo de una hamburguesa real; anillo de texto girando; pegatina «bebida incluida»; Llamar + Ver carta |
| Banda de datos | tinta | 4 datos con filetes: horario · miércoles cerrado · detrás de la estación · terraza |
| 2. ¿Qué te pide el cuerpo? | leche | selector de antojos (palabras grandes) + círculo de foto + 4 platos con precio + pegatina |
| 3. Bocadillos con nombre | marea | índice numerado de los 15, nombre enorme · ingredientes · precio; dos fotos circulares |
| 4. Recién salido de cocina | tinta | rejilla de fotos reales a sangre con nombre y precio |
| 5. Menú del día y fechas señaladas | leche | dos columnas: el menú diario (llama) y los menús especiales recientes |
| 6. Lo que dice la gente | marea | 4,5 ★ / 261 en grande + tres frases reales cortas |
| 7. Dónde | leche | «Detrás de la estación de autobuses», horario con hoy resaltado, mapa bajo demanda, domicilio |
| Pie | tinta | sello completo del logo en grande, contacto, redes, legal |

Alternancia leche / marea / tinta para marcar el ritmo sin repetir la misma composición dos veces.

## Navegación

- Cabecera fija y compacta: logo, estado, «Carta», «Almuerzo», «Dónde», botón **Llamar** con el número visible.
- Móvil: logo + estado + «Carta» + botón «Llamar» siempre visibles en la cabecera. Sin menú hamburguesa (dos páginas y tres acciones no lo necesitan) y sin barra flotante que tape contenido.
- Página de carta con barra de categorías fija y desplazable.

## Componentes

- **Botones**: rectángulos de esquina recta y borde de 2 px; el principal en tinta sobre marea o yema sobre tinta; altura mínima 48 px.
- **Pegatinas**: círculo o rectángulo yema, girados unos grados, texto condensado en tinta. Máximo una por bloque.
- **Filetes**: 3–6 px en tinta o leche, nunca líneas grises finas.
- **Círculo de foto**: `border-radius: 50%` con anillo de texto SVG alrededor.
- Sin tarjetas con sombra, sin iconos genéricos de adorno, sin emojis.

## Interacciones (y por qué)

| Interacción | Justificación |
|---|---|
| Estado abierto/cerrado calculado con la hora de Dénia | la duda nº 1 de un bar que abre a las 6 y cierra los miércoles |
| Selector «¿Qué te pide el cuerpo?» (pestañas accesibles) | lleva a platos y precios reales en un toque; sin JS se ven todos |
| Anillo de texto que gira lento | eco del sello del logo; se detiene con `prefers-reduced-motion` |
| Mapa de Google bajo demanda | privacidad y rendimiento |
| Horario con «hoy» resaltado | lectura inmediata |

Nada de cursor personalizado, parallax, WebGL ni scroll secuestrado.

## Sistema de movimiento (segunda revisión, 11/10/2026)

Tras revisar la web contra el CLAUDE.md, la crítica fue justa: salvo el anillo, era estática, y la portada solo enseñaba una hamburguesa cuando Gula va «del café al calzone». El movimiento se añade con una regla: **cada efecto tiene una función y sale del concepto** (el plato redondo, el sello que gira, la cinta de los bocadillos con nombre).

| Movimiento | Función | Cómo |
|---|---|---|
| Entrada de la portada: el titular sube desde su máscara, el plato llega girando, la pegatina «se pega» con rebote | primera impresión, una sola vez | animaciones CSS escalonadas (60–950 ms), curva `--ease-out` fuerte; rebote solo en la pegatina |
| **El plato gira**: cada 4,5 s da una vuelta y llega otro plato (hamburguesa → pizza → bocadillos → huevos rotos), con su nombre y precio | explicar la variedad real del bar en la primera pantalla | WAAPI: rotación de 360° en 950 ms con desenfoque de 3 px a mitad de giro para ocultar el cambio de foto; la foto siguiente se precarga y se descodifica antes de girar |
| Botones de pausa y siguiente en el plato | WCAG 2.2.2 (contenido que se mueve solo) | también se para con el ratón encima, fuera de pantalla o con la pestaña oculta |
| Cambio de pestaña en «¿Qué te pide el cuerpo?» | indicar el cambio de estado | el plato entra girando 40°, la lista sube, la pegatina se pega (≤ 520 ms) |
| Revelados al hacer scroll: títulos desde máscara, filas que suben escalonadas (60 ms), fotos de la galería con cortina | ritmo de lectura en una página larga | transiciones de `clip-path`/`transform`/`opacity`, una sola vez |
| Cinta amarilla con «Pizzas de 33 cm · Bebida incluida…» y los nombres de los bocadillos | energía de barra, eco de las cintas de Sixes | ligada al scroll con `animation-timeline: view()`; sin soporte, queda quieta |
| Los platos del índice de bocadillos giran con el scroll | eco del plato y del sello | `animation-timeline: scroll()` |
| Contador 0,0 → 4,5 y estrella que entra girando | dar peso a la valoración | una vez; si la sección ya está a la vista, se muestra la nota sin animar |
| Pulsación de botones (`scale(.97)`, 160 ms) | confirmar el toque | CSS |
| Transición suave entre portada y carta | continuidad, la cabecera no «salta» | View Transitions entre documentos |

**Garantías:**
- Todo depende de la clase `html.mo`, que solo se pone si hay JavaScript y el sistema **no** pide reducir movimiento. Sin JS o con movimiento reducido, todo se ve quieto y completo; el plato solo cambia si se pulsa «siguiente».
- Los revelados no usan `IntersectionObserver` (entrega tarde con la página ocupada y no ve los elementos recortados con `clip-path`): en cada fotograma de scroll se revela todo lo que ya esté por encima del borde inferior, incluido lo que se haya pasado. Ningún contenido puede quedarse oculto.
- Lo que ya está a la vista al cargar no se anima (sería un parpadeo, no una entrada).
- Solo se animan `transform`, `opacity` y `clip-path`; los `:hover` con movimiento solo se aplican con ratón.
- Sin librerías: unos 16 KB de JS en total.

## Riesgos que se evitan

- Convertir el «pecado» en chiste continuo: el humor se queda en dos o tres frases.
- Abusar de círculos: solo para fotos protagonistas (hero, selector, bocadillos). La galería es rectangular.
- Que el turquesa haga ilegible el texto: el texto pequeño sobre marea va en leche (≥ 4,5:1); la tinta solo en tamaños grandes.
- Fotos de móvil estiradas: tamaños máximos controlados y `srcset`.
- Inventar: sin precio de menú del día, sin nombres del equipo, sin datos estructurados de valoración.

## La carta (tercera revisión, 11/10/2026)

**Diagnóstico de partida:** nueve secciones idénticas sobre el mismo fondo claro (un muro de texto, §9 del CLAUDE.md), una cabecera sin comida, fotos reales de más de veinte platos sin usar y un fallo visible: «HAMBURGUE·SAS» y «PLATOS COMBINADO·S» se partían a mitad de palabra en escritorio.

**Idea: la carta se sirve en platos.** Es el mismo lenguaje de la portada (el plato redondo), aplicado a navegar y a leer:

| Pieza | Qué hace | Por qué |
|---|---|---|
| **«La mesa»** (cabecera) | nueve platos vistos desde arriba, uno por sección, con su número de platos y precio mínimo; cada uno lleva a su sección. Entran cayendo y girando en ola | índice visual: en un vistazo se ve qué hay y desde cuánto. Los desayunos, sin foto real, tienen un plato tipográfico («Café y tostada») en vez de una imagen inventada |
| **Tono por sección** | desayunos en tinta (la pizarra del bar), pizzas y hamburguesas juntas en turquesa (comparten «bebida incluida»), bocadillos en tinta, niños en yema, el resto en leche | ritmo y agrupación con sentido; rompe el muro de texto |
| **Cabecera de sección** | título + número de platos en un círculo amarillo + «N en la carta · desde X €» + pegatina; debajo, el plato de la sección con borde de plato y su pie con nombre y precio | jerarquía clara y datos útiles antes de leer la lista |
| **Miniaturas reales** | 22 platos de la carta llevan su foto real en miniatura junto al nombre | señala qué platos se pueden ver; nunca se pone foto a un plato que no la tiene |
| **El plato cambia al que miras** (escritorio) | al pasar el ratón por un plato con foto, el plato grande de la sección gira (380 ms) y lo muestra con su nombre y precio; al salir vuelve al de la sección | convierte la lista en algo que se explora; solo con ratón, con 90 ms de espera para que no gire al pasar de largo |
| **Barra de progreso** | línea amarilla bajo la barra de categorías que avanza con la lectura | orientación en una página de 100 platos y opciones (82 de carta más 18 de desayuno) |
| **Platos que giran con el scroll** | los platos de cada sección giran despacio al bajar | eco del sello y del plato de la portada |
| **Cierre** | bloque turquesa con «¿Ya sabes lo que quieres?» y el teléfono a tamaño titular | la acción principal (llamar), con la presencia que merece |

Todos los números (platos, «desde X €») salen de `carta.json` en el build: si cambia la carta, cambian solos. El build falla si una foto se asigna a un plato que no existe.
