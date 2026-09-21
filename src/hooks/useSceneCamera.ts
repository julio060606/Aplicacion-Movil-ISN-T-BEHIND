/**
 * =========================================================================
 * src/hooks/useSceneCamera.ts
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Toda la lógica de cámara y arrastre de la lámpara.
 *
 * Encapsula:
 *   - Zoom + paneo horizontal de la cámara (inspección táctil Zona B)
 *   - Enfoque / desenfoque del carrusel de mesa
 *   - Arrastre libre de la lámpara cabeza (lee panConfig de sceneConfig)
 *
 * Expone a ShiftScreen:
 *   - cameraTransform  → aplica directamente a <Animated.View> de cámara
 *   - inspectPanResponder → para la zona táctil invisible
 *   - lampX, lampY, lampPanResponder → para el sprite de la lámpara
 *   - focusCarousel, blurCarousel
 *   - inspectOpacity → para sprites con hasInspectOpacity
 * =========================================================================
 */

import { useRef, useCallback } from 'react';
import { Animated, PanResponder, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ADAPTED_ELEMENTS } from '../config/sceneConfig';

// ── Helpers de animación (privados a este hook) ───────────────────────────────
const spring = (a: Animated.Value, v: number, f = 9, t = 42) =>
  Animated.spring(a, { toValue: v, friction: f, tension: t, useNativeDriver: true });

const timing = (a: Animated.Value, v: number, d = 220) =>
  Animated.timing(a, { toValue: v, duration: d, easing: Easing.out(Easing.quad), useNativeDriver: true });

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useSceneCamera = (scale: number, isBlocked: boolean, carouselFocused: boolean) => {

  // ── Leer límites de la lámpara desde sceneConfig (sin magic numbers) ────────
  const lamparaEl = ADAPTED_ELEMENTS.find(e => e.id === 'lampara-cabeza');
  const LAMP_RX = Math.round((lamparaEl?.panConfig?.maxTranslateX ?? 80) * scale);
  const LAMP_RY = Math.round((lamparaEl?.panConfig?.maxTranslateY ?? 60) * scale);

  // ── Cámara: zoom, paneo y opacidad de inspección ──────────────────────────
  const zoomScale        = useRef(new Animated.Value(1)).current;
  const cameraTranslateY = useRef(new Animated.Value(0)).current;
  const cameraPanX       = useRef(new Animated.Value(0)).current;
  const inspectOpacity   = useRef(new Animated.Value(1)).current;
  const isInspecting     = useRef(false);
  const MAX_PAN_X        = Math.round(60 * scale);

  // ── Lámpara: arrastre libre ───────────────────────────────────────────────
  const lampX   = useRef(new Animated.Value(0)).current;
  const lampY   = useRef(new Animated.Value(0)).current;
  const lampOff = useRef({ x: 0, y: 0 });

  // ── Handlers de cámara ────────────────────────────────────────────────────
  const startInspection = useCallback(() => {
    if (isBlocked || carouselFocused) return;
    isInspecting.current = true;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    Animated.parallel([
      spring(zoomScale, 1.25),
      spring(cameraTranslateY, Math.round(80 * scale)),
      timing(inspectOpacity, 0.25),
    ]).start();
  }, [isBlocked, carouselFocused, scale]);

  const endInspection = useCallback(() => {
    if (!isInspecting.current) return;
    isInspecting.current = false;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    Animated.parallel([
      spring(zoomScale, 1),
      spring(cameraTranslateY, 0),
      spring(cameraPanX, 0),
      timing(inspectOpacity, 1),
    ]).start();
  }, []);

  const focusCarousel = useCallback(() => {
    if (isBlocked) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    Animated.parallel([
      spring(zoomScale, 1.28, 10, 45),
      spring(cameraTranslateY, -Math.round(70 * scale), 10, 45),
    ]).start();
  }, [isBlocked, scale]);

  const blurCarousel = useCallback(() => {
    Animated.parallel([spring(zoomScale, 1), spring(cameraTranslateY, 0)]).start();
  }, []);

  // ── PanResponder: inspección Zona B ───────────────────────────────────────
  const inspectPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isBlocked && !carouselFocused,
      onMoveShouldSetPanResponder:  () => isInspecting.current,
      onPanResponderGrant:    startInspection,
      onPanResponderMove: (_, g) => {
        if (!isInspecting.current) return;
        cameraPanX.setValue(Math.min(Math.max(g.dx, -MAX_PAN_X), MAX_PAN_X));
      },
      onPanResponderRelease:   endInspection,
      onPanResponderTerminate: endInspection,
    })
  ).current;

  // ── PanResponder: lámpara cabeza ──────────────────────────────────────────
  const lampPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isBlocked,
      onMoveShouldSetPanResponder:  () => !isBlocked,
      onPanResponderGrant: () => {
        lampX.stopAnimation(v => { lampOff.current.x = v; });
        lampY.stopAnimation(v => { lampOff.current.y = v; });
      },
      onPanResponderMove: (_, g) => {
        lampX.setValue(Math.min(Math.max(lampOff.current.x + g.dx, -LAMP_RX), LAMP_RX));
        lampY.setValue(Math.min(Math.max(lampOff.current.y + g.dy, -LAMP_RY), LAMP_RY));
      },
      onPanResponderRelease: (_, g) => {
        lampOff.current.x = Math.min(Math.max(lampOff.current.x + g.dx, -LAMP_RX), LAMP_RX);
        lampOff.current.y = Math.min(Math.max(lampOff.current.y + g.dy, -LAMP_RY), LAMP_RY);
        // Swipe rápido a la derecha → resetea al centro (lee resetOnFastSwipe de sceneConfig)
        if (lamparaEl?.panConfig?.resetOnFastSwipe && g.vx > 0.6) {
          lampOff.current = { x: 0, y: 0 };
          Animated.parallel([spring(lampX, 0, 6, 35), spring(lampY, 0, 6, 35)]).start();
          try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
        }
      },
    })
  ).current;

  // ── Valor compuesto para el transform de la cámara ────────────────────────
  const cameraTransform = [
    { scale: zoomScale },
    { translateX: cameraPanX },
    { translateY: cameraTranslateY },
  ];

  return {
    // Para el <Animated.View> de cámara en ShiftScreen
    cameraTransform,
    // Para sprites con hasInspectOpacity (rejilla, npc)
    inspectOpacity,
    // Para la lámpara
    lampX,
    lampY,
    lampPanResponder,
    // Para la zona táctil invisible de inspección
    inspectPanResponder,
    // Para el carrusel de mesa
    focusCarousel,
    blurCarousel,
  };
};
