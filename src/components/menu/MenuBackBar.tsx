// src/components/menu/MenuBackBar.tsx
/**
 * Barra de navegación inferior fija para subpantallas del menú.
 * Anclada al fondo de la pantalla con `position: 'absolute'`.
 *
 * Renderiza una sola opción de retorno estilo DOS:
 *   ─────────────────────────────────────
 *   [ ← VOLVER ]
 *   ─────────────────────────────────────
 *
 * Uso: <MenuBackBar onBack={() => navigation.goBack()} />
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMenuTheme } from '../../context/MenuThemeContext';
import { MenuOption } from './MenuOption';
import { verticalScale, scale } from '../../utils/responsive';

// ── Props ──────────────────────────────────────────────────────────────────

interface MenuBackBarProps {
  onBack: () => void;
  backLabel?: string;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const MenuBackBar = ({
  onBack,
  backLabel = '← VOLVER AL MENÚ',
}: MenuBackBarProps) => {
  const { theme } = useMenuTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.divider,
        },
      ]}
    >
      <MenuOption
        label={backLabel}
        onPress={onBack}
        style={styles.option}
      />
    </View>
  );
};

// ── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(4),
  },
  option: {
    // La opción hereda todo su estilo de MenuOption
  },
});
