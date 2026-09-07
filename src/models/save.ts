// src/models/save.ts

export interface IOperatorProfile {
  fullName: string;
  employeeCode: string;
  emergencyContact: string;
  sectorAssigned: string;
  registeredAt: number;
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
