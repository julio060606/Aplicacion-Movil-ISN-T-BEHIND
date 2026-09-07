// src/components/shift/GameBackground.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { figmaW, figmaH, UNIFORM_SCALE } from '../../utils/responsive';

/**
 * =========================================================================
 * FONDO DE LA HABITACIÓN / ESTACIÓN DIEGÉTICA (GAME BACKGROUND)
 * =========================================================================
 * Sprite: game_background.webp (width: 1178, height: 1107)
 * Coordenadas relativas al marco móvil (left: 380, top: 198):
 * - left: -380px * UNIFORM_SCALE
 * - top: -198px * UNIFORM_SCALE
 * 
 * zIndex: 0 (detrás de todos los elementos del juego)
 */
export const GameBackground: React.FC = () => {
  return (
    <View pointerEvents="none" style={styles.container}>
      <Image
        source={require('../../assets/sprites/game_background.webp')}
        style={styles.bgImage}
        resizeMode="stretch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Math.round(-380 * UNIFORM_SCALE),
    top: Math.round(-198 * UNIFORM_SCALE),
    width: figmaW(1178),
    height: figmaH(1107),
    zIndex: 0,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
});
