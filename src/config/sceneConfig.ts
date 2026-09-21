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

// ── Constantes del sistema de coordenadas ────────────────────────────────────
export const FIGMA_CANVAS_WIDTH  = 646;
export const FIGMA_CANVAS_HEIGHT = 1456;
export const FIGMA_OFFSET_X      = 619;
export const FIGMA_OFFSET_Y      = 239;

// ── Toggles de desarrollo ────────────────────────────────────────────────────
/** true → muestra las 4 franjas de Color Box para verificar alineaciones */
export const SHOW_REFERENCE_COLOR_BOXES = true;
/** true → activa el filtro atmosférico diegético sobre la escena */
export const ENABLE_SCREEN_FILTER       = true;
export const SCREEN_FILTER_COLOR        = 'rgba(52, 73, 94, 0.30)';
/** true → fuerza todos los sprites a mostrarse como cajas de color (debug) */
export const FORCE_COLOR_BOXES          = false;

// ── Color Boxes de referencia (del Figma, relativos al canvas 646×1456) ─────
export const COLOR_ZONES = [
  { label: 'ROJO  10.71%',   top: 0,               height: 156, bg: 'rgba(213,5,5,0.28)',    border: 'rgba(213,5,5,0.70)'    },
  { label: 'AMARILLO 32.83%',top: 156,              height: 478, bg: 'rgba(183,147,49,0.28)', border: 'rgba(183,147,49,0.70)' },
  { label: 'CELESTE 22.12%', top: 156 + 478,        height: 322, bg: 'rgba(51,173,182,0.28)', border: 'rgba(51,173,182,0.70)' },
  { label: 'AZUL  34.34%',   top: 156 + 478 + 322,  height: 500, bg: 'rgba(2,13,66,0.28)',    border: 'rgba(2,13,66,0.70)'    },
] as const;

// ── Posiciones de overlays (estado "abierto", OFFSET_Y=0 para overlays) ──────
export const MONITOR_OVERLAY = { x: 48,  y: 309, w: 551, h: 665 } as const;
export const CAJA_OVERLAY    = { x: 54,  y: 360, w: 540, h: 917 } as const;
export const APUNTAR_OVERLAY = { x: 234, y: 506, w: 594, h: 950 } as const;

// ── Ítems de carruseles ───────────────────────────────────────────────────────
export const TABLE_CAROUSEL_ITEMS: readonly string[] = [
  'no-texture', 'leche', 'harina', 'cigarros', 'pildoras', 'latas',
];
export const DRAWER_LEFT_ITEMS:  readonly string[] = ['revolver'];
export const DRAWER_RIGHT_ITEMS: readonly string[] = ['revolver'];

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


