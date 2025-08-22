Proyecto: Generador de Paletas de Colores

1) Objetivo del proyecto
- Construir una pequeña aplicación web para practicar y afianzar conceptos de HTML5, CSS3 y JavaScript aplicados a la generación y manipulación de colores.
- Servir como material didáctico para entender estructura semántica, metodología BEM, delegación de eventos y uso de la API del portapapeles en navegadores modernos.
- Facilitar la experimentación con paletas de 5 colores aleatorios y el copiado de sus códigos HEX en un entorno simple y responsivo.
- Este proyecto es exclusivamente con fines de aprendizaje y demostración.

2) Tecnologías usadas y por qué
- HTML5: para estructurar el documento con etiquetas semánticas (header, main, section, footer), mejorando la accesibilidad, el SEO y la mantenibilidad.
- CSS3: para implementar un diseño moderno con Grid y Flexbox, variables de CSS para consistencia visual, y transiciones para retroalimentación visual suave. Se sigue la metodología BEM (Block Element Modifier) para mantener claridad y escalabilidad en los estilos.
- JavaScript (vanilla): para la lógica de negocio (generación de colores aleatorios, renderizado dinámico, copiado al portapapeles y manejo de eventos) sin necesidad de librerías. Esto favorece el rendimiento, la compatibilidad y reduce la complejidad.
- Metodología y convenciones:
  - Semántica HTML cuidada: roles ARIA y atributos accesibles donde aporta valor (por ejemplo, role="img" y aria-label en las muestras de color).
  - BEM en CSS: nombres predecibles y componibles, facilita refactorización y escalamiento del diseño.
  - Variables en inglés: facilitan la lectura global del código, especialmente para funciones y nombres de variables en JavaScript.
  - Comentarios y documentación en español: explican el porqué y el para qué de las decisiones de diseño y de implementación.

3) Funcionamiento de la página
- Al cargar el documento, se generan 5 colores aleatorios y se renderizan como tarjetas dentro de una cuadrícula responsiva.
- Cada tarjeta contiene:
  - Un rectángulo grande pintado con el color correspondiente.
  - Un botón con el código HEX visible. Al hacer clic, se copia el código al portapapeles y aparece un mensaje temporal “Copiado”.
- Botón “Generar”: al presionarlo, se recalculan 5 nuevos colores y se vuelve a renderizar toda la cuadrícula, reemplazando los anteriores.
- Copiado al portapapeles:
  - Se intenta con la API moderna navigator.clipboard.writeText (recomendado en contextos seguros: HTTPS o localhost).
  - Si no está disponible, se recurre a un fallback compatible basado en document.execCommand('copy') usando un input temporal oculto.
- Retroalimentación visual:
  - Al copiar con éxito, se muestra una etiqueta “Copiado” en la esquina inferior derecha de la tarjeta por un tiempo breve y luego se oculta automáticamente.

4) Estructura en HTML
- Estructura semántica:
  - <header class="app-header">: contiene el título principal y el botón de acción primaria “Generar”.
  - <main class="app-main">: aloja la sección principal de la paleta.
    - <section class="palette" aria-label="Paleta de colores aleatorios">: bloque raíz para la funcionalidad de paleta.
      - <div id="paletteGrid" class="palette__grid" role="list">: contenedor de la cuadrícula. Los ítems (role="listitem") se insertan dinámicamente desde JavaScript.
  - <footer class="app-footer">: nota breve para el usuario.
- Clases BEM principales:
  - app-header, app-main, app-footer: bloques de layout global.
  - palette (bloque), palette__grid (elemento), palette__item (elemento contenedor de cada color), palette__swatch (muestra de color), palette__meta (zona inferior con acciones), palette__code (botón para copiar), palette__copied (mensaje de confirmación), con su modificador palette__copied--show (estado visible).
- Accesibilidad:
  - role="list" y role="listitem" ayudan a lectores de pantalla a entender la colección de elementos.
  - role="img" + aria-label en la muestra de color describen verbalmente el swatch (por ejemplo, “Muestra de color #A1B2C3”).
  - aria-live="polite" en el mensaje “Copiado” permite anunciar cambios sin interrumpir al usuario.

5) Estructura en CSS
- Organización:
  - Variables CSS en :root para colores de la interfaz, tipografías del sistema, radios, sombras, espaciados y transiciones. Esto facilita cambios temáticos y consistencia visual.
  - Reset y normalizaciones básicas: box-sizing, suavizado de fuentes, márgenes base.
  - Layout:
    - .container limita el ancho máximo y centra el contenido.
    - .app-header es sticky con fondo semitransparente y blur para un look moderno.
  - Botones (.btn, .btn--primary): estilos coherentes, enfoque visible accesible, sombras y microinteracciones (hover/active).
  - Grid de paleta (.palette__grid): CSS Grid con repeat(auto-fit, minmax(220px, 1fr)) para adaptar el número de columnas al ancho disponible y mantener tarjetas grandes y legibles.
  - Tarjetas de color:
    - .palette__item: contenedor con borde, sombra y radio, pensado para resaltar el contenido del color.
    - .palette__swatch: rectángulo grande con el color aplicado por variable CSS --swatch-color; esto desacopla estilos estructurales de valores dinámicos.
    - .palette__code: botón con fuente monoespaciada, diseñado para resaltar el código HEX y facilitar el clic. Posee transiciones y sombras sutiles para dar feedback.
    - .palette__copied: etiqueta de confirmación de copiado, aparece/oculta con el modificador .palette__copied--show mediante transiciones de opacidad y transform.
