// src/components/menu/MenuOption.tsx
/**
 * Átomo de opción de menú estilo "selección DOS / Papers Please".
 *
 * Al presionar:
 *   - El fondo se pinta con el acento del tema activo (azul CST #2E86C1).
 *   - El texto invierte su color a blanco.
 *   - Se dispara haptic feedback leve.
 *
 * Al soltar:
 *   - Vuelve al estado normal y ejecuta `onPress`.
 *
 * No usa Animated.Value — el toggle de estado es instantáneo para
 * replicar fielmente la respuesta de una interfaz de terminal antigua.
 */
import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useMenuTheme } from '../../context/MenuThemeContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, verticalScale } from '../../utils/responsive';

// ── Props ──────────────────────────────────────────────────────────────────

interface MenuOptionProps {
  label: string;
  onPress: () => void;
  /** Muestra la opción en gris tenue y bloquea la interacción */
  disabled?: boolean;
  /** Estilo opcional adicional para el contenedor exterior */
  style?: ViewStyle;
  /** Alineación del texto ('left' | 'center' | 'right', por defecto 'left') */
  textAlign?: 'left' | 'center' | 'right';
  /** Padding horizontal opcional para el botón */
  paddingHorizontal?: number;
  /** Color del texto cuando está activo (por defecto theme.text) */
  activeColor?: string;
  /** Color del texto cuando está deshabilitado (por defecto #555555) */
  disabledColor?: string;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const MenuOption = ({
  label,
  onPress,
  disabled = false,
  style,
  textAlign = 'left',
  paddingHorizontal,
  activeColor,
  disabledColor,
}: MenuOptionProps) => {
  const { theme } = useMenuTheme();
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
    Haptics.selectionAsync().catch(() => {});
  }, [disabled]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    setIsPressed(false);
    onPress();
  }, [disabled, onPress]);

  // ── Estilos dinámicos (tema + estado pressed) ──────────────────────────
  const containerStyle: ViewStyle = {
    backgroundColor: isPressed ? theme.accent : 'transparent',
    borderColor: disabled ? theme.divider : theme.border,
  };

  const textColor = disabled
    ? (disabledColor || '#555555')
    : isPressed
      ? theme.accentText
      : (activeColor || theme.text);

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <View
        style={[
          styles.container,
          containerStyle,
          paddingHorizontal !== undefined && { paddingHorizontal },
          style,
        ]}
      >
        <Text style={[styles.label, { color: textColor, textAlign }]}>
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

// ── Estilos base (independientes del tema) ─────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: verticalScale(11),
    paddingHorizontal: 0,
    borderWidth: 0,
    marginVertical: verticalScale(1),
  },
  label: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(18),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
