// src/models/types.ts

/**
 * Parámetros fuertemente tipados para la pila de navegación principal
 */
export type RootStackParamList = {
  MainMenu: undefined;
  WeeklyIntro: { weekNumber?: number };
  DailyIntro: { dayNumber: number };
  GameInterface: { currentDay: number; shiftConfigId?: string };
  Shift: undefined; // Alias retrocompatible de GameInterface
};