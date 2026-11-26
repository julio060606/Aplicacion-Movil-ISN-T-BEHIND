/**
 * =========================================================================
 * src/config/sceneConfig.ts
 * =========================================================================
 * FUENTE DE VERDAD ÚNICA PARA LA ESCENA HORIZONTAL (FIGMA 1049 × 484 px).
 *
 * Limpiada de sprites antiguos para la nueva arquitectura horizontal.
 * =========================================================================
 */

import { ImageSourcePropType } from 'react-native';

export {
  FIGMA_CANVAS_WIDTH,
  FIGMA_CANVAS_HEIGHT,
  FIGMA_OFFSET_X,
  FIGMA_OFFSET_Y,
  SHOW_REFERENCE_COLOR_BOXES,
  SHOW_TOGGLE_HITBOXES,
  ENABLE_SCREEN_FILTER,
  SCREEN_FILTER_COLOR,
  FORCE_COLOR_BOXES,
  COLOR_ZONES,
  TOGGLE_BUTTONS,
  type IColorZone,
  type IToggleButtonConfig,
} from './viewportConfig';

export type SpriteBehavior =
  | 'static'
  | 'tappable'
  | 'pannable'
  | 'carousel'
  | 'shadow';

export interface IPanConfig {
  maxTranslateX: number;
  maxTranslateY: number;
  snapOnRelease?: boolean;
  snapPositions?: number[];
  resetOnFastSwipe?: boolean;
}

export interface IDrawerConfig {
  openTranslateY: number;
  carouselSlotId: string;
  items: readonly string[];
}

export interface ISceneElement {
  id: string;
  spriteKey: string | null;
  label: string;
  figmaLeft: number;
  figmaTop: number;
  figmaWidth: number;
  figmaHeight: number;
  zIndex: number;
  behavior: SpriteBehavior;
  hasInspectOpacity?: boolean;
  rotate?: string;
  fallbackColor: string;
  fallbackBorderColor?: string;
  shadowColor?: string;
  panConfig?: IPanConfig;
  drawerConfig?: IDrawerConfig;
  opensOverlay?: 'monitor' | 'caja-registradora' | 'apuntar';
}

/**
 * DICCIONARIO LIMPIO DE SPRITES.
 * Listo para recibir los nuevos assets de la pantalla horizontal.
 */
export const SPRITE_ASSETS: Record<string, ImageSourcePropType> = {};

// ── Posiciones retrocompatibles para hooks mientras se rediseñan ──────────────
export const MONITOR_OVERLAY = { x: 0, y: 0, w: 0, h: 0 } as const;
export const CAJA_OVERLAY    = { x: 0, y: 0, w: 0, h: 0 } as const;
export const APUNTAR_OVERLAY = { x: 0, y: 0, w: 0, h: 0 } as const;
export const PC_ABIERTO_METRICS = { left: 0, top: 0, width: 0, height: 0 } as const;
export const PANTALLA_NEGRA_METRICS = { left: 0, top: 0, width: 0, height: 0 } as const;
export const CAJA_POSICION2_METRICS = { left: 0, top: 0, width: 0, height: 0, zIndex: 50 } as const;

/**
 * ELEMENTOS ADAPTADOS DE LA NUEVA ESCENA HORIZONTAL.
 * Vacío inicialmente hasta definir los nuevos elementos.
 */
export const ADAPTED_ELEMENTS: ISceneElement[] = [];
