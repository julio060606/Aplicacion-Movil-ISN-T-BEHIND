// src/models/types.ts

// Pantallas y flujos de evaluación
export type GameOverReason = 
  | 'SANITY_DEPLETED' 
  | 'ENTITY_ATTACK' 
  | 'STRIKE_LIMIT_REACHED' 
  | 'TIME_EXPIRED';

export interface ShiftEvaluation {
  processedVisitors: number;
  correctDecisions: number;
  mistakes: number;
  paranoiaPeak: number;
  salaryEarned: number;
}

/**
 * Parámetros fuertemente tipados para la navegación por pestañas (Tabs) del expediente
 */
export type DossierTabParamList = {
  DirectivesTab: undefined;
  AnomaliesTab: undefined;
  SystemLogsTab: undefined;
};

/**
 * Parámetros fuertemente tipados para el Drawer (Menú lateral de CST)
 */
export type MenuDrawerParamList = {
  HomeMenu: undefined;
  ManualDossier: undefined;
  Settings: undefined;
};

/**
 * Parámetros fuertemente tipados para la pila de navegación principal (Stack)
 */
export type RootStackParamList = {
  MenuDrawer: undefined;
  MainMenu: undefined;
  OperatorRegistration: undefined;
  WeeklyIntro: { weekNumber?: number };
  DailyIntro: { dayNumber: number };
  GameInterface: { currentDay: number; shiftConfigId?: string };
  Shift: undefined; // Alias retrocompatible de GameInterface
  Settings: undefined;
  GameOver: { reason: GameOverReason; dayNumber: number; score: number };
  Victory: { dayNumber: number; finalEvaluation: ShiftEvaluation };
};