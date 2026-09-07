// src/components/shift/DeskDrawers.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Animated,
  Easing,
  PanResponder,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { figmaX, figmaY, figmaW, figmaH } from '../../utils/responsive';

interface DeskDrawersProps {
  onToggleNotebook: () => void;
  onToggleGun: () => void;
  isGunDrawn: boolean;
  disabled?: boolean;
  onDrawersStateChange?: (areDrawersOpen: boolean) => void;
}

/**
 * =========================================================================
 * COMPONENTE DIEGÃ‰TICO: CAJONES Y PARTE INFERIOR DE LA MESA
 * =========================================================================
 * Reglas Estrictas:
 * 1. Abrir/Cerrar: Funciona tanto con SWIPE (deslizar) como con TAP (un solo toque).
 * 2. ExtracciÃ³n (Hold 800ms): SOLO funciona si el cajÃ³n respectivo estÃ¡ ABIERTO.
 * 3. Bloqueo (disabled): Si la Caja de Inventario estÃ¡ desplegada, los cajones quedan
 *    completamente inhabilitados para evitar superposiciones fÃ­sicas.
 *
 * NOTA TÃ‰CNICA: Los PanResponders se crean una sola vez (useRef). Para leer el
 * estado actual dentro de sus callbacks sin closures estÃ¡ticos, se usan refs
 * sincronizadas con useEffect que reflejan el valor mÃ¡s reciente en todo momento.
 */
