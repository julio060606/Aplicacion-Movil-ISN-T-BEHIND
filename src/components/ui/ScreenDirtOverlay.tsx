// src/components/ui/ScreenDirtOverlay.tsx
/**
 * Overlay de "suciedad de pantalla" para los menús.
 *
 * Crea una capa absolutamente posicionada (pointerEvents='none') con:
 *   1. Scanlines horizontales (patrón SVG de líneas finas cada 3px)
 *   2. Viñeta oscura en los 4 bordes (Views semitransparentes)
 *
 * No requiere assets externos — todo generado con react-native-svg.
 * Afecta únicamente al menú, NO al ShiftScreen.
 *
 * Uso: <ScreenDirtOverlay /> al final del View raíz de cada pantalla de menú.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { screenDimensions } from '../../utils/responsive';

// ── Constantes ─────────────────────────────────────────────────────────────

const { width: W, height: H } = screenDimensions;

// ── Componente ─────────────────────────────────────────────────────────────

export const ScreenDirtOverlay = () => (
  <View style={styles.container} pointerEvents="none">

    {/* 1. Scanlines CRT — patrón SVG eficiente (sin bucle de elementos) */}
    <Svg
      width={W}
      height={H}
      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
    >
      <Defs>
        {/* Patrón de 1px negro / 2px transparente repetiéndose en Y */}
        <Pattern
          id="scanlines"
          x="0"
          y="0"
          width={W}
          height={3}
          patternUnits="userSpaceOnUse"
        >
          {/* Línea de scanline */}
          <Rect x="0" y="0" width={W} height={1} fill="#000000" opacity={0.1} />
          {/* Espacio vacío */}
          <Rect x="0" y="1" width={W} height={2} fill="transparent" />
        </Pattern>
      </Defs>
      {/* Rellena toda la pantalla con el patrón */}
      <Rect x="0" y="0" width={W} height={H} fill="url(#scanlines)" />
    </Svg>

  </View>
);

// ── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
