// src/components/menu/MenuSection.tsx
/**
 * Contenedor de sección con subtítulo que se escribe con efecto typewriter.
 * Reutilizable en Settings, Extras y StorySaveSelect.
 *
 * Renderiza:
 *   ─────────────────────────────
 *   [ TÍTULO DE SECCIÓN ]         ← se escribe carácter a carácter al montar
 *   ─────────────────────────────
 *   {children}
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMenuTheme } from '../../context/MenuThemeContext';
import { TypewriterText } from './TypewriterText';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, verticalScale } from '../../utils/responsive';

// ── Props ──────────────────────────────────────────────────────────────────

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
  /** Delay inicial antes de empezar a escribir (ms). Útil para escalonar secciones */
  typewriterDelay?: number;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const MenuSection = ({
  title,
  children,
  typewriterDelay = 0,
}: MenuSectionProps) => {
  const { theme } = useMenuTheme();

  return (
    <View style={styles.container}>
      {/* Línea superior */}
      <View style={[styles.divider, { backgroundColor: theme.divider }]} />

      {/* Título con efecto de escritura */}
      <TypewriterText
        text={`[ ${title.toUpperCase()} ]`}
        speed={28}
        startDelay={typewriterDelay}
        style={[styles.title, { color: theme.textMuted }]}
      />

      {/* Contenido de la sección */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

// ── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(28),
  },
  divider: {
    height: 1,
    marginBottom: verticalScale(8),
  },
  title: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(15),
    letterSpacing: 2,
    marginBottom: verticalScale(10),
    textTransform: 'uppercase',
    minHeight: moderateScale(20), // Reserva espacio mientras escribe
  },
  content: {
    // Sin padding propio — los hijos se encargan de su espaciado
  },
});
