// src/components/shift/CustomerArea.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import { figmaW, figmaH, UNIFORM_SCALE } from '../../utils/responsive';

interface CustomerAreaProps {
  onCustomerArrived?: () => void;
  inspectOpacity?: Animated.Value | number;
}

/**
 * =========================================================================
 * CLIENTE EN VENTANILLA (CUSTOMER / VISITOR SPRITE)
 * =========================================================================
 * Sprite: character_client_1.webp (width: 252, height: 451)
 * Coordenadas relativas al marco móvil (left: 380, top: 198 en Figma):
 * - left: (491 - 380) * UNIFORM_SCALE = 111px
 * - top: (226 - 198) * UNIFORM_SCALE = 28px
 * 
 * zIndex: 2 (delante del fondo, detrás de la reja zIndex 4 y la mesa zIndex 10)
 * 
 * Cinemática de Aproximación:
 * - El personaje emerge desde las sombras del pasillo exterior:
 *   Aparece con difuminado (fade-in), escala progresiva (0.86 -> 1.0) y un
 *   desplazamiento sutil como si caminara hacia la ventanilla.
 * - Al posicionarse, mantiene un sutil balanceo de respiración en reposo.
 */
export const CustomerArea: React.FC<CustomerAreaProps> = ({
  onCustomerArrived,
  inspectOpacity,
}) => {
  const appearAnim = useRef(new Animated.Value(0)).current; // 0 = en la sombra, 1 = en ventanilla
  const breathingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Animación de llegada: el cliente se aproxima a la caja/ventanilla
    Animated.timing(appearAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onCustomerArrived?.();

      // 2. Respiración sutil en bucle continuo
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(breathingAnim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [appearAnim, breathingAnim, onCustomerArrived]);

  const scale = appearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.86, 1],
  });

  const translateY = Animated.add(
    appearAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 0], // Da la sensación de avanzar desde atrás
    }),
    breathingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2.5], // Respiración orgánica
    })
  );

  const finalOpacity = inspectOpacity !== undefined
    ? Animated.multiply(appearAnim, typeof inspectOpacity === 'number' ? new Animated.Value(inspectOpacity) : inspectOpacity)
    : appearAnim;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity: finalOpacity,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      <Animated.Image
        source={require('../../assets/sprites/character_client_1.webp')}
        style={styles.characterImage}
        resizeMode="stretch"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Math.round(111 * UNIFORM_SCALE),
    top: Math.round(28 * UNIFORM_SCALE),
    width: figmaW(252),
    height: figmaH(451),
    zIndex: 2,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
});
