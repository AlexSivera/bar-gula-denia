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

## Riesgos que se evitan

- Convertir el «pecado» en chiste continuo: el humor se queda en dos o tres frases.
- Abusar de círculos: solo para fotos protagonistas (hero, selector, bocadillos). La galería es rectangular.
- Que el turquesa haga ilegible el texto: el texto pequeño sobre marea va en leche (≥ 4,5:1); la tinta solo en tamaños grandes.
- Fotos de móvil estiradas: tamaños máximos controlados y `srcset`.
- Inventar: sin precio de menú del día, sin nombres del equipo, sin datos estructurados de valoración.
