// src/components/menu/MenuToggle.tsx
/**
 * Fila de toggle con label, descripción y Switch.
 * Reutilizable en Settings para opciones de audio, dispositivo y apariencia.
 *
 * El Switch usa los colores del tema activo para mantener coherencia visual.
 */
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useMenuTheme } from '../../context/MenuThemeContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

// ── Props ──────────────────────────────────────────────────────────────────

interface MenuToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const MenuToggle = ({
  label,
  description,
  value,
  onChange,
  disabled = false,
}: MenuToggleProps) => {
  const { theme } = useMenuTheme();

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: theme.divider },
      ]}
    >
      {/* Textos */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            { color: disabled ? theme.textMuted : theme.text },
          ]}
        >
          {label.toUpperCase()}
        </Text>
        {description ? (
          <Text style={[styles.description, { color: theme.textMuted }]}>
            {description}
          </Text>
        ) : null}
      </View>

      {/* Switch */}
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        thumbColor={value ? theme.accent : theme.textMuted}
        trackColor={{
          false: theme.divider,
          true: `${theme.accent}66`, // 40% de opacidad del acento
        }}
        ios_backgroundColor={theme.divider}
      />
    </View>
  );
};

// ── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: scale(12),
  },
  label: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(11),
    letterSpacing: 1,
    marginBottom: 2,
  },
  description: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(9),
    lineHeight: verticalScale(13),
  },
});
