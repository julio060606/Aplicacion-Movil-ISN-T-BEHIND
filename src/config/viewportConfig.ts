// src/config/viewportConfig.ts
/**
 * ============================================================================
 * TABLERO DE CONTROL MAESTRO: RESOLUCIÓN Y ESCALA HORIZONTAL (1049 × 484 px)
 * ============================================================================
 * 
 * Configuración oficial para el nuevo lienzo horizontal del juego.
 */

export interface IColorZone {
  id: string;
  label: string;
  left?: number;
  top: number;
  width?: number;
  height: number;
  bg: string;
  border: string;
}

export interface IToggleButtonConfig {
  id: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
}

// ── 1. DIMENSIONES DEL LIENZO DE FIGMA HORIZONTAL ────────────────────────────
/**
 * Ancho canónico de diseño en horizontal (Figma): 1049 px
 */
export const FIGMA_CANVAS_WIDTH = 1049;

/**
 * Alto canónico de diseño en horizontal (Figma): 484 px
 */
export const FIGMA_CANVAS_HEIGHT = 484;

/**
 * Offsets globales de Figma (Punto de origen [0,0] del escenario horizontal).
 */
export const FIGMA_OFFSET_X = 0;
export const FIGMA_OFFSET_Y = 0;

// ── 2. COLOR BOXES Y REFERENCIAS (PREPARADOS PARA ZONIFICACIÓN 40% / 60%) ────
export const COLOR_ZONES: readonly IColorZone[] = [
  {
    id: 'zona-privada-40',
    label: 'ZONA PRIVADA / MESA Y CAJÓN (40% - 419.6px)',
    left: 0,
    top: 0,
    width: 419.6,
    height: 484,
    bg: 'rgba(46, 134, 193, 0.15)',
    border: 'rgba(46, 134, 193, 0.60)',
  },
  {
    id: 'zona-publica-60',
    label: 'ZONA PÚBLICA / VENTANILLA Y PC (60% - 629.4px)',
    left: 419.6,
    top: 0,
    width: 629.4,
    height: 484,
    bg: 'rgba(213, 147, 49, 0.15)',
    border: 'rgba(213, 147, 49, 0.60)',
  },
] as const;

// ── 3. BOTONES DE INTERACCIÓN / TOGGLES ──────────────────────────────────────
export const TOGGLE_BUTTONS: readonly IToggleButtonConfig[] = [];

// ── 4. FLAGS DE DEPURACIÓN VISUAL ───────────────────────────────────────────
export const SHOW_REFERENCE_COLOR_BOXES = true;
export const SHOW_TOGGLE_HITBOXES = false;
export const FORCE_COLOR_BOXES = false;
export const ENABLE_SCREEN_FILTER = false;
export const SCREEN_FILTER_COLOR = '#1A2A3A';
