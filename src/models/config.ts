// src/models/config.ts

export type DiscrepancyType = 
  | 'EXPIRED_DOC' 
  | 'MISMATCHED_NAME' 
  | 'INVALID_DISTRICT' 
  | 'UNCANNY_FACE' 
  | 'MISSING_STAMP';

export interface IDayConfiguration {
  dayNumber: number;
  shiftDurationSeconds: number;
  visitorCount: { min: number; max: number };
  anomalyProbability: number; // 0.0 a 1.0
  allowedDiscrepancies: DiscrepancyType[];
  activeDirectives: string[];
  maxStrikesAllowed: number;
  ambientWeather: 'CLEAR' | 'FOG' | 'HEAVY_RAIN' | 'ELECTRICAL_STORM';
  radioIntroTrackId?: string;
}
