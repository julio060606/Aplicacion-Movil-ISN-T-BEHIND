// src/components/menu/MenuCheckbox.tsx
/**
 * Checkbox rústico estilo terminal para los ajustes.
 * Reemplaza el Switch de React Native por coherencia estética.
 *
 * Apariencia:
 *   [X] LABEL              ← marcado (Inconsolata Bold)
 *   [ ] LABEL              ← desmarcado
 *
 * El carácter monoespaciado de Inconsolata hace que los corchetes
 * parezcan impresión de máquina de escribir / pantalla CRT antigua.
 */
import React, { useCallback } from 'react';
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

interface MenuCheckboxProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const MenuCheckbox = ({
  label,
  value,
  onChange,
  description,
  disabled = false,
  style,
}: MenuCheckboxProps) => {
  const { theme } = useMenuTheme();

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onChange(!value);
  }, [disabled, value, onChange]);

  const boxChar = value ? '[X]' : '[ ]';

  const labelColor = disabled
    ? theme.textMuted
    : value
      ? theme.text
      : theme.textMuted;
  const boxColor = disabled
    ? theme.textMuted
    : value
      ? theme.accent
      : theme.textMuted;

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
    >
      <View style={[styles.row, { borderBottomColor: theme.divider }, style]}>
        {/* Caja */}
        <Text
          style={[
            styles.box,
            {
              color: boxColor,
              fontFamily: value
                ? TYPOGRAPHY.menuOptionBold
                : TYPOGRAPHY.menuOption,
            },
          ]}
        >
          {boxChar}
        </Text>

        {/* Textos */}
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: labelColor }]}>
            {label.toUpperCase()}
          </Text>
          {description ? (
            <Text style={[styles.description, { color: theme.textMuted }]}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// ── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
  },
  box: {
    fontSize: moderateScale(16),
    marginRight: 10,
    lineHeight: moderateScale(22),
    letterSpacing: 0,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(15),
    letterSpacing: 1,
    lineHeight: moderateScale(22),
  },
  description: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(11),
    lineHeight: verticalScale(16),
    marginTop: 2,
  },
});
