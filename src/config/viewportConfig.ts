// src/config/viewportConfig.ts
/**
 * ============================================================================
 * TABLERO DE CONTROL MAESTRO: RESOLUCIÓN, ESCALA Y COLOR BOXES (FIGMA 2.5D)
 * ============================================================================
 * 
 * 🎮 ESTE ES EL ARCHIVO QUE DEBES EDITAR PARA REAJUSTAR LA PANTALLA.
 * 
 * Modifica libremente los valores aquí; el motor del juego, la cámara 2.5D
 * y los sprites se adaptarán automáticamente sin romper ningún código.
 */

export interface IColorZone {
  id: string;
  label: string;
  top: number;       // Posición Y en píxeles de Figma
  height: number;    // Altura en píxeles de Figma
  bg: string;        // Color de relleno (RGBA)
  border: string;    // Color de borde de referencia (RGBA o HEX)
}

// ── 1. DIMENSIONES DEL LIENZO DE FIGMA ──────────────────────────────────────
/**
 * Ancho total de la pantalla / Viewport en Figma.
 * Valor actual según tu diseño: 414 px
 */
export const FIGMA_CANVAS_WIDTH = 414;

/**
 * Alto total del marco de la pantalla en Figma.
 * - Tu contenedor HTML de Color Boxes suma: 883.17 px (91.64 + 319.85 + 167 + 307)
 * - Si deseas probar con 788.83 px, simplemente cambia este valor.
 */
export const FIGMA_CANVAS_HEIGHT = 883.17;

/**
 * Offsets globales de Figma (Punto de origen [0,0] del escenario).
 * Si tus capas en Figma empiezan directamente en Left: 0, Top: 0, déjalos en 0.
 * Si están dentro de un lienzo más grande, coloca aquí la coordenada inicial.
 */
export const FIGMA_OFFSET_X = 469;
export const FIGMA_OFFSET_Y = 475.83;

// ── 2. COLOR BOXES DE REFERENCIA (SECCIONES DE PANTALLA) ────────────────────
/**
 * Las 4 zonas oficiales de la ventanilla y mesa de inspección de la garita.
 * Se dibujan en pantalla para que calibres visualmente la alineación.
 */
export const COLOR_ZONES: readonly IColorZone[] = [
  {
    id: 'A-superior',
    label: 'A SUPERIOR (ROJO - 91.64px)',
    top: 0,
    height: 91.64,
    bg: 'rgba(213.32, 4.92, 4.92, 0.30)',
    border: 'rgba(213.32, 4.92, 4.92, 0.70)',
  },
  {
    id: 'A-inferior',
    label: 'A INFERIOR (AMARILLO - 319.85px)',
    top: 90.73,
    height: 319.85,
    bg: 'rgba(182.91, 147.27, 49.25, 0.30)',
    border: 'rgba(182.91, 147.27, 49.25, 0.70)',
  },
  {
    id: 'B-superior',
    label: 'B SUPERIOR (CELESTE - 167px)',
    top: 410.17,
    height: 167,
    bg: 'rgba(51.08, 173.21, 181.93, 0.30)',
    border: 'rgba(51.08, 173.21, 181.93, 0.70)',
  },
  {
    id: 'B-inferior',
    label: 'B INFERIOR (AZUL - 307px)',
    top: 576.17,
    height: 307,
    bg: 'rgba(2.04, 12.73, 66.20, 0.30)',
    border: 'rgba(2.04, 12.73, 66.20, 0.70)',
  },
] as const;

// ── 3. BOTONES DE INTERACCIÓN / TOGGLES (FIGMA 2.5D) ────────────────────────
export interface IToggleButtonConfig {
  id: string;
  label: string;
  left: number;     // Coordenada X relativa a la pantalla en Figma (origen Color Boxes)
  top: number;      // Coordenada Y relativa a la pantalla en Figma (origen Color Boxes)
  width: number;
  height: number;
  color: string;
}

/**
 * Zonas táctiles oficiales definidas en Figma "TOGGLE BOTONS"
 * Origen de pantalla en el canvas de Figma: X = 340, Y = 4.83
 */
export const TOGGLE_BUTTONS: readonly IToggleButtonConfig[] = [
  { id: 'toggle-roll-door', label: 'ROLL-DOOR', left: -340, top: -4.83, width: 1082, height: 96, color: 'rgba(20.70, 168.20, 64.95, 0.45)' },
  { id: 'toggle-telefono',  label: 'TELÉFONO',  left: -8,   top: 104.17, width: 40,   height: 157, color: 'rgba(115.13, 133.88, 53.55, 0.45)' },
  { id: 'toggle-gas',       label: 'GAS',       left: 320,  top: 270.17, width: 170,  height: 220, color: 'rgba(126.03, 17.93, 118.82, 0.45)' },
  { id: 'toggle-pc',        label: 'PC',        left: -150, top: 276.17, width: 208,  height: 290, color: 'rgba(74.05, 74.05, 74.05, 0.45)' },
  { id: 'toggle-med',       label: 'MED',       left: 58,   top: 369.17, width: 42,   height: 83,  color: 'rgba(109.36, 24.82, 24.82, 0.45)' },
  { id: 'toggle-cajon-1',   label: 'CAJÓN 1',   left: -69,  top: 602.17, width: 162,  height: 126, color: 'rgba(109.36, 24.82, 24.82, 0.45)' },
  { id: 'toggle-cajon-2',   label: 'CAJÓN 2',   left: -69,  top: 743.17, width: 162,  height: 126, color: 'rgba(109.36, 24.82, 24.82, 0.45)' },
  { id: 'toggle-caja',      label: 'CAJA',      left: 100,  top: 592.17, width: 277,  height: 145.50, color: 'rgba(18.63, 35.72, 121.13, 0.45)' },
] as const;

// ── 4. TOGGLES VISUALES DE DESARROLLO ───────────────────────────────────────
/**
 * true  → Muestra las franjas de colores (A superior, A inferior, etc.) sobre la escena.
 * false → Oculta las franjas para ver el juego normal.
 */
export const SHOW_REFERENCE_COLOR_BOXES = false;

/**
 * true  → Muestra los rectángulos de los botones de interacción (TOGGLE BOTONS) para depuración.
 * false → Los botones son invisibles y responden normalmente a las pulsaciones.
 */
export const SHOW_TOGGLE_HITBOXES = false;

/**
 * true  → Muestra todos los sprites como cajas de depuración.
 * false → Muestra los gráficos e imágenes reales de los sprites.
 */
export const FORCE_COLOR_BOXES = false;

/**
 * true  → Aplica el filtro atmosférico retro/azul sobre la pantalla.
 */
export const ENABLE_SCREEN_FILTER = true;
export const SCREEN_FILTER_COLOR = 'rgba(52, 73, 94, 0.30)';
