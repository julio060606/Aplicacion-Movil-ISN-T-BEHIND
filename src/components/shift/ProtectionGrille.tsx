import React from 'react';
import { Image, StyleSheet, Animated } from 'react-native';
import { figmaW, figmaH, UNIFORM_SCALE } from '../../utils/responsive';

interface ProtectionGrilleProps {
  opacity?: Animated.Value | number;
}

/**
 * =========================================================================
 * REJA DE PROTECCIÓN DIEGÉTICA (PROTECTION GRILLE)
 * =========================================================================
 * Sprite: protection_grille.webp
 * Figma: width: 1138, height: 427, left: 0, top: 0
 * Coordenadas relativas al teléfono (left: 360, top: 50):
 * - left: (0 - 360) * UNIFORM_SCALE = -360px
 * - top: (0 - 50) * UNIFORM_SCALE = -50px
 * 
 * Se ubica en zIndex: 4 (delante del cliente, detrás de la persiana y la mesa).
 */
export const ProtectionGrille: React.FC<ProtectionGrilleProps> = ({ opacity = 1 }) => {
  return (
    <Animated.View pointerEvents="none" style={[styles.container, { opacity }]}>
      <Image
        source={require('../../assets/sprites/protection_grille.webp')}
        style={styles.grilleImage}
        resizeMode="stretch"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Math.round(-360 * UNIFORM_SCALE),
    top: Math.round(-50 * UNIFORM_SCALE),
    width: figmaW(1138),
    height: figmaH(427),
    zIndex: 4,
  },
  grilleImage: {
    width: '100%',
    height: '100%',
  },
});
