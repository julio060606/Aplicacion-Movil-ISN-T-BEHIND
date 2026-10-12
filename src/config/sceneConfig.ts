/**
 * =========================================================================
 * src/config/sceneConfig.ts
 * =========================================================================
 * FUENTE DE VERDAD ÚNICA para toda la escena visual del turno.
 *
 * SISTEMA DE COORDENADAS:
 *   - Canvas Figma total: 1926 × 1793 px
 *   - Viewport de la pantalla: 646 × 1456 px
 *   - OFFSET_X = 619 (el canvas empieza en x=619 del Figma)
 *   - OFFSET_Y = 239 (el canvas empieza en y=239 del Figma, tope zona roja)
 *
 * FÓRMULA DE CONVERSIÓN (aplicada en GameSprite.tsx, NO aquí):
 *   screenLeft   = (figmaLeft - OFFSET_X) * scale
 *   screenTop    = (figmaTop  - OFFSET_Y) * scale
 *   screenWidth  = figmaWidth  * scale
 *   screenHeight = figmaHeight * scale
 *   scale        = windowHeight / FIGMA_CANVAS_HEIGHT   (= windowHeight / 1456)
 *
 * REGLA PRINCIPAL:
 *   Si mañana el artista mueve un sprite en Figma, SOLO se toca este archivo.
 *   Los componentes React no saben nada de píxeles.
 * =========================================================================
 */

import { ImageSourcePropType } from 'react-native';

// ── Importar y re-exportar configuración desde el Tablero Maestro (viewportConfig) ──
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

// ── Posiciones de overlays (estado "abierto", OFFSET_Y=0 para overlays) ──────
export const MONITOR_OVERLAY = { x: 48,  y: 309, w: 551, h: 665 } as const;
export const CAJA_OVERLAY    = { x: 54,  y: 360, w: 540, h: 917 } as const;
export const APUNTAR_OVERLAY = { x: 234, y: 506, w: 594, h: 950 } as const;

// ── Métricas oficiales de PC ABIERTO y Pantalla Negra (Figma) ─────────────────
// Origen Color Boxes en este lienzo (1740x1741): X = 660, Y = 522.83
export const PC_ABIERTO_METRICS = {
  left:   -660,
  top:    -522.83,
  width:  1740,
  height: 1741,
} as const;

export const PANTALLA_NEGRA_METRICS = {
  left:   55,       // 715 - 660
  top:    241.17,   // 764 - 522.83
  width:  298,
  height: 225,
} as const;

// ── Métricas oficiales de Caja de Cartón Posición 2 (Figma) ──────────────────
export const CAJA_POSICION2_METRICS = {
  left:   89,
  top:    679.17,
  width:  307,
  height: 229,
  zIndex: 50,       // "este se pone por encima de todo"
} as const;

// ── Comportamientos posibles de un elemento ──────────────────────────────────
export type SpriteBehavior =
  | 'static'       // Solo se renderiza, sin interacción
  | 'tappable'     // Responde a un tap simple
  | 'pannable'     // Responde a arrastre (PanResponder)
  | 'carousel'     // Es el slot activo de un carrusel (cambia su sprite)
  | 'shadow';      // Es un div de sombra (View con color, sin imagen)

// ── Contrato de un elemento de escena ────────────────────────────────────────
export interface IPanConfig {
  /** Máximo desplazamiento horizontal permitido, en px del canvas Figma */
  maxTranslateX: number;
  /** Máximo desplazamiento vertical permitido, en px del canvas Figma */
  maxTranslateY: number;
  /** true → al soltar snappa al valor más cercano de snapPositions */
  snapOnRelease?: boolean;
  /** Posiciones de snap en px Figma (ej: [0, 478] para la persiana) */
  snapPositions?: number[];
  /** true → swipe rápido horizontal resetea al origen */
  resetOnFastSwipe?: boolean;
}

export interface IDrawerConfig {
  /** Cuánto baja el cajón al abrirse, en px del canvas Figma (el hook aplica * scale) */
  openTranslateY: number;
  /** ID del ISceneElement que actúa como slot visual del carrusel del cajón */
  carouselSlotId: string;
  /** Claves de SPRITE_ASSETS que se pueden mostrar en este cajón */
  items: readonly string[];
}