export const DeskDrawers: React.FC<DeskDrawersProps> = ({
  onToggleNotebook,
  onToggleGun,
  isGunDrawn,
  disabled = false,
  onDrawersStateChange,
}) => {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  // â”€â”€ REFS que los PanResponders pueden leer sin closures estÃ¡ticos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const isLeftOpenRef = useRef(false);
  const isRightOpenRef = useRef(false);
  const isGunDrawnRef = useRef(isGunDrawn);
  const disabledRef = useRef(disabled);

  useEffect(() => { isLeftOpenRef.current = isLeftOpen; }, [isLeftOpen]);
  useEffect(() => { isRightOpenRef.current = isRightOpen; }, [isRightOpen]);
  useEffect(() => { isGunDrawnRef.current = isGunDrawn; }, [isGunDrawn]);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);

  // Notificar cambio de estado al padre para coordinar el bloqueo del inventario
  useEffect(() => {
    onDrawersStateChange?.(isLeftOpen || isRightOpen);
  }, [isLeftOpen, isRightOpen, onDrawersStateChange]);

  // Animaciones de apertura/cierre (0 = cerrado, 1 = abierto)
  const leftDrawerAnim = useRef(new Animated.Value(0)).current;
  const rightDrawerAnim = useRef(new Animated.Value(0)).current;

  const openDrawerLeft = () => {
    setIsLeftOpen(true);
    isLeftOpenRef.current = true;
    Animated.timing(leftDrawerAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDrawerLeft = () => {
    setIsLeftOpen(false);
    isLeftOpenRef.current = false;
    Animated.timing(leftDrawerAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const openDrawerRight = () => {
    setIsRightOpen(true);
    isRightOpenRef.current = true;
    Animated.timing(rightDrawerAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDrawerRight = () => {
    setIsRightOpen(false);
    isRightOpenRef.current = false;
    Animated.timing(rightDrawerAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // â”€â”€ PanResponder: CAJÃ“N IZQUIERDO (Cuaderno) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const leftLongPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leftIsLongPress = useRef(false);

  const leftPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isGunDrawnRef.current && !disabledRef.current,
      onMoveShouldSetPanResponder: (_, g) =>
        !isGunDrawnRef.current && !disabledRef.current && (Math.abs(g.dy) > 3 || Math.abs(g.dx) > 3),

      onPanResponderGrant: () => {
        leftIsLongPress.current = false;
        // Solo se puede extraer el cuaderno si el cajÃ³n izquierdo YA ESTÃ ABIERTO
        if (isLeftOpenRef.current && !isGunDrawnRef.current && !disabledRef.current) {
          leftLongPressTimeout.current = setTimeout(() => {
            leftIsLongPress.current = true;
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
            onToggleNotebook();
          }, 800);
        }
      },

      onPanResponderMove: (_, g) => {
        if (Math.abs(g.dy) > 8 || Math.abs(g.dx) > 8) {
          if (leftLongPressTimeout.current) {
            clearTimeout(leftLongPressTimeout.current);
            leftLongPressTimeout.current = null;
          }
        }
      },

      onPanResponderRelease: (_, g) => {
        if (leftLongPressTimeout.current) {
          clearTimeout(leftLongPressTimeout.current);
          leftLongPressTimeout.current = null;
        }
        if (leftIsLongPress.current) return;
        if (isGunDrawnRef.current || disabledRef.current) return;

        // Swipe hacia abajo â†’ Abrir
        if (g.dy > 15) {
          openDrawerLeft();
        }
        // Swipe hacia arriba â†’ Cerrar
        else if (g.dy < -15) {
          closeDrawerLeft();
        }
        // Tap simple â†’ Alternar (lee el ref para ver el estado actual real)
        else if (Math.abs(g.dx) < 14 && Math.abs(g.dy) < 14) {
          if (isLeftOpenRef.current) closeDrawerLeft();
          else openDrawerLeft();
        }
      },
    })
  ).current;

  // â”€â”€ PanResponder: CAJÃ“N DERECHO (RevÃ³lver) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const rightLongPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rightIsLongPress = useRef(false);

  const rightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: (_, g) =>
        !disabledRef.current && (Math.abs(g.dy) > 3 || Math.abs(g.dx) > 3),

      onPanResponderGrant: () => {
        rightIsLongPress.current = false;
        // Extraer: cajÃ³n derecho abierto. Guardar: arma ya desenfundada.
        if ((isRightOpenRef.current || isGunDrawnRef.current) && !disabledRef.current) {
          rightLongPressTimeout.current = setTimeout(() => {
            rightIsLongPress.current = true;
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
            onToggleGun();
          }, 800);
        }
      },

      onPanResponderMove: (_, g) => {
        if (Math.abs(g.dy) > 8 || Math.abs(g.dx) > 8) {
          if (rightLongPressTimeout.current) {
            clearTimeout(rightLongPressTimeout.current);
            rightLongPressTimeout.current = null;
          }
        }
      },

      onPanResponderRelease: (_, g) => {
        if (rightLongPressTimeout.current) {
          clearTimeout(rightLongPressTimeout.current);
          rightLongPressTimeout.current = null;
        }
        if (rightIsLongPress.current) return;
        if (disabledRef.current) return;
        // Con el arma desenfundada, solo el hold funciona para guardarla
        if (isGunDrawnRef.current) return;

        // Swipe hacia abajo â†’ Abrir
        if (g.dy > 15) {
          openDrawerRight();
        }
        // Swipe hacia arriba â†’ Cerrar
        else if (g.dy < -15) {
          closeDrawerRight();
        }
        // Tap simple â†’ Alternar (lee el ref para ver el estado actual real)
        else if (Math.abs(g.dx) < 14 && Math.abs(g.dy) < 14) {
          if (isRightOpenRef.current) closeDrawerRight();
          else openDrawerRight();
        }
      },
    })
  ).current;

  const leftTranslateY = leftDrawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, figmaY(109)],
  });

  const rightTranslateY = rightDrawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, figmaY(109)],
  });

  return (
    <>
      {/* 3. PARTE DE ABAJO DE LA MESA (desk_under_workstation.webp) - zIndex: 6 */}
      <Image
        source={require('../../assets/sprites/desk_under_workstation.webp')}
        style={styles.underWorkstation}
        resizeMode="stretch"
      />

      {/* 2. CAJÃ“N 2: DERECHO (desk_under_drawer2.webp) - zIndex: 7 */}
      <Animated.View
        style={[
          styles.drawerRightContainer,
          { transform: [{ translateY: rightTranslateY }] },
        ]}
        pointerEvents={disabled ? 'none' : 'auto'}
        {...rightPanResponder.panHandlers}
      >
        <Image
          source={require('../../assets/sprites/desk_under_drawer2.webp')}
          style={styles.drawerImage}
          resizeMode="stretch"
        />
      </Animated.View>

      {/* 1. CAJÓN 1: IZQUIERDO (desk_under_drawer1.webp) - zIndex: 8 */}
      <Animated.View
        style={[
          styles.drawerLeftContainer,
          { transform: [{ translateY: leftTranslateY }] },
        ]}
        pointerEvents={disabled || isGunDrawn ? 'none' : 'auto'}
        {...leftPanResponder.panHandlers}
      >
        <Image
          source={require('../../assets/sprites/desk_under_drawer1.webp')}
          style={styles.drawerImage}
          resizeMode="stretch"
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  underWorkstation: {
    position: 'absolute',
    left: figmaX(0),
    top: figmaY(656),
    width: figmaW(1067),
    height: figmaH(50),
    zIndex: 6,
  },

  drawerRightContainer: {
    position: 'absolute',
    left: figmaX(514),
    top: figmaY(523),
    width: figmaW(200),
    height: figmaH(175),
    zIndex: 7,
  },

  drawerLeftContainer: {
    position: 'absolute',
    left: figmaX(315),
    top: figmaY(524),
    width: figmaW(200),
    height: figmaH(175),
    zIndex: 8,
  },

  drawerImage: {
    width: '100%',
    height: '100%',
  },
});



