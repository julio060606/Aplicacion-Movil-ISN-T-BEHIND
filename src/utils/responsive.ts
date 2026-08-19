// src/utils/responsive.ts
import { Dimensions, PixelRatio } from 'react-native';

/**
 * Dimensiones base de referencia (iPhone 13 / Pixel 5 standard: 390 x 844)
 */
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Escala horizontal proporcional basada en el ancho del dispositivo
 */
export const scale = (size: number): number => {
  const currentRatio = SCREEN_WIDTH / BASE_WIDTH;
  // Clamp entre 0.8 y 1.4 para evitar deformaciones en tablets o pantallas ultra-pequeñas
  const clampedRatio = Math.min(Math.max(currentRatio, 0.8), 1.4);
  return Math.round(PixelRatio.roundToNearestPixel(size * clampedRatio));
};

/**
 * Escala vertical proporcional basada en el alto del dispositivo
 */
export const verticalScale = (size: number): number => {
  const currentRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  const clampedRatio = Math.min(Math.max(currentRatio, 0.8), 1.4);
  return Math.round(PixelRatio.roundToNearestPixel(size * clampedRatio));
};

/**
 * Escala moderada con factor de amortiguación (ideal para padding, márgenes y tipografías)
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isTablet: SCREEN_WIDTH >= 768,
  // Ratios clave del diseño 40/60
  counterHeight: SCREEN_HEIGHT * 0.4,
  deskHeight: SCREEN_HEIGHT * 0.6,
};