export interface ISceneElement {
  /** Identificador único. NUNCA cambiar sin actualizar ShiftScreen también. */
  id: string;
  /** Clave del sprite en SPRITE_ASSETS. null = solo fallback de color. */
  spriteKey: string | null;
  /** Texto de debug para el fallback de Color Box */
  label: string;
  /** Coordenada X en el canvas Figma ORIGINAL (antes del offset) */
  figmaLeft: number;
  /** Coordenada Y en el canvas Figma ORIGINAL (antes del offset) */
  figmaTop: number;
  figmaWidth: number;
  figmaHeight: number;
  zIndex: number;
  behavior: SpriteBehavior;
  /** Si se opaca al 30% durante la inspección táctil del PanResponder */
  hasInspectOpacity?: boolean;
  /** Rotación CSS (ej: '180deg') */
  rotate?: string;
  /** Color de fondo del fallback (debug) */
  fallbackColor: string;
  fallbackBorderColor?: string;
  /** Solo para behavior='shadow': color del View de sombra */
  shadowColor?: string;
  /**
   * Configuración de arrastre (behavior: 'pannable').
   * Los hooks leen estos valores y aplican * scale internamente.
   * Si el diseñador cambia los límites → solo se toca aquí.
   */
  panConfig?: IPanConfig;
  /**
   * Configuración de cajón con carrusel (behavior: 'tappable').
   * useDrawers.ts lee esta config para generar el Animated.Value correcto.
   */
  drawerConfig?: IDrawerConfig;
  /**
   * Qué overlay abre este elemento al ser tapeado.
   * useOverlays.ts usa este campo para el dispatch correcto.
   */
  opensOverlay?: 'monitor' | 'caja-registradora' | 'apuntar';
}


export const SPRITE_ASSETS: Record<string, ImageSourcePropType> = {
  // Sprites Fase 2 (Nombres estandarizados en minúsculas)
  'caja_carton':              require('../assets/sprites/caja_carton.webp'),
  'caja-carton':              require('../assets/sprites/caja_carton.webp'),
  'caja_posicion2':           require('../assets/sprites/caja_posicion2.webp'),
  'cajon1_abierto_completo':  require('../assets/sprites/cajon1_abierto_completo.webp'),
  'cajon1_abierto_mitad':     require('../assets/sprites/cajon1_abierto_mitad.webp'),
  'cajon2_abierto_completo':  require('../assets/sprites/cajon2_abierto_completo.webp'),
  'cajon2_abierto_mitad':     require('../assets/sprites/cajon2_abierto_mitad.webp'),
  'cajones':                  require('../assets/sprites/cajones.webp'),
  'cajon-1':                  require('../assets/sprites/cajones.webp'),
  'cajon-2':                  require('../assets/sprites/cajones.webp'),
  'gasolina':                 require('../assets/sprites/gasolina.webp'),
  'latas1_fase2':             require('../assets/sprites/latas1_fase2.webp'),
  'latas-fase-2':             require('../assets/sprites/latas1_fase2.webp'),
  'latas2':                   require('../assets/sprites/latas2.webp'),
  'latas-2':                  require('../assets/sprites/latas2.webp'),
  'medicina':                 require('../assets/sprites/medicina.webp'),
  'pildoras':                 require('../assets/sprites/medicina.webp'),
  'mesa':                     require('../assets/sprites/mesa.webp'),
  'mesa-plataforma':          require('../assets/sprites/mesa.webp'),
  'papeles':                  require('../assets/sprites/papeles.webp'),
  'pc':                       require('../assets/sprites/pc.webp'),
  'pc_abierto':               require('../assets/sprites/pc_abierto.webp'),
  'pantalla_negra':           require('../assets/sprites/pantalla_negra.webp'),
  'roll-up_door':             require('../assets/sprites/roll-up_door.webp'),
  'roll-up-door':             require('../assets/sprites/roll-up_door.webp'),
  'telefono':                 require('../assets/sprites/telefono.webp'),
  'valla_metal':              require('../assets/sprites/valla_metal.webp'),
  'valla-metal':              require('../assets/sprites/valla_metal.webp'),
  'rejilla':                  require('../assets/sprites/valla_metal.webp'),
};

/**
 * =========================================================================
 * ADAPTED_ELEMENTS — La escena completa en coordenadas Figma ORIGINALES.
 *
 * Usa SIEMPRE las coordenadas del canvas de Figma (left, top del HTML exportado).
 * El componente GameSprite aplica la fórmula de offset y escala automáticamente.
 *
 * Orden de la lista = orden de renderizado (zIndex es el desempate).
 * =========================================================================
 */