// ── Registro de sprites ───────────────────────────────────────────────────────
// NOTA: Los sprites comentados aún no tienen el archivo .webp en assets/sprites/
export const SPRITE_ASSETS: Record<string, ImageSourcePropType> = {
  'suelo':              require('../assets/sprites/suelo.webp'),
  'sombra-debajo-mesa': require('../assets/sprites/sombra-debajo-mesa.webp'),
  'caja-carton':        require('../assets/sprites/caja-carton.webp'),
  'carrusel-caja':      require('../assets/sprites/carrusel-caja.webp'),
  'sombra-caja':        require('../assets/sprites/sombra-caja.webp'),
  'npc-1':              require('../assets/sprites/npc-1.webp'),
  'mesa-abajo-2':       require('../assets/sprites/mesa-abajo-2.webp'),
  'cajon-2':            require('../assets/sprites/cajon-2.webp'),
  'carrusel-cajon-2':   require('../assets/sprites/carrusel-cajon-2.webp'),
  'revolver':           require('../assets/sprites/revolver.webp'),
  'cajon-1':            require('../assets/sprites/cajon-1.webp'),
  'carrusel-cajon-1':   require('../assets/sprites/carrusel-cajon-1.webp'),
  'sombra-cajon-2':     require('../assets/sprites/sombra-cajon-2.webp'),
  'sombra-cajon-1':     require('../assets/sprites/sombra-cajon-1.webp'),
  'mesa-abajo':         require('../assets/sprites/mesa-abajo.webp'),
  'mesa-plataforma':    require('../assets/sprites/mesa-plataforma.webp'),
  'rejilla':            require('../assets/sprites/rejilla.webp'),
  'carrusel-mesa':      require('../assets/sprites/carrusel-mesa.webp'),
  'no-texture':         require('../assets/sprites/no-texture.webp'),
  'leche':              require('../assets/sprites/leche.webp'),
  'harina':             require('../assets/sprites/harina.webp'),
  'roll-up-door':       require('../assets/sprites/roll-up-door.webp'),
  'telefono':           require('../assets/sprites/telefono.webp'),
  'pildoras':           require('../assets/sprites/pildoras.webp'),
  'pc':                 require('../assets/sprites/pc.webp'),
  'cigarros':           require('../assets/sprites/cigarros.webp'),
  'papeles':            require('../assets/sprites/papeles.webp'),
  'latas':              require('../assets/sprites/latas.webp'),
  'lampara-base':       require('../assets/sprites/lampara-base.webp'),
  'lampara-cabeza':     require('../assets/sprites/lampara-cabeza.webp'),
  'caja-registradora':  require('../assets/sprites/caja-registradora.webp'),
  'apuntar':            require('../assets/sprites/apuntar.webp'),
  // Pendientes — descomenta cuando el artista entregue el archivo:
  // 'monitor-1':          require('../assets/sprites/monitor-1.webp'),         // 551×665 px
  // 'registradora-arriba':require('../assets/sprites/registradora-arriba.webp'), // 540×917 px
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
  // ── FONDO / SUELO ────────────────────────────────────────────────────────
  {
    id: 'suelo', spriteKey: 'suelo', label: '19. SUELO',
    figmaLeft: 158, figmaTop: 1261, figmaWidth: 1559, figmaHeight: 532,
    zIndex: 1, behavior: 'static',
    fallbackColor: 'rgba(15,23,42,0.70)', fallbackBorderColor: '#334155',
  },
  {
    id: 'sombra-debajo-mesa', spriteKey: null, label: '18. SOMBRA MESA',
    figmaLeft: 215, figmaTop: 1213, figmaWidth: 1446, figmaHeight: 271,
    zIndex: 2, behavior: 'shadow',
    shadowColor: 'rgba(12,12,12,0.85)',
    fallbackColor: 'rgba(12,12,12,0.85)', fallbackBorderColor: '#1e293b',
  },
  // ── CAJA DE CARTÓN ───────────────────────────────────────────────────────
  {
    id: 'caja-carton', spriteKey: 'caja-carton', label: '17. CAJA CARTÓN',
    figmaLeft: 476, figmaTop: 1213, figmaWidth: 922.45, figmaHeight: 580,
    zIndex: 3, behavior: 'tappable',
    fallbackColor: 'rgba(120,53,15,0.65)', fallbackBorderColor: '#b45309',
  },
  {
    id: 'carrusel-caja', spriteKey: 'carrusel-caja', label: '17.1 CARRUSEL CAJA',
    figmaLeft: 703.23, figmaTop: 1363.45, figmaWidth: 466.46, figmaHeight: 297.78,
    zIndex: 4, behavior: 'static',
    fallbackColor: 'rgba(120,53,15,0.55)', fallbackBorderColor: '#b45309',
  },
  {
    id: 'sombra-caja', spriteKey: null, label: '16. SOMBRA CAJA',
    figmaLeft: 215, figmaTop: 1204, figmaWidth: 1446, figmaHeight: 175,
    zIndex: 5, behavior: 'shadow',
    shadowColor: 'rgba(12,12,12,0.60)',
    fallbackColor: 'rgba(12,12,12,0.60)', fallbackBorderColor: '#1e293b',
  },
  // ── NPC / CLIENTE ────────────────────────────────────────────────────────
  {
    id: 'npc-1', spriteKey: 'npc-1', label: '15. CLIENTE NPC-1',
    figmaLeft: 719, figmaTop: 360, figmaWidth: 490, figmaHeight: 781,
    zIndex: 6, behavior: 'static', hasInspectOpacity: true,
    fallbackColor: 'rgba(30,41,59,0.85)', fallbackBorderColor: '#475569',
  },
  // ── MESA (capas inferiores) ───────────────────────────────────────────────
  {
    id: 'mesa-abajo-2', spriteKey: 'mesa-abajo-2', label: '14.3 MESA DEBAJO 2',
    figmaLeft: 33, figmaTop: 1148, figmaWidth: 1863, figmaHeight: 127,
    zIndex: 7, behavior: 'static',
    fallbackColor: 'rgba(30,58,138,0.55)', fallbackBorderColor: '#1e3a8a',
  },
  // ── CAJONES ──────────────────────────────────────────────────────────────
  {
    id: 'cajon-2', spriteKey: 'cajon-2', label: '14.1 CAJÓN DERECHO',
    figmaLeft: 950, figmaTop: 1210, figmaWidth: 324, figmaHeight: 212,
    zIndex: 8, behavior: 'tappable',
    fallbackColor: 'rgba(29,78,216,0.70)', fallbackBorderColor: '#60a5fa',
    drawerConfig: {
      openTranslateY: 109,        // px Figma que baja el cajón al abrirse
      carouselSlotId: 'carrusel-cajon-2',
      items: ['revolver'],
    },
  },
  {
    id: 'carrusel-cajon-2', spriteKey: 'carrusel-cajon-2', label: '14.1.1 CARRUSEL C-2',
    figmaLeft: 969, figmaTop: 1175, figmaWidth: 286, figmaHeight: 183,
    zIndex: 9, behavior: 'carousel',
    fallbackColor: 'rgba(3,105,161,0.55)', fallbackBorderColor: '#38bdf8',
  },
  {
    id: 'revolver', spriteKey: 'revolver', label: '14.1.2 REVÓLVER',
    figmaLeft: 1006, figmaTop: 1246, figmaWidth: 224, figmaHeight: 77,
    zIndex: 10, behavior: 'static',
    fallbackColor: 'rgba(185,28,28,0.70)', fallbackBorderColor: '#ef4444',
  },
  {
    id: 'cajon-1', spriteKey: 'cajon-1', label: '14. CAJÓN IZQUIERDO',
    figmaLeft: 619, figmaTop: 1210, figmaWidth: 324, figmaHeight: 212,
    zIndex: 11, behavior: 'tappable',
    fallbackColor: 'rgba(29,78,216,0.70)', fallbackBorderColor: '#60a5fa',
    drawerConfig: {
      openTranslateY: 109,        // px Figma que baja el cajón al abrirse
      carouselSlotId: 'carrusel-cajon-1',
      items: ['revolver'],
    },
  },
  {
    id: 'carrusel-cajon-1', spriteKey: 'carrusel-cajon-1', label: '14.0.1 CARRUSEL C-1',
    figmaLeft: 638, figmaTop: 1175, figmaWidth: 286, figmaHeight: 183,
    zIndex: 12, behavior: 'carousel',
    fallbackColor: 'rgba(3,105,161,0.55)', fallbackBorderColor: '#38bdf8',
  },
  {
    id: 'sombra-cajon-2', spriteKey: null, label: '14.2 SOMBRA C-2',
    figmaLeft: 627, figmaTop: 1218, figmaWidth: 304, figmaHeight: 66,
    zIndex: 13, behavior: 'shadow',
    shadowColor: 'rgba(0,0,0,0.70)',
    fallbackColor: 'rgba(0,0,0,0.70)',
  },
  {
    id: 'sombra-cajon-1', spriteKey: null, label: '14.3 SOMBRA C-1',
    figmaLeft: 959, figmaTop: 1218, figmaWidth: 303, figmaHeight: 66,
    zIndex: 14, behavior: 'shadow',
    shadowColor: 'rgba(0,0,0,0.70)',
    fallbackColor: 'rgba(0,0,0,0.70)',
  },
  {
    id: 'mesa-abajo', spriteKey: 'mesa-abajo', label: '13.1 MESA ABAJO',
    figmaLeft: 33, figmaTop: 1145, figmaWidth: 1863, figmaHeight: 60,
    zIndex: 15, behavior: 'static',
    fallbackColor: 'rgba(127,29,29,0.65)', fallbackBorderColor: '#b91c1c',
  },
  // ── MESA PRINCIPAL ────────────────────────────────────────────────────────
  {
    id: 'mesa-plataforma', spriteKey: 'mesa-plataforma', label: '13. MESA PLATAFORMA',
    figmaLeft: 0, figmaTop: 834, figmaWidth: 1926, figmaHeight: 399,
    zIndex: 16, behavior: 'static',
    fallbackColor: 'rgba(180,83,9,0.60)', fallbackBorderColor: '#d97706',
  },
  // ── REJILLA DE SEGURIDAD ─────────────────────────────────────────────────
  {
    id: 'rejilla', spriteKey: 'rejilla', label: '12. REJILLA',
    figmaLeft: 123, figmaTop: 0, figmaWidth: 1683, figmaHeight: 873,
    zIndex: 17, behavior: 'static', hasInspectOpacity: true,
    fallbackColor: 'rgba(71,85,105,0.45)', fallbackBorderColor: '#94a3b8',
  },
  // ── OBJETOS DEL MOSTRADOR ─────────────────────────────────────────────────
  {
    id: 'carrusel-mesa', spriteKey: 'carrusel-mesa', label: '11. CARRUSEL MESA',
    figmaLeft: 739, figmaTop: 880, figmaWidth: 448, figmaHeight: 286,
    zIndex: 18, behavior: 'tappable',
    fallbackColor: 'rgba(2,132,199,0.45)', fallbackBorderColor: '#0284c7',
  },
  {
    id: 'no-texture', spriteKey: 'no-texture', label: '10.2 SLOT ACTIVO CARRUSEL',
    figmaLeft: 815, figmaTop: 901, figmaWidth: 289, figmaHeight: 218,
    zIndex: 19, behavior: 'carousel',
    fallbackColor: 'rgba(217,119,6,0.55)', fallbackBorderColor: '#f59e0b',
  },
  {
    id: 'leche', spriteKey: 'leche', label: '10.1 LECHE',
    figmaLeft: 824, figmaTop: 768, figmaWidth: 119, figmaHeight: 268,
    zIndex: 20, behavior: 'static',
    fallbackColor: 'rgba(241,245,249,0.55)', fallbackBorderColor: '#cbd5e1',
  },
  {
    id: 'harina', spriteKey: 'harina', label: '10. HARINA',
    figmaLeft: 899, figmaTop: 958, figmaWidth: 203.77, figmaHeight: 94.26,
    zIndex: 21, behavior: 'static',
    fallbackColor: 'rgba(226,232,240,0.55)', fallbackBorderColor: '#e2e8f0',
  },
  // ── TELÉFONO ──────────────────────────────────────────────────────────────
  {
    id: 'telefono', spriteKey: 'telefono', label: '08. TELÉFONO',
    figmaLeft: 613, figmaTop: 379, figmaWidth: 121, figmaHeight: 488,
    zIndex: 23, behavior: 'static',
    fallbackColor: 'rgba(217,119,6,0.65)', fallbackBorderColor: '#f59e0b',
  },
  // ── PÍLDORAS ──────────────────────────────────────────────────────────────
  {
    id: 'pildoras', spriteKey: 'pildoras', label: '07. PÍLDORAS C.S.T.',
    figmaLeft: 742, figmaTop: 828, figmaWidth: 54, figmaHeight: 91,
    zIndex: 24, behavior: 'static',
    fallbackColor: 'rgba(239,68,68,0.70)', fallbackBorderColor: '#f87171',
  },
  // ── PC ────────────────────────────────────────────────────────────────────
  {
    id: 'pc', spriteKey: 'pc', label: '06. PC',
    figmaLeft: 317, figmaTop: 608, figmaWidth: 422, figmaHeight: 481,
    zIndex: 25, behavior: 'tappable',
    fallbackColor: 'rgba(15,23,42,0.85)', fallbackBorderColor: '#00ff66',
    opensOverlay: 'monitor',
  },
  // ── MERCANCÍA ─────────────────────────────────────────────────────────────
  {
    id: 'cigarros', spriteKey: 'cigarros', label: '5.2 CIGARROS',
    figmaLeft: 1082, figmaTop: 834, figmaWidth: 125, figmaHeight: 74,
    zIndex: 26, behavior: 'static',
    fallbackColor: 'rgba(100,116,139,0.65)', fallbackBorderColor: '#94a3b8',
  },
  {
    id: 'papeles', spriteKey: 'papeles', label: '5.1 PAPELES',
    figmaLeft: 773, figmaTop: 1157, figmaWidth: 639, figmaHeight: 306,
    zIndex: 27, behavior: 'static', rotate: '180deg',
    fallbackColor: 'rgba(254,242,242,0.60)', fallbackBorderColor: '#fca5a5',
  },
  {
    id: 'latas', spriteKey: 'latas', label: '05. LATAS',
    figmaLeft: 1174, figmaTop: 804, figmaWidth: 331, figmaHeight: 164,
    zIndex: 28, behavior: 'static',
    fallbackColor: 'rgba(55,65,81,0.65)', fallbackBorderColor: '#6b7280',
  },
  // ── LÁMPARA ───────────────────────────────────────────────────────────────
  {
    id: 'lampara-base', spriteKey: 'lampara-base', label: '4.1 LÁMPARA BASE',
    figmaLeft: 1369, figmaTop: 972, figmaWidth: 203, figmaHeight: 75,
    zIndex: 29, behavior: 'static',
    fallbackColor: 'rgba(107,33,168,0.60)', fallbackBorderColor: '#a855f7',
  },
  {
    id: 'lampara-cabeza', spriteKey: 'lampara-cabeza', label: '04. LÁMPARA CABEZA',
    figmaLeft: 1006, figmaTop: 623, figmaWidth: 466, figmaHeight: 319,
    zIndex: 30, behavior: 'pannable',
    fallbackColor: 'rgba(107,33,168,0.65)', fallbackBorderColor: '#c084fc',
    panConfig: {
      maxTranslateX: 80,          // px Figma — límite de arrastre horizontal
      maxTranslateY: 60,          // px Figma — límite de arrastre vertical
      resetOnFastSwipe: true,     // swipe rápido a la derecha → vuelve al centro
    },
  },
  // ── ROLL-UP DOOR (persiana, fuera del viewport, sube desde arriba) ────────
  // Nota: no tiene coordenadas en este Figma export — posición manual
  {
    id: 'roll-up-door', spriteKey: 'roll-up-door', label: '09. ROLL-UP DOOR',
    figmaLeft: 120, figmaTop: -748, figmaWidth: 1686, figmaHeight: 904,
    zIndex: 22, behavior: 'pannable',
    fallbackColor: 'rgba(15,23,42,0.70)', fallbackBorderColor: '#475569',
    panConfig: {
      maxTranslateX: 0,           // solo se mueve verticalmente
      maxTranslateY: 478,         // px Figma — recorrido máximo hacia abajo (zona amarilla)
      snapOnRelease: true,        // snappa a la posición más cercana
      snapPositions: [0, 478],    // 0=cerrada (arriba), 478=abierta (abajo)
    },
  },
];

