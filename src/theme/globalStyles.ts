// src/theme/globalStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

/**
 * Estilos globales compartidos para componentes y pantallas de ISN'T BEHIND
 */
export const globalStyles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  terminalText: {
    fontFamily: 'Inconsolata-Light',
    color: colors.textSecondary,
    fontSize: moderateScale(14),
    letterSpacing: scale(1),
  },
  crtGlowText: {
    fontFamily: 'Inconsolata-Light',
    color: colors.crtGreen,
    fontSize: moderateScale(14),
    letterSpacing: scale(1.5),
  },
  stampText: {
    fontFamily: 'Syne-Mono',
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  industrialBorder: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: 2,
  },
  cardSurface: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: scale(12),
    borderRadius: 4,
  },
});