export const ADAPTED_ELEMENTS: ISceneElement[] = [
  // ── 0. NPC / VISITANTE (Detrás de la ventanilla) ──────────────────────────
  {
    id: 'npc-1', spriteKey: 'npc-1', label: 'VISITANTE NPC',
    figmaLeft: 469, figmaTop: 476, figmaWidth: 414, figmaHeight: 410,
    zIndex: 13, behavior: 'static',
    fallbackColor: 'rgba(30,41,59,0.85)', fallbackBorderColor: '#475569',
  },

  // ── 1. CAJA DE CARTÓN ─────────────────────────────────────────────────────
  {
    id: 'caja-carton', spriteKey: 'caja_carton', label: 'CAJA CARTON',
    figmaLeft: 569, figmaTop: 1010, figmaWidth: 277, figmaHeight: 204,
    zIndex: 8, behavior: 'tappable',
    fallbackColor: 'rgba(120,53,15,0.65)', fallbackBorderColor: '#b45309',
  },

  // ── 2. CAJONES ────────────────────────────────────────────────────────────
  {
    id: 'cajones', spriteKey: 'cajones', label: 'CAJONES',
    figmaLeft: 353, figmaTop: 1061, figmaWidth: 209, figmaHeight: 280,
    zIndex: 10, behavior: 'tappable',
    fallbackColor: 'rgba(29,78,216,0.70)', fallbackBorderColor: '#60a5fa',
  },

  // ── 3. MESA ───────────────────────────────────────────────────────────────
  {
    id: 'mesa', spriteKey: 'mesa', label: 'MESA PRINCIPAL',
    figmaLeft: 111, figmaTop: 879, figmaWidth: 997, figmaHeight: 644,
    zIndex: 12, behavior: 'static',
    fallbackColor: 'rgba(180,83,9,0.60)', fallbackBorderColor: '#d97706',
  },

  // ── 4. VALLA METAL / REJILLA ──────────────────────────────────────────────
  {
    id: 'valla-metal', spriteKey: 'valla_metal', label: 'VALLA METAL',
    figmaLeft: 11, figmaTop: 322, figmaWidth: 1330, figmaHeight: 564,
    zIndex: 14, behavior: 'static',
    fallbackColor: 'rgba(71,85,105,0.45)', fallbackBorderColor: '#94a3b8',
  },

  // ── 5. ROLL-UP DOOR (Persiana perimetral) ─────────────────────────────────
  // Límite fijado en el fin de la zona inferior A (410.17 px Figma)
  {
    id: 'roll-up-door', spriteKey: 'roll-up_door', label: 'ROLL-UP DOOR',
    figmaLeft: 0, figmaTop: 0, figmaWidth: 1352, figmaHeight: 567,
    zIndex: 16, behavior: 'pannable',
    fallbackColor: 'rgba(15,23,42,0.70)', fallbackBorderColor: '#475569',
    panConfig: {
      maxTranslateX: 0,
      maxTranslateY: 410.17,
      snapOnRelease: true,
      snapPositions: [0, 410.17],
    },
  },

  // ── 6. MEDICINA ───────────────────────────────────────────────────────────
  {
    id: 'medicina', spriteKey: 'medicina', label: 'MEDICINA',
    figmaLeft: 507, figmaTop: 848, figmaWidth: 55, figmaHeight: 77,
    zIndex: 18, behavior: 'static',
    fallbackColor: 'rgba(239,68,68,0.70)', fallbackBorderColor: '#f87171',
  },

  // ── 7. TERMINAL PC ────────────────────────────────────────────────────────
  {
    id: 'pc', spriteKey: 'pc', label: 'PC TERMINAL',
    figmaLeft: 319, figmaTop: 752, figmaWidth: 250, figmaHeight: 326,
    zIndex: 20, behavior: 'tappable',
    fallbackColor: 'rgba(15,23,42,0.85)', fallbackBorderColor: '#00ff66',
    opensOverlay: 'monitor',
  },

  // ── 8. LATAS 2 ───────────────────────────────────────────────────────────
  {
    id: 'latas-2', spriteKey: 'latas2', label: 'LATAS 2',
    figmaLeft: 802, figmaTop: 837, figmaWidth: 144, figmaHeight: 158,
    zIndex: 22, behavior: 'static',
    fallbackColor: 'rgba(55,65,81,0.65)', fallbackBorderColor: '#6b7280',
  },

  // ── 9. TELÉFONO ───────────────────────────────────────────────────────────
  {
    id: 'telefono', spriteKey: 'telefono', label: 'TELÉFONO',
    figmaLeft: 463, figmaTop: 580, figmaWidth: 38, figmaHeight: 157,
    zIndex: 23, behavior: 'static',
    fallbackColor: 'rgba(217,119,6,0.65)', fallbackBorderColor: '#f59e0b',
  },

  // ── 10. GASOLINA ──────────────────────────────────────────────────────────
  {
    id: 'gasolina', spriteKey: 'gasolina', label: 'GASOLINA',
    figmaLeft: 789, figmaTop: 746, figmaWidth: 170, figmaHeight: 220,
    zIndex: 24, behavior: 'static',
    fallbackColor: 'rgba(185,28,28,0.70)', fallbackBorderColor: '#ef4444',
  },

  // ── 11. LATAS FASE 2 ──────────────────────────────────────────────────────
  {
    id: 'latas-fase-2', spriteKey: 'latas1_fase2', label: 'LATAS FASE 2',
    figmaLeft: 802, figmaTop: 837, figmaWidth: 144, figmaHeight: 158,
    zIndex: 25, behavior: 'static',
    fallbackColor: 'rgba(55,65,81,0.65)', fallbackBorderColor: '#6b7280',
  },

  // ── 12. PAPELES (Más adelante en mesa) ────────────────────────────────────
  {
    id: 'papeles', spriteKey: 'papeles', label: 'PAPELES',
    figmaLeft: 847, figmaTop: 966, figmaWidth: 180, figmaHeight: 88,
    zIndex: 26, behavior: 'static',
    fallbackColor: 'rgba(254,242,242,0.60)', fallbackBorderColor: '#fca5a5',
  },
];

