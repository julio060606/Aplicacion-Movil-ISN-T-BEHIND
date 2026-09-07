// src/hooks/useShiftEngine.ts
import { useReducer, useEffect } from 'react';
import { IShiftState, ShiftAction } from '../models/shift';
import { IDayConfiguration } from '../models/config';

// Estado inicial vacío (se hidratará con la configuración del día)
const initialShiftState: IShiftState = {
  dayNumber: 1,
  phase: 'PRE_SHIFT',
  elapsedRealSeconds: 0,
  totalShiftSeconds: 180,
  inGameTime: '00:00',
  strikes: 0,
  maxStrikes: 3,
  currentVisitor: null,
  visitorQueue: [],
  activeAnomalies: [],
  isBehindChecked: false,
  lastLookBehindTimestamp: 0,
};

function shiftReducer(state: IShiftState, action: ShiftAction): IShiftState {
  switch (action.type) {
    case 'TICK':
      // Avanzar el tiempo real e in-game
      return { ...state, elapsedRealSeconds: state.elapsedRealSeconds + (action.deltaMs / 1000) };
    case 'PAUSE_SHIFT':
      return { ...state, phase: 'PAUSED' };
    case 'RESUME_SHIFT':
      return { ...state, phase: 'RUNNING' };
    // TODO: Implementar el resto de acciones (Despachar visitante, Sellar, Mirar atrás)
    default:
      return state;
  }
}

export const useShiftEngine = (config: IDayConfiguration) => {
  const [state, dispatch] = useReducer(shiftReducer, {
    ...initialShiftState,
    dayNumber: config.dayNumber,
    totalShiftSeconds: config.shiftDurationSeconds,
    maxStrikes: config.maxStrikesAllowed,
  });

  // TODO: Implementar el Game Loop (requestAnimationFrame o setInterval desacoplado)
  
  return {
    state,
    dispatch,
  };
};
