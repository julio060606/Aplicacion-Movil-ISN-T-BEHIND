/**
 * =========================================================================
 * src/hooks/useOverlays.ts
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Estado y animaciones de todos los overlays.
 *
 * Encapsula:
 *   - Monitor PC: zoom-in + oscurecimiento
 *   - Caja Registradora: slide desde abajo + oscurecimiento
 *   - Apuntar: estado booleano + bloqueo total
 *
 * Lee posiciones desde sceneConfig (MONITOR_OVERLAY, CAJA_OVERLAY, APUNTAR_OVERLAY).
 *
 * Expone a ShiftScreen:
 *   - monitorOpen, openMonitor, closeMonitor
 *   - cajaOpen, openCaja, closeCaja
 *   - isAiming, aim, holster
 *   - overlayDimAnim   → para el View de oscurecimiento
 *   - monitorScale     → transform del sprite del monitor
 *   - cajaSlideTop     → Animated top de la registradora (ya escalado)
 *   - positions        → { mon, caja, ap } en px pantalla (ya escalados)
 *   - isAnyOverlayOpen → combinado para el overlay dim
 * =========================================================================
 */

import { useState, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MONITOR_OVERLAY, CAJA_OVERLAY, APUNTAR_OVERLAY } from '../config/sceneConfig';

// ── Helpers de animación (privados) ──────────────────────────────────────────
const spring = (a: Animated.Value, v: number, f = 12, t = 50) =>
  Animated.spring(a, { toValue: v, friction: f, tension: t, useNativeDriver: true });

const timing = (a: Animated.Value, v: number, d = 180) =>
  Animated.timing(a, { toValue: v, duration: d, easing: Easing.out(Easing.quad), useNativeDriver: true });

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useOverlays = (scale: number, windowHeight: number) => {
  const s = (figmaPx: number) => Math.round(figmaPx * scale);

  // ── Estado booleano de cada overlay ──────────────────────────────────────
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [cajaOpen,    setCajaOpen]    = useState(false);
  const [isAiming,    setIsAiming]    = useState(false);

  // ── Valores animados ──────────────────────────────────────────────────────
  /** 0→1: controla la opacidad del View negro de oscurecimiento */
  const overlayDimAnim = useRef(new Animated.Value(0)).current;
  /** 0.88→1: escala del monitor al abrir */
  const monitorScale   = useRef(new Animated.Value(0.88)).current;
  /** 0→1: posición vertical de la caja (0=abajo fuera de pantalla, 1=posición abierta) */
  const cajaSlideAnim  = useRef(new Animated.Value(0)).current;

  // ── Posiciones en pantalla derivadas de sceneConfig (ya escaladas) ────────
  const positions = {
    monitor: {
      left:   s(MONITOR_OVERLAY.x),
      top:    s(MONITOR_OVERLAY.y),
      width:  s(MONITOR_OVERLAY.w),
      height: s(MONITOR_OVERLAY.h),
    },
    caja: {
      left:   s(CAJA_OVERLAY.x),
      width:  s(CAJA_OVERLAY.w),
      height: s(CAJA_OVERLAY.h),
      openTop: s(CAJA_OVERLAY.y),
    },
    apuntar: {
      left:   s(APUNTAR_OVERLAY.x),
      top:    s(APUNTAR_OVERLAY.y),
      width:  s(APUNTAR_OVERLAY.w),
      height: s(APUNTAR_OVERLAY.h),
    },
  };

  /** Top animado de la caja registradora: empieza fuera de pantalla y sube */
  const cajaSlideTop = cajaSlideAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [windowHeight, positions.caja.openTop],
  });

  // ── Handlers del Monitor ──────────────────────────────────────────────────
  const openMonitor = useCallback(() => {
    // Bloqueado si hay otros overlays activos (no comprobamos monitorOpen, que es lo que vamos a abrir)
    if (isAiming || cajaOpen) return;
    setMonitorOpen(true);
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    Animated.parallel([timing(overlayDimAnim, 1), spring(monitorScale, 1)]).start();
  }, [isAiming, cajaOpen]);

  const closeMonitor = useCallback(() => {
    Animated.parallel([timing(overlayDimAnim, 0, 160), timing(monitorScale, 0.88, 140)]).start(() => {
      setMonitorOpen(false);
      monitorScale.setValue(0.88);
    });
  }, []);

  // ── Handlers de la Caja Registradora ─────────────────────────────────────
  const openCaja = useCallback(() => {
    setCajaOpen(true);
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
    Animated.parallel([timing(overlayDimAnim, 1), spring(cajaSlideAnim, 1)]).start();
  }, []);

  const closeCaja = useCallback(() => {
    Animated.parallel([timing(overlayDimAnim, 0), spring(cajaSlideAnim, 0, 14, 60)]).start(() => {
      setCajaOpen(false);
    });
  }, []);

  // ── Handlers de Apuntar ───────────────────────────────────────────────────
  const aim = useCallback(() => {
    // No se puede apuntar si el monitor o la caja están abiertos
    if (monitorOpen || cajaOpen) return;
    setIsAiming(true);
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
  }, [monitorOpen, cajaOpen]);

  const holster = useCallback(() => {
    setIsAiming(false);
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
  }, []);

  return {
    // Estado
    monitorOpen,
    cajaOpen,
    isAiming,
    isAnyOverlayOpen: monitorOpen || cajaOpen,
    /** true cuando algún overlay bloquea TODA interacción */
    isBlocked: isAiming || monitorOpen || cajaOpen,
    // Animaciones
    overlayDimAnim,
    monitorScale,
    cajaSlideTop,
    // Posiciones en px pantalla (ya escaladas)
    positions,
    // Handlers
    openMonitor,
    closeMonitor,
    openCaja,
    closeCaja,
    aim,
    holster,
  };
};
