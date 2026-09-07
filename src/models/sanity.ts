// src/models/sanity.ts

export type AnomalyCategory = 'DOCUMENT_ANOMALY' | 'LIGHT_OUTAGE' | 'PHONE_LORE' | 'BEHIND_SHADOW';

export interface IActiveAnomaly {
  id: string;
  category: AnomalyCategory;
  triggerTimeMs: number;
  timeLimitMs: number;
  resolved: boolean;
  penaltyStress: number;
  penaltyStalker: number;
}

export interface ISanityMetrics {
  stressLevel: number; // 0 - 100
  paranoiaMultiplier: number; // 1.0 - 3.0
  stalkerThreatLevel: number; // 0 - 100
  hallucinationLevel: 'NONE' | 'SUBTLE' | 'MODERATE' | 'SEVERE';
  lastStressSpikeTimestamp: number;
}

export interface IPsychologicalDistortion {
  id: string;
  type: 'UI_SHAKE' | 'TEXT_SCRAMBLE' | 'LIGHT_FLICKER' | 'PHANTOM_SOUND' | 'FALSE_SHADOW';
  intensity: number; // 0.0 - 1.0
  durationMs: number;
}
