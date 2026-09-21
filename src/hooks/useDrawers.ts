/**
 * =========================================================================
 * src/hooks/useDrawers.ts
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Estado y animaciones de los cajones interactivos.
 *
 * Lee TODO desde sceneConfig.ts (drawerConfig) — cero magic numbers aquí.
 * Si el diseñador cambia cuánto baja un cajón → solo toca sceneConfig.ts.
 *
 * Expone a ShiftScreen:
 *   - getDrawer(id)       → { isOpen, animValue, activeItemIdx, items, carouselSlotId }
 *   - toggleDrawer(id)    → abre/cierra con animación
 *   - nextItem(id)        → avanza ítem del carrusel del cajón
 *   - prevItem(id)        → retrocede ítem del carrusel del cajón
 *   - tableCarouselIdx    → índice del carrusel de mesa
 *   - setTableCarouselIdx
 *   - carouselFocused
 *   - setCarouselFocused
 *   - cajaCartonOpen
 *   - setCajaCartonOpen
 * =========================================================================
 */

import { useState, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ADAPTED_ELEMENTS, TABLE_CAROUSEL_ITEMS } from '../config/sceneConfig';

// ── Tipo de retorno por cajón ─────────────────────────────────────────────────
export interface IDrawerState {
  isOpen: boolean;
  /** Animated.Value ya escalada (px pantalla). Usar como translateY del sprite. */
  animValue: Animated.Value;
  activeItemIdx: number;
  /** Claves de sprite disponibles en este cajón (de drawerConfig.items) */
  items: readonly string[];
  /** ID del elemento visual que actúa como slot del carrusel */
  carouselSlotId: string;
}

// ── Animación de apertura/cierre ──────────────────────────────────────────────
const animateDrawer = (anim: Animated.Value, toValue: number, open: boolean) =>
  Animated.timing(anim, {
    toValue,
    duration: 250,
    easing: open ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
    useNativeDriver: true,
  });

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useDrawers = (scale: number, isBlocked: boolean) => {

  // ── Construir estado inicial leyendo drawerConfig de sceneConfig ───────────
  // Filtra solo los elementos que son cajones (tienen drawerConfig)
  const drawerElements = ADAPTED_ELEMENTS.filter(e => e.drawerConfig !== undefined);

  // Mapa: id → Animated.Value (creados una sola vez con useRef)
  const animValues = useRef<Record<string, Animated.Value>>(
    Object.fromEntries(drawerElements.map(e => [e.id, new Animated.Value(0)]))
  ).current;

  // Mapa: id → { isOpen, activeItemIdx }
  const [drawerStates, setDrawerStates] = useState<Record<string, { isOpen: boolean; activeItemIdx: number }>>(
    Object.fromEntries(drawerElements.map(e => [e.id, { isOpen: false, activeItemIdx: 0 }]))
  );

  // ── Carrusel de mesa y otros estados de UI ────────────────────────────────
  const [tableCarouselIdx, setTableCarouselIdx] = useState(0);
  const [carouselFocused, setCarouselFocused]   = useState(false);
  const [cajaCartonOpen, setCajaCartonOpen]     = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Devuelve el estado completo de un cajón por su ID */
  const getDrawer = useCallback((id: string): IDrawerState | undefined => {
    const element = drawerElements.find(e => e.id === id);
    if (!element?.drawerConfig) return undefined;

    const state = drawerStates[id];
    return {
      isOpen:        state.isOpen,
      animValue:     animValues[id],
      activeItemIdx: state.activeItemIdx,
      items:         element.drawerConfig.items,
      carouselSlotId: element.drawerConfig.carouselSlotId,
    };
  }, [drawerStates, drawerElements, animValues]);

  /** Alterna apertura/cierre de un cajón con animación */
  const toggleDrawer = useCallback((id: string) => {
    if (isBlocked) return;
    const element = drawerElements.find(e => e.id === id);
    if (!element?.drawerConfig) return;

    const currentState = drawerStates[id];
    const willOpen = !currentState.isOpen;
    // Convertir px Figma → px pantalla
    const targetValue = willOpen
      ? Math.round(element.drawerConfig.openTranslateY * scale)
      : 0;

    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}

    animateDrawer(animValues[id], targetValue, willOpen).start();
    setDrawerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: willOpen },
    }));
  }, [isBlocked, drawerStates, drawerElements, animValues, scale]);

  /** Avanza el ítem activo del carrusel de un cajón */
  const nextItem = useCallback((id: string) => {
    const element = drawerElements.find(e => e.id === id);
    if (!element?.drawerConfig) return;
    const maxIdx = element.drawerConfig.items.length - 1;
    try { Haptics.selectionAsync(); } catch {}
    setDrawerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], activeItemIdx: Math.min(prev[id].activeItemIdx + 1, maxIdx) },
    }));
  }, [drawerElements]);

  /** Retrocede el ítem activo del carrusel de un cajón */
  const prevItem = useCallback((id: string) => {
    try { Haptics.selectionAsync(); } catch {}
    setDrawerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], activeItemIdx: Math.max(prev[id].activeItemIdx - 1, 0) },
    }));
  }, []);

  return {
    // API de cajones
    getDrawer,
    toggleDrawer,
    nextItem,
    prevItem,
    // Carrusel de mesa
    tableCarouselIdx,
    setTableCarouselIdx,
    carouselFocused,
    setCarouselFocused,
    cajaCartonOpen,
    setCajaCartonOpen,
    // IDs de los cajones disponibles (para iterar en ShiftScreen sin hardcodear)
    drawerIds: drawerElements.map(e => e.id),
  };
};
