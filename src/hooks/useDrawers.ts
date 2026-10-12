/**
 * =========================================================================
 * src/hooks/useDrawers.ts
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Máquinas de estados de cajones y caja de cartón (Fase 2).
 *
 * Reglas de negocio:
 *   1. Cajón 1: cerrado → mitad → completo → cerrado.
 *   2. Cajón 2: cerrado → mitad → completo → cerrado.
 *   3. Caja: posición 1 ↔ posición 2 (por encima de todo).
 *   4. Exclusión mutua estricta:
 *      - Si la caja está abierta (pos 2), no se pueden abrir los cajones.
 *      - Si algún cajón está abierto (mitad/completo), no se puede abrir la caja.
 * =========================================================================
 */

import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

export type DrawerOpenState = 'closed' | 'half' | 'full';

export const useDrawers = (_scale: number, isBlocked: boolean) => {
  const [cajon1State, setCajon1State] = useState<DrawerOpenState>('closed');
  const [cajon2State, setCajon2State] = useState<DrawerOpenState>('closed');
  const [cajaPos, setCajaPos] = useState<1 | 2>(1);

  const isCajaOpen = cajaPos === 2;
  const isAnyDrawerOpen = cajon1State !== 'closed' || cajon2State !== 'closed';

  /** Cicla el Cajón 1: cerrado → mitad → completo → cerrado */
  const cycleCajon1 = useCallback(() => {
    if (isBlocked) return;
    if (isCajaOpen) {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
      return;
    }
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setCajon2State('closed'); // Asegura que solo un cajón esté desplegado a la vez
    setCajon1State(prev => (prev === 'closed' ? 'half' : prev === 'half' ? 'full' : 'closed'));
  }, [isBlocked, isCajaOpen]);

  /** Cierra o retrocede el Cajón 1 */
  const closeCajon1 = useCallback(() => {
    if (isBlocked) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setCajon1State(prev => (prev === 'full' ? 'half' : 'closed'));
  }, [isBlocked]);

  /** Cicla el Cajón 2: cerrado → mitad → completo → cerrado */
  const cycleCajon2 = useCallback(() => {
    if (isBlocked) return;
    if (isCajaOpen) {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
      return;
    }
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setCajon1State('closed'); // Asegura que solo un cajón esté desplegado a la vez
    setCajon2State(prev => (prev === 'closed' ? 'half' : prev === 'half' ? 'full' : 'closed'));
  }, [isBlocked, isCajaOpen]);

  /** Cierra o retrocede el Cajón 2 */
  const closeCajon2 = useCallback(() => {
    if (isBlocked) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setCajon2State(prev => (prev === 'full' ? 'half' : 'closed'));
  }, [isBlocked]);

  /** Alterna la posición de la caja (pos 1 ↔ pos 2) */
  const toggleCaja = useCallback(() => {
    if (isBlocked) return;
    if (isAnyDrawerOpen) {
      // Bloqueado: Si algún cajón está abierto, no se puede mover la caja
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
      return;
    }
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    setCajaPos(prev => (prev === 1 ? 2 : 1));
  }, [isBlocked, isAnyDrawerOpen]);

  return {
    cajon1State,
    cajon2State,
    cajaPos,
    isCajaOpen,
    isAnyDrawerOpen,
    cycleCajon1,
    closeCajon1,
    cycleCajon2,
    closeCajon2,
    toggleCaja,
  };
};
