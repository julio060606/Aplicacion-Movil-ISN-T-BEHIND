import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { verticalScale, scale } from '../../utils/responsive';

interface PaperDocumentProps {
  children: React.ReactNode;
  /** Sprite de textura de papel cuando esté disponible */
  spriteSource?: ImageSourcePropType;
  /** Retraso antes de lanzar la animación física (ms) */
  initialDelay?: number;
  /** Inclinación final del papel al reposar sobre el escritorio (ej: '-1.5deg') */
  finalRotation?: string;
  /** Estilos adicionales del contenedor */
  style?: StyleProp<ViewStyle>;
}

export const PaperDocument: React.FC<PaperDocumentProps> = ({
  children,
  spriteSource,
  initialDelay = 120,
  finalRotation = '-1.5deg',
  style,
}) => {
  // Valores animados de traslación Y y rotación
  const dropAnim = useRef(new Animated.Value(-verticalScale(550))).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animación fría y seca: deslizamiento rápido que frena en seco sin rebote
      Animated.parallel([
        Animated.timing(dropAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [dropAnim, rotateAnim, initialDelay]);

  // Interpolación de la rotación: de -10deg a finalRotation
  const interpolatedRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', finalRotation],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: dropAnim },
            { rotate: interpolatedRotation },
          ],
        },
        style,
      ]}
    >
      {/* 1. CAPA COLORBOX (Textura de papel manila envejecido de respaldo) */}
      <View style={styles.colorboxPaper} />

      {/* 2. CAPA DE SPRITE (Si existe textura de papel PNG/WEBP) */}
      {spriteSource && (
        <Image
          source={spriteSource}
          style={StyleSheet.absoluteFill}
          resizeMode="stretch"
        />
      )}

      {/* 3. CAPA DE CONTENIDO */}
      <View style={styles.contentContainer}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 10,
  },
  colorboxPaper: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#D9C89A', // Manila / Papel viejo
    borderWidth: 1.5,
    borderColor: '#B8A87A',
    borderRadius: 2,
  },
  contentContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },
});
