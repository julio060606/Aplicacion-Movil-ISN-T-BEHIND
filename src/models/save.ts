// src/models/save.ts
import { IPersonIdentity, ICitizenStayStatus } from './identity';

export interface IOperatorProfile {
  identity?: IPersonIdentity;
  stayStatus?: ICitizenStayStatus;
  /** Timestamp de registro de la partida */
  registeredAt: number;
  /** Campos de compatibilidad previa */
  fullName?: string;
  employeeCode?: string;
  emergencyContact?: string;
  sectorAssigned?: string;
}

export interface ISaveGameSchema {
  schemaVersion: number;
  lastPlayedTimestamp: number;
  currentDay: number;
  unlockedEndings: string[];
  statistics: {
    totalShiftsCompleted: number;
    totalVisitorsProcessed: number;
    totalCorrectDecisions: number;
    deathsCount: number;
  };
  settings: {
    masterVolume: number;
    sfxVolume: number;
    hapticsEnabled: boolean;
    screenShakeEnabled: boolean;
  };
}
