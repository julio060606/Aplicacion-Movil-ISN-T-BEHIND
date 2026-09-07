// src/components/shift/DeskWorkstation.tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { figmaX, figmaY, figmaW, figmaH } from '../../utils/responsive';

/**
 * =========================================================================
 * COMPONENTE DIEGÉTICO: MESA DE TRABAJO (PLATAFORMA BASE)
 * =========================================================================
 * Sprite: desk_workstation.webp
 * Coordenadas Figma: width: 1067, height: 386, left: 0, top: 270
 * 
 * Se ubica en zIndex: 5, centrada con respecto al lienzo panorámico.
 * En el marco del teléfono (412px centrado a left: 327), abarca desde
 * top: 270px (sobre el mostrador) hasta 656px (sobre los cajones).
 */
export const DeskWorkstation: React.FC = () => {
  return (
    <Image
      source={require('../../assets/sprites/desk_workstation.webp')}
      style={styles.deskImage}
      resizeMode="stretch"
    />
  );
};

const styles = StyleSheet.create({
  deskImage: {
    position: 'absolute',
    left: figmaX(0),
    top: figmaY(270),
    width: figmaW(1067),
    height: figmaH(386),
    zIndex: 10,
  },
});
