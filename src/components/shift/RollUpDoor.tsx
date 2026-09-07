// src/components/shift/RollUpDoor.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { figmaX, figmaY, figmaW, figmaH } from '../../utils/responsive';

interface RollUpDoorProps {
  disabled?: boolean;
  onDoorStateChange?: (isClosed: boolean) => void;
}

// Distancia total que baja el cuerpo entre abierto y cerrado
// (Abierto deja el labio inferior en ~60px, bien lejos de la zona de notificaciones de Android)
const TRAVEL_DISTANCE = figmaY(285);
// Umbral para auto-cerrar (al llegar al inicio de la zona del cliente / Top 25%)
const SNAP_THRESHOLD = figmaY(115);

/**
 * =========================================================================
 * PERSIANA ENROLLABLE DIEGÉTICA (ROLL-UP DOOR)
 * =========================================================================
 * 1. roll-up_door_head.webp:
 *    - ESTATICO: Se queda fijo arriba todo el tiempo como cajón/marco superior.
 * 2. roll-up_door_body.webp:
 *    - MÓVIL: Se desliza hacia abajo desde detrás del cabezal.
 *    - Posición inicial abierta bajada lo suficiente (~60px) para que el gesto
 *      de arrastre NO active la barra de notificaciones del sistema Android.
 */
export const RollUpDoor: React.FC<RollUpDoorProps> = ({
  disabled = false,
  onDoorStateChange,
}) => {
  const [isClosed, setIsClosed] = useState(false);

  // Notificar cambio de estado al padre
  React.useEffect(() => {
    onDoorStateChange?.(isClosed);
  }, [isClosed, onDoorStateChange]);

  // 0 = Abierta (enrollada arriba), TRAVEL_DISTANCE = Cerrada (hasta el mostrador)
  const panAnim = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (_, gesture) => !disabled && Math.abs(gesture.dy) > 4,

      onPanResponderGrant: () => {
        panAnim.stopAnimation();
      },

      onPanResponderMove: (_, gesture) => {
        let nextOffset = currentOffset.current + gesture.dy;
        if (nextOffset < 0) nextOffset = 0;
        if (nextOffset > TRAVEL_DISTANCE) nextOffset = TRAVEL_DISTANCE;
        panAnim.setValue(nextOffset);
      },

      onPanResponderRelease: (_, gesture) => {
        const finalPosition = currentOffset.current + gesture.dy;

        // Si se arrastró pasando el umbral del Top 25%
        if (finalPosition >= SNAP_THRESHOLD) {
          // Auto-cerrar hasta el mostrador
          Animated.spring(panAnim, {
            toValue: TRAVEL_DISTANCE,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }).start(() => {
            currentOffset.current = TRAVEL_DISTANCE;
            setIsClosed(true);
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch {}
          });
        } else {
          // Auto-abrir hacia arriba
          Animated.spring(panAnim, {
            toValue: 0,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }).start(() => {
            currentOffset.current = 0;
            setIsClosed(false);
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {}
          });
        }
      },
    })
  ).current;

  // El cuerpo cuando está abierto (0) se oculta arriba a -TRAVEL_DISTANCE
  // Cuando está cerrado (TRAVEL_DISTANCE) llega a 0 (cubriendo el mostrador)
  const translateY = panAnim.interpolate({
    inputRange: [0, TRAVEL_DISTANCE],
    outputRange: [-TRAVEL_DISTANCE, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.outerContainer} pointerEvents={disabled ? 'none' : 'box-none'}>
      {/* =========================================================
          1. CUERPO MÓVIL DE LA PERSIANA (roll-up_door_body.webp)
          ========================================================= */}
      <Animated.View
        style={[
          styles.movingBodyContainer,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={require('../../assets/sprites/roll-up_door_body.webp')}
          style={styles.doorBodyImage}
          resizeMode="stretch"
        />

        {/* Zona de agarre táctil en la parte inferior del cuerpo */}
        <View style={styles.bottomGripArea} />
      </Animated.View>

      {/* =========================================================
          2. CABEZAL ESTÁTICO (roll-up_door_head.webp)
          - Se queda quieto arriba en todo momento (zIndex: 28)
          ========================================================= */}
      <View style={styles.staticHeadContainer} pointerEvents="none">
        <Image
          source={require('../../assets/sprites/roll-up_door_head.webp')}
          style={styles.doorHeadImage}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: figmaH(366),
    zIndex: 25,
  },

  // Cabezal ESTATICO fijo arriba (cubre el rollo superior de la persiana)
  staticHeadContainer: {
    position: 'absolute',
    left: 0,
    top: figmaY(-55), // Muestra la carcasa superior fija (~40px visible)
    width: '100%',
    height: figmaH(95),
    zIndex: 28, // Siempre al frente del cuerpo que se desliza por debajo
  },
  doorHeadImage: {
    position: 'absolute',
    left: figmaX(0 - 380 + 327), // Centrado con la pantalla
    width: figmaW(1178),
    height: figmaH(95),
  },

  // Contenedor del cuerpo móvil que se desplaza
  movingBodyContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: figmaH(366),
    zIndex: 26,
  },
  doorBodyImage: {
    position: 'absolute',
    left: figmaX(42 - 380 + 327), // Centrado con la pantalla
    top: 0,
    width: figmaW(1093),
    height: figmaH(366),
  },

  // Zona táctil en el borde inferior del cuerpo (lejos del borde superior del móvil)
  // para poder arrastrarlo sin activar el panel de notificaciones de Android
  bottomGripArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: figmaH(90),
    backgroundColor: 'transparent',
  },
});
