// src/models/shift.ts
import { IVisitor } from './visitor';
import { IActiveAnomaly } from './sanity';

export type ShiftPhase = 'PRE_SHIFT' | 'RUNNING' | 'PAUSED' | 'EVALUATION' | 'ENDED';

export interface IShiftState {
  dayNumber: number;
  phase: ShiftPhase;
  elapsedRealSeconds: number;
  totalShiftSeconds: number; // Ej: 180s (3 minutos = 6 horas in-game)
  inGameTime: string;        // "00:00" - "06:00"
  strikes: number;           // Infracciones cometidas en el turno
  maxStrikes: number;        // Límite de infracciones permitidas (ej. 3)
  currentVisitor: IVisitor | null;
  visitorQueue: IVisitor[];
  activeAnomalies: IActiveAnomaly[];
  isBehindChecked: boolean;
  lastLookBehindTimestamp: number;
}

export type ShiftAction =
  | { type: 'TICK'; deltaMs: number }
  | { type: 'PAUSE_SHIFT' }
  | { type: 'RESUME_SHIFT' }
  | { type: 'SPAWN_VISITOR'; visitor: IVisitor }
  | { type: 'DECIDE_VISITOR'; decision: 'APPROVE' | 'REJECT' }
  | { type: 'TRIGGER_ANOMALY'; anomaly: IActiveAnomaly }
  | { type: 'RESOLVE_ANOMALY'; anomalyId: string }
  | { type: 'CHECK_BEHIND' }
  | { type: 'RETURN_TO_DESK' };
