/**
 * =========================================================================
 * src/hooks/useTurnEngine.ts
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Lógica pura del turno de juego.
 *
 * Este hook NO contiene:
 *   ✗ Estado de UI (cajones abiertos, monitor visible, carrusel enfocado)
 *   ✗ Animaciones
 *   ✗ PanResponders
 *
 * Eso vive en:
 *   → useOverlays.ts  (monitor, caja, apuntar)
 *   → useDrawers.ts   (cajones + carrusel de mesa)
 *   → useSceneCamera.ts (zoom, paneo, lámpara)
 *
 * Este hook SÍ contiene:
 *   ✓ Estado IShiftState (reloj in-game, strikes, economía, estrés)
 *   ✓ Acciones del jugador (vender, aprobar/rechazar visitante, tomar píldora)
 *   ✓ Lógica de negocio pura (reglas del turno)
 * =========================================================================
 */

import { useState, useCallback } from 'react';

// ── Tipos del dominio del juego ───────────────────────────────────────────────
export type ShiftPhase = 'PRE_SHIFT' | 'RUNNING' | 'PAUSED' | 'EVALUATION' | 'ENDED';

export interface IShiftState {
  dayNumber: number;
  phase: ShiftPhase;
  elapsedRealSeconds: number;
  /** Duración total del turno en segundos reales (ej: 180s = 12 horas in-game) */
  totalShiftSeconds: number;
  /** Hora in-game formateada: '12:00' → '00:00' */
  inGameTime: string;
  strikes: number;
  maxStrikes: number;
  /** 0-100. Invisible para el jugador. Sube con anomalías sin resolver. */
  stressLevel: number;
  /** 0-100. Invisible. Sube si no toma fármacos. Afecta alucinaciones. */
  withdrawalLevel: number;
}

// ── Estado inicial ────────────────────────────────────────────────────────────
const buildInitialState = (dayNumber: number): IShiftState => ({
  dayNumber,
  phase: 'RUNNING',
  elapsedRealSeconds: 0,
  totalShiftSeconds: 180,
  inGameTime: '12:00',
  strikes: 0,
  maxStrikes: 3,
  stressLevel: 0,
  withdrawalLevel: 0,
});

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useTurnEngine = (currentDay: number) => {
  const [shiftState, setShiftState] = useState<IShiftState>(
    () => buildInitialState(currentDay)
  );

  // ── Acciones del jugador (lógica de negocio) ──────────────────────────────

  const sellAtLegalPrice = useCallback((productId: string, quantity: number) => {
    // TODO: registrar en economyState.inventoryLog, calcular auditRisk
    console.log(`[TurnEngine] Venta legal: ${quantity}x ${productId}`);
  }, []);

  const sellAtBlackMarketPrice = useCallback((productId: string, price: number) => {
    // TODO: registrar en blackMarketBalance, subir auditRisk
    console.log(`[TurnEngine] Venta mercado negro: ${productId} a $${price}`);
  }, []);

  const rejectVisitor = useCallback((reason: string) => {
    // TODO: evaluar si el rechazo es correcto → strike o no
    console.log(`[TurnEngine] Visitante rechazado: ${reason}`);
  }, []);

  const approveVisitor = useCallback(() => {
    // TODO: evaluar si la aprobación es correcta → strike o no
    console.log('[TurnEngine] Visitante aprobado');
  }, []);

  const takeCSTPill = useCallback(() => {
    // Reduce el nivel de abstinencia en 20 puntos (regla de negocio documentada)
    setShiftState(prev => ({
      ...prev,
      withdrawalLevel: Math.max(0, prev.withdrawalLevel - 20),
      stressLevel: Math.max(0, prev.stressLevel - 10),
    }));
    console.log('[TurnEngine] Píldora CST consumida');
  }, []);

  const cuadrarLibros = useCallback(() => {
    // TODO: validar que inventoryLog coincide con el registro visible
    console.log('[TurnEngine] Cuadrando libros...');
  }, []);

  const addStrike = useCallback((reason: string) => {
    setShiftState(prev => {
      const newStrikes = prev.strikes + 1;
      console.log(`[TurnEngine] Strike ${newStrikes}/${prev.maxStrikes}: ${reason}`);
      return {
        ...prev,
        strikes: newStrikes,
        phase: newStrikes >= prev.maxStrikes ? 'ENDED' : prev.phase,
      };
    });
  }, []);

  return {
    shiftState,
    currentInGameTime: shiftState.inGameTime,
    // Acciones
    sellAtLegalPrice,
    sellAtBlackMarketPrice,
    rejectVisitor,
    approveVisitor,
    takeCSTPill,
    cuadrarLibros,
    addStrike,
  };
};
