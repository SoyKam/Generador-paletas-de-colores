/* Selección de elementos DOM */

const paletteGridEl = document.getElementById('paletteGrid');  // Contenedor de la cuadrícula
const generateBtnEl = document.getElementById('generateBtn');  // Botón para regenerar colores

/* Utilidades de color */

function randomHexColor() {
  const value = Math.floor(Math.random() * 0xFFFFFF); // rango 0..16777215
  return `#${value.toString(16).padStart(6, '0').toUpperCase()}`;
}

/* ------------------------------ */
/* Renderizado de ítems           */
/* ------------------------------ */

/**
 * Crea el nodo de un ítem de paleta con estructura BEM.
 * @param {string} hex - Código de color HEX (e.g., "#A1B2C3")
 * @returns {HTMLElement} - Nodo listo para insertarse en la cuadrícula.
 *
 * Estructura:
 * <div class="palette__item">
 *   <div class="palette__swatch" style="--swatch-color: #HEX"></div>
 *   <div class="palette__meta">
 *     <button class="palette__code" data-color="#HEX"><span class="palette__code-text">#HEX</span></button>
 *   </div>
 *   <span class="palette__copied">Copiado</span>
 * </div>
 */
function createPaletteItem(hex) {
  const itemEl = document.createElement('div');
  itemEl.className = 'palette__item';
  itemEl.setAttribute('role', 'listitem');

  const swatchEl = document.createElement('div');
  swatchEl.className = 'palette__swatch';
  swatchEl.style.setProperty('--swatch-color', hex);
  swatchEl.style.backgroundColor = 'var(--swatch-color)';
  swatchEl.setAttribute('role', 'img');
  swatchEl.setAttribute('aria-label', `Muestra de color ${hex}`);

  const metaEl = document.createElement('div');
  metaEl.className = 'palette__meta';

  const codeBtnEl = document.createElement('button');
  codeBtnEl.className = 'palette__code';
  codeBtnEl.type = 'button';
  codeBtnEl.dataset.color = hex;
  codeBtnEl.setAttribute('aria-label', `Copiar color ${hex}`);

  const codeTextEl = document.createElement('span');
  codeTextEl.className = 'palette__code-text';
  codeTextEl.textContent = hex;

  codeBtnEl.appendChild(codeTextEl);
  metaEl.appendChild(codeBtnEl);

  const copiedEl = document.createElement('span');
  copiedEl.className = 'palette__copied';
  copiedEl.setAttribute('aria-live', 'polite');
  copiedEl.setAttribute('aria-atomic', 'true');
  copiedEl.textContent = 'Copiado';

  itemEl.appendChild(swatchEl);
  itemEl.appendChild(metaEl);
  itemEl.appendChild(copiedEl);

  return itemEl;
}

/**
 * Rellena la cuadrícula con una cantidad dada de colores aleatorios.
 * @param {number} count - número de elementos a generar (por defecto 5).
 */
function renderPalette(count = 5) {
  // Limpiar contenido previo para evitar acumulaciones
  paletteGridEl.innerHTML = '';

  // Crear y agregar cada ítem
  for (let i = 0; i < count; i++) {
    const hex = randomHexColor();
    const itemEl = createPaletteItem(hex);
    paletteGridEl.appendChild(itemEl);
  }
}

/* Copiado al portapapeles        */

/**
 * Intenta copiar un texto al portapapeles usando la API moderna,
 * y si no está disponible, usa un fallback con execCommand.
 * @param {string} text - texto a copiar (código HEX).
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
  // API moderna (recomendada): requiere contexto seguro (https o localhost)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback para navegadores que no soportan navigator.clipboard
  return new Promise((resolve, reject) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.setAttribute('readonly', '');
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    tempInput.style.pointerEvents = 'none';
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, text.length);
    const successful = document.execCommand('copy');
    document.body.removeChild(tempInput);
    successful ? resolve() : reject(new Error('No se pudo copiar'));
  });
}

/**
 * Muestra el mensaje "Copiado" de forma temporal en el ítem correspondiente.
 * @param {HTMLElement} itemEl - elemento .palette__item sobre el que se muestra el feedback.
 * @param {number} durationMs - tiempo visible en milisegundos (por defecto 1200ms).
 */
function showCopiedFeedback(itemEl, durationMs = 1200) {
  const copiedEl = itemEl.querySelector('.palette__copied');
  if (!copiedEl) return;
  copiedEl.classList.add('palette__copied--show');

  // Limpiar cualquier timeout previo guardado en el nodo para evitar solapes
  if (itemEl._copiedTimeout) {
    clearTimeout(itemEl._copiedTimeout);
  }
  itemEl._copiedTimeout = setTimeout(() => {
    copiedEl.classList.remove('palette__copied--show');
    itemEl._copiedTimeout = null;
  }, durationMs);
}

/* Eventos                        */

/**
 * Delegación de eventos en la cuadrícula:
 * - Detecta clics en .palette__code para copiar el HEX.
 * - Esto evita agregar listeners por ítem y facilita el re-render.
 */
paletteGridEl.addEventListener('click', async (ev) => {
  const target = ev.target;
  // Buscamos el botón más cercano con la clase requerida
  const codeBtn = target instanceof Element ? target.closest('.palette__code') : null;
  if (!codeBtn) return;

  const itemEl = codeBtn.closest('.palette__item');
  const hex = codeBtn.dataset.color;
  if (!hex || !itemEl) return;

  try {
    await copyToClipboard(hex);
    showCopiedFeedback(itemEl);
  } catch (err) {
    // En caso de error, podemos mostrar un alert mínimo para informar
    // (decision: simple y universal sin librerías)
    alert('No se pudo copiar el color. Inténtalo nuevamente.');
    // También podríamos registrar en consola para debug
    // console.error(err);
  }
});

/**
 * Botón "Generar":
 * - Regenera 5 colores nuevos y re-renderiza la cuadrícula.
 */
generateBtnEl.addEventListener('click', () => {
  renderPalette(5);
});

/* Inicio                         */

/**
 * Al cargar el DOM:
 * - Renderizamos los 5 colores iniciales (requisito 1).
 */
document.addEventListener('DOMContentLoaded', () => {
  renderPalette(5);
});