- Metodología BEM:
  - Nombres de clases expresivos y segmentados por bloque/elemento/modificador. Ejemplos: palette (bloque), palette__code (elemento), palette__copied--show (modificador de estado).
- Responsividad y accesibilidad:
  - Uso de tipografías del sistema para rendimiento y compatibilidad.
  - Colores con suficiente contraste y enfoque visible (outline) para navegación por teclado.

6) Estructura en JavaScript 
- Selección de elementos:
  - paletteGridEl: referencia al contenedor de la cuadrícula (donde se insertan los ítems).
  - generateBtnEl: referencia al botón “Generar”.
- Utilidades de color:
  - randomHexColor(): genera un valor entero aleatorio en el rango 0x000000–0xFFFFFF, lo transforma a base 16 y lo formatea como #RRGGBB en mayúsculas con padStart(6, '0') para asegurar siempre 6 dígitos.
- Renderizado:
  - createPaletteItem(hex): construye un nodo .palette__item con:
    - .palette__swatch (role="img", aria-label descriptivo) con el color aplicado vía CSS variable --swatch-color.
    - .palette__meta con el botón .palette__code que muestra y almacena el HEX en data-color.
    - .palette__copied (aria-live="polite") para mostrar el mensaje temporal de copiado.
  - renderPalette(count = 5): limpia la cuadrícula e inserta count elementos generados con randomHexColor().
- Copiado al portapapeles:
  - copyToClipboard(text): intenta copiar con navigator.clipboard.writeText; si no está disponible, usa un input temporal y document.execCommand('copy') para máxima compatibilidad.
  - showCopiedFeedback(itemEl, durationMs = 1200): añade el modificador .palette__copied--show al elemento correspondiente para mostrar la etiqueta “Copiado” y la remueve pasado el tiempo indicado. Maneja posibles solapes limpiando timeouts previos guardados en el propio nodo (itemEl._copiedTimeout).
- Manejo de eventos:
  - Delegación en la cuadrícula: un único listener en paletteGridEl escucha clics; si el objetivo o su ancestro más cercano es .palette__code, se obtiene el HEX de data-color, se copia y se muestra el feedback. La delegación evita tener múltiples listeners por ítem y simplifica el re-render.
  - Botón “Generar”: al hacer clic, llama a renderPalette(5) para regenerar la paleta completa.
  - Inicio: en DOMContentLoaded se renderizan los 5 colores iniciales.
- Nomenclatura:
  - Variables y funciones en inglés para legibilidad global (randomHexColor, renderPalette, copyToClipboard, showCopiedFeedback), con comentarios detallados en español explicando el propósito y las decisiones de diseño.

7) Principales elementos y cómo funcionan
- Botón “Generar” (#generateBtn):
  - Dispara el re-render de la cuadrícula con nuevos 5 colores mediante renderPalette(5).
  - No mantiene estado; cada invocación genera una paleta completamente nueva.
- Ítem de paleta (.palette__item):
  - .palette__swatch: representa visualmente el color. El color se aplica con una variable CSS (--swatch-color) para permitir separación entre estructura y datos dinámicos.
  - .palette__code (botón):
    - Muestra el HEX en tipografía monoespaciada para legibilidad.
    - Al clic, el listener delegado captura el evento, llama a copyToClipboard(hex) y luego a showCopiedFeedback.
  - .palette__copied (mensaje):
    - Elemento no interactivo, anunciado de forma “polite” para accesibilidad.
    - Se hace visible con la clase modificadora .palette__copied--show y se oculta automáticamente tras ~1.2 segundos.
- Mecanismo de copiado:
  - Prioriza la API Clipboard moderna por seguridad y confiabilidad.
  - Fallback con execCommand asegura soporte en navegadores que aún no exponen navigator.clipboard (cuando no hay contexto seguro), mejorando robustez.

8) Compatibilidad, rendimiento y extensibilidad
- Compatibilidad:
  - Funciona en navegadores modernos. El copiado incluye fallback para escenarios sin navigator.clipboard.
  - Sin dependencias externas; basta abrir index.html en un navegador actual.
- Rendimiento:
  - Renderizado simple y puntual: se reconstruye la cuadrícula al generar nuevos colores, operación ligera dado el tamaño (5 ítems).
  - Delegación de eventos: un solo listener para todos los botones de copiado.
- Extensibilidad sugerida:
  - Permitir bloquear (lock) un color para mantenerlo al regenerar.
  - Añadir soporte para otros formatos (RGB, HSL) o conversiones.
  - Guardar/restaurar paletas en localStorage.
  - Exportar la paleta (por ejemplo, como JSON, CSS variables o enlaces compartibles).

9) Cómo ejecutar
- No requiere instalación. Abra el archivo index.html en un navegador moderno.
- Archivos:
  - index.html → estructura y contenido semántico de la página.
  - style.css → estilos, layout, responsividad y microinteracciones, siguiendo BEM.
  - script.js → lógica de generación, render y copiado, con nombres de variables/funciones en inglés y comentarios en español.

10) Link de la página
