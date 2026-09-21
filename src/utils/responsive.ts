// src/utils/responsive.ts
import { Dimensions, PixelRatio } from 'react-native';

/**
 * Dimensiones base de referencia oficiales de Figma (412 x 873.5)
 */
const BASE_WIDTH = 412;
const BASE_HEIGHT = 873.5;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Lienzo panorámico de Figma y offsets
 */
export const FIGMA_CANVAS = {
  WIDTH: 1067,
  HEIGHT: 873.5,
  PHONE_WIDTH: 412,
  PHONE_HEIGHT: 873.5,
  PHONE_OFFSET_X: 327,
};

/**
 * Escala vertical unificada para mantener la altura al 100% (Vertical Lock)
 */
export const UNIFORM_SCALE = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * Helpers para traducir coordenadas exactas de Figma a la pantalla del dispositivo
 */
export const figmaX = (canvasX: number): number => {
  return Math.round((canvasX - FIGMA_CANVAS.PHONE_OFFSET_X) * UNIFORM_SCALE);
};

export const figmaY = (canvasY: number): number => {
  return Math.round(canvasY * UNIFORM_SCALE);
};

export const figmaW = (width: number): number => {
  return Math.round(width * UNIFORM_SCALE);
};

export const figmaH = (height: number): number => {
  return Math.round(height * UNIFORM_SCALE);
};

/**
 * =========================================================================
 * NUEVA ARQUITECTURA 2.5D (FIGMA 1962 x 3168 - VIEWPORT 646 x 1456)
 * =========================================================================
 * - Viewport anclado en: left: 619px, top: 748px
 * - Relación de aspecto: 646 / 1456 (~0.4436, equivalente a 15cm x 6.7cm)
 */
export const FIGMA_25D = {
  CANVAS_WIDTH: 1926,
  CANVAS_HEIGHT: 1456,
  VIEWPORT_WIDTH: 646,
  VIEWPORT_HEIGHT: 1456,
  OFFSET_X: 619,
  OFFSET_Y: 0,
};

export const f25dScale = SCREEN_HEIGHT / FIGMA_25D.VIEWPORT_HEIGHT;

export const f25dX = (canvasX: number): number => {
  return Math.round((canvasX - FIGMA_25D.OFFSET_X) * f25dScale);
};

export const f25dY = (canvasY: number): number => {
  return Math.round((canvasY - FIGMA_25D.OFFSET_Y) * f25dScale);
};

export const f25dW = (width: number): number => {
  return Math.round(width * f25dScale);
};

export const f25dH = (height: number): number => {
  return Math.round(height * f25dScale);
};

/**
 * Escala horizontal proporcional basada en el ancho del dispositivo
 */
export const scale = (size: number): number => {
  const currentRatio = SCREEN_WIDTH / BASE_WIDTH;
  const clampedRatio = Math.min(Math.max(currentRatio, 0.75), 1.5);
  return Math.round(PixelRatio.roundToNearestPixel(size * clampedRatio));
};

/**
 * Escala vertical proporcional basada en el alto del dispositivo
 */
export const verticalScale = (size: number): number => {
  const currentRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  const clampedRatio = Math.min(Math.max(currentRatio, 0.75), 1.5);
  return Math.round(PixelRatio.roundToNearestPixel(size * clampedRatio));
};

/**
 * Escala moderada con factor de amortiguación
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isTablet: SCREEN_WIDTH >= 768,
  stageWidth: Math.round(BASE_WIDTH * UNIFORM_SCALE),
  stageHeight: SCREEN_HEIGHT,
  // Ratios clave del diseño 40/60
  counterHeight: Math.round(SCREEN_HEIGHT * 0.4),
  deskHeight: Math.round(SCREEN_HEIGHT * 0.6),
};
