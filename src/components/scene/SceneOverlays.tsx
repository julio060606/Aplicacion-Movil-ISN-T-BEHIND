/**
 * =========================================================================
 * src/components/scene/SceneOverlays.tsx
 * =========================================================================
 * Contenedor de overlays diegéticos (limpio para el nuevo lienzo horizontal).
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

export const SceneOverlays: React.FC = () => {
  return <View style={styles.container} pointerEvents="none" />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
