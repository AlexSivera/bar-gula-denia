# Estrategia de contenido

## Voz
Tuteo, frases cortas, la barra hablando. Humor puntual con el nombre («aquí la gula no es pecado»), nunca en cada frase. Datos concretos en lugar de adjetivos: «bebida de 33 cl incluida» en vez de «gran calidad-precio».

## Mensajes, por prioridad
1. **Qué es y dónde**: bar, restaurante y pizzería detrás de la estación de autobuses de Dénia.
2. **Cuándo**: de 6:00 a 23:30; miércoles cerrado (sábado desde las 7:00, domingo desde las 8:00, martes hasta las 23:00).
3. **Bebida incluida** en todas las pizzas y hamburguesas (y patatas en las hamburguesas).
4. **15 bocadillos con nombre propio**.
5. **Menú del día**: «llama y te contamos qué hay hoy».
6. **Fechas señaladas**: menús cerrados con reserva.
7. **A domicilio** por Glovo y Just Eat (precios de la plataforma).

## Páginas
| Página | Intención de búsqueda | Título |
|---|---|---|
| `/` | bar / almuerzo / pizzería / menú del día en Dénia | Bar Restaurante GULA · Bar, pizzería y almuerzos en Dénia |
| `/carta.html` | carta y precios de Gula | Carta y precios · Bar Restaurante GULA, Dénia |
| `/legal.html` | obligación legal | Aviso legal y privacidad |
| `/404.html` | — | Página no encontrada |

## Textos que NO se escriben
- Precio del menú del día, hora de fin del almuerzo, días del menú.
- «Los mejores de Dénia», «experiencia gastronómica», «calidad, innovación…».
- Testimonios inventados: solo frases literales y cortas de reseñas públicas de Google, enlazando a la ficha.
- Nombres del equipo o historia del local.

## Fuente de datos
- `src/data/carta.json`: carta 2026 completa (transcrita del PDF y contrastada página a página). Todos los precios de la portada salen de aquí; el build falla si un plato citado no existe.
- `src/data/negocio.json`: teléfono, dirección, horario, enlaces. Alimenta cabecera, estado abierto/cerrado, tabla de horario y JSON-LD.
