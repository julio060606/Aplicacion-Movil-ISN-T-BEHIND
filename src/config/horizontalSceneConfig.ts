/**
 * =========================================================================
 * src/config/horizontalSceneConfig.ts
 * =========================================================================
 * CONFIGURACIÓN DE ESCENA HORIZONTAL (1049 × 484 px) DERIVADA DE FIGMA TO CODE.
 *
 * Canvas Total Figma: 1653 × 677 px
 * Viewport Pantalla Juego: 1049 × 484 px
 * Origen de Pantalla (OFFSET):
 *   OFFSET_X = 313 px
 *   OFFSET_Y = 69 px
 * =========================================================================
 */

import { ImageSourcePropType } from 'react-native';

export const HORIZONTAL_VIEWPORT = {
  width: 1049,
  height: 484,
  offsetX: 313,
  offsetY: 69,
  leftDivision55Width: 577, // 55% del ancho activo
  rightDivision45Width: 471, // 45% del ancho activo
} as const;

/**
 * Diccionario de Sprites de la Pantalla Horizontal (en src/assets/sprites/)
 */
export const HORIZONTAL_SPRITES: Record<string, ImageSourcePropType> = {
  suelo: require('../assets/sprites/SUELO.png'),
  mesa: require('../assets/sprites/MESA.png'),
  contadorDinero: require('../assets/sprites/CONTADOR DINERO.png'),
  slot1: require('../assets/sprites/SLOT 1.png'),
  slot2: require('../assets/sprites/SLOT 2.png'),
  scanner: require('../assets/sprites/SCANNER.png'),
  bolsa: require('../assets/sprites/bolsa aca se jalara sacar la bolsa.png'),
  telaMesa: require('../assets/sprites/TELA mesa de trabajo.png'),
  recuadroRefIzquierda: require('../assets/sprites/RECUADRO ref izquierda.png'),
  recuadroRefDerecha: require('../assets/sprites/RECUADRO ref derecha.png'),
  fichaObjeto: require('../assets/sprites/FICHA objeto carrusel.png'),
  cajon: require('../assets/sprites/cajon.png'),
  caja: require('../assets/sprites/CAJA.png'),
  cliente: require('../assets/sprites/cliente.png'),
  pc: require('../assets/sprites/PC.png'),
  pcAbierta: require('../assets/sprites/PC ABIERTA.png'),
  pantallaPcAbierta: require('../assets/sprites/PANTALLA PC ABIERTA.png'),
  efecto1: require('../assets/sprites/EFECTO 1 mide lo de la pantalla.png'),
  efecto2: require('../assets/sprites/EFECTO 2 mide lo de la pantalla.png'),
  div55: require('../assets/sprites/no se debe mostrar DIVIDIR PANTALLA IZQUIERDA 55%.png'),
  div45: require('../assets/sprites/no se debe mostrar DIVIDIR PANTALLADERECHA 45%.png'),
};

/**
 * Coordenadas directas de Figma to Code.
 * left y top son los valores directos del HTML de Figma.
 */
export const FIGMA_ELEMENTS = {
  suelo: {
    width: 605, height: 553, left: 890, top: 0, zIndex: 1,
  },
  mesa: {
    width: 1232, height: 410, left: 221, top: 220, zIndex: 5,
  },
  cliente: {
    width: 434, height: 262, left: 915, top: 41, zIndex: 8, // Adelante de la mesa
  },
  telaMesa: {
    width: 576, height: 457, left: 325, top: 220, zIndex: 9,
  },
  contadorDinero: {
    width: 114, height: 105, left: 1223, top: 17, zIndex: 14,
  },
  slot1: {
    width: 131, height: 141, left: 689, top: 74, zIndex: 15,
  },
  slot2: {
    width: 130, height: 141, left: 554, top: 74, zIndex: 15,
  },
  scanner: {
    width: 130, height: 128, left: 825, top: 98, zIndex: 16,
  },
  bolsa: {
    width: 57, height: 81, left: 977, top: 526, zIndex: 12,
  },
  recuadroRefIzquierda: {
    width: 408, height: 307, left: 441, top: 233, zIndex: 18,
  },
  recuadroRefDerecha: {
    width: 238, height: 204, left: 956, top: 303, zIndex: 18,
  },
  efecto2: {
    width: 1048, height: 482, left: 314, top: 69, zIndex: 25,
  },
  efecto1: {
    width: 1048, height: 484, left: 313, top: 69, zIndex: 26,
  },
  fichaObjeto: {
    width: 364, height: 365, left: 463, top: 183, zIndex: 30,
  },
  caja: {
    width: 364, height: 226, left: 0, top: 84, zIndex: 50, // Interactiva superior
  },
  cajon: {
    width: 364, height: 200, left: 0, top: 326, zIndex: 55, // Interactiva superior
  },
  pc: {
    width: 468, height: 519, left: 1185, top: 98, zIndex: 60, // Interactiva superior
  },
  pcAbierta: {
    width: 375, height: 420, left: 1044, top: 122, zIndex: 100, // Primer plano modal
  },
  pantallaPcAbierta: {
    width: 238, height: 185, left: 1088, top: 182, zIndex: 101, // Primer plano modal
  },
} as const;

/**
 * Convierte coordenadas Figma a coordenadas locales relativas al viewport de 1049 × 484 px.
 */
export const toScreenCoords = (
  figma: { width: number; height: number; left: number; top: number },
  scale: number
) => {
  const relLeft = figma.left - HORIZONTAL_VIEWPORT.offsetX;
  const relTop = figma.top - HORIZONTAL_VIEWPORT.offsetY;

  return {
    left: Math.round(relLeft * scale),
    top: Math.round(relTop * scale),
    width: Math.round(figma.width * scale),
    height: Math.round(figma.height * scale),
  };
};
