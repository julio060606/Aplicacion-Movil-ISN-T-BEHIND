// src/components/shift/InventoryBox.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { figmaH, figmaW, UNIFORM_SCALE } from '../../utils/responsive';

interface InventoryBoxProps {
  isBlocked: boolean;
  disabled?: boolean;
  onInventoryStateChange?: (isOpen: boolean) => void;
}

// PosiciÃ³n X cerrada: asoma 87px desde el borde derecho (X = 325px Figma)
const X_CLOSED = Math.round(325 * UNIFORM_SCALE);
// PosiciÃ³n X abierta: exactamente centrada en el medio del marco de 412px (X = -53px Figma)
const X_OPEN = Math.round(-53 * UNIFORM_SCALE);
const TRAVEL_DISTANCE = X_CLOSED - X_OPEN; // ~378px Figma

/**
 * =========================================================================
 * CAJA DE INVENTARIO DIEGÃ‰TICA (INVENTORY BOX)
 * =========================================================================
 * Sprite: inventory_box.webp (width: 518, height: 318, top: 663)
 *
 * Capa de Profundidad (zIndex: 5):
 * - Se ubica en una capa inferior a la parte de abajo de la mesa (desk_under_workstation zIndex: 6)
 *   y de los cajones (zIndex: 7 y 8).
 *
 * Gestos:
 * - Tap directo o deslizamiento a la izquierda para centrarla en el medio.
 * - Tap o deslizamiento a la derecha para cerrarla.
 * - Bloqueo con sacudÃ³n si los cajones estÃ¡n abiertos o el cuaderno interrumpe el paso.
 *
 * NOTA TÃ‰CNICA: El PanResponder se crea una sola vez. Refs sincronizadas permiten
 * leer `isOpen` e `isBlocked` actualizados en los callbacks sin closures estÃ¡ticos.
 */
export const InventoryBox: React.FC<InventoryBoxProps> = ({
  isBlocked,
  disabled = false,
  onInventoryStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // â”€â”€ REFS para lectura actualizada dentro del PanResponder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const isOpenRef = useRef(false);
  const isBlockedRef = useRef(isBlocked);
  const disabledRef = useRef(disabled);

  useEffect(() => { isBlockedRef.current = isBlocked; }, [isBlocked]);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);

  // Notificar al padre para inhabilitar los cajones cuando el inventario estÃ¡ abierto
  useEffect(() => {
    onInventoryStateChange?.(isOpen);
  }, [isOpen, onInventoryStateChange]);

  const bumpBlocked = () => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0.08,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openBox = () => {
    if (isBlockedRef.current) {
      bumpBlocked();
      return;
    }
    setIsOpen(true);
    isOpenRef.current = true;
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 8,
      tension: 45,
      useNativeDriver: true,
    }).start(() => {
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    });
  };

  const closeBox = () => {
    setIsOpen(false);
    isOpenRef.current = false;
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start(() => {
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: (_, gesture) =>
        !disabledRef.current && (Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3),

      onPanResponderRelease: (_, gesture) => {
        if (disabledRef.current) return;

        // Swipe hacia la izquierda (< -15px) â†’ Abrir
        if (gesture.dx < -15) {
          if (!isOpenRef.current) openBox();
        }
        // Swipe hacia la derecha (> 15px) â†’ Cerrar
        else if (gesture.dx > 15) {
          if (isOpenRef.current) closeBox();
        }
        // Tap simple â†’ Alternar (lee el ref para ver el estado actual real)
        else if (Math.abs(gesture.dx) < 14 && Math.abs(gesture.dy) < 14) {
          if (isOpenRef.current) closeBox();
          else openBox();
        }
      },
    })
  ).current;

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -TRAVEL_DISTANCE],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.boxContainer,
        {
          transform: [{ translateX }],
        },
      ]}
      pointerEvents={disabled ? 'none' : 'auto'}
      {...panResponder.panHandlers}
    >
      <Image
        source={require('../../assets/sprites/inventory_box.webp')}
        style={styles.boxImage}
        resizeMode="stretch"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    position: 'absolute',
    left: X_CLOSED,
    top: Math.round(663 * UNIFORM_SCALE),
    width: figmaW(518),
    height: figmaH(318),
    zIndex: 5, // CAPA INFERIOR A LA PARTE DE ABAJO DE LA MESA (zIndex 6) Y CAJONES (zIndex 7, 8)
  },
  boxImage: {
    width: '100%',
    height: '100%',
  },
});
