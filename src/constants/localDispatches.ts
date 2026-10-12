// src/constants/localDispatches.ts
/**
 * Despachos y comunicados locales de emergencia del Consorcio Stratton-Tate (C.S.T.).
 * Representa la fuente de datos offline preinstalada en la ROM de la garita.
 */

export interface ICstDispatch {
  id: number;
  title: string;
  body: string;
  sector: string;
  timestamp: string;
  source: 'LOCAL_OFFLINE' | 'CLOUD_REST' | 'CACHE_STORAGE';
}

export const LOCAL_CST_DISPATCHES: ICstDispatch[] = [
  {
    id: 101,
    title: 'PROTOCOLO DE AISLAMIENTO NOCTURNO',
    body: 'A partir de las 03:00 hrs, ninguna unidad externa tiene autorización de acceso sin el sello carmesí de la división médica.',
    sector: 'GARITA-NORTE',
    timestamp: '03:00:12 CST',
    source: 'LOCAL_OFFLINE',
  },
  {
    id: 102,
    title: 'FALLA EN SENSOR DE PRESIÓN HIDRÁULICA',
    body: 'El actuador de la compuerta perimetral presenta pérdida de fluido. Mantener la persiana asegurada con el pestillo manual.',
    sector: 'MANTENIMIENTO-SUB4',
    timestamp: '02:45:00 CST',
    source: 'LOCAL_OFFLINE',
  },
  {
    id: 103,
    title: 'ALERTA DE ABSTINENCIA EN PERSONAL',
    body: 'Reportar temblores en extremidades o distorsiones auditivas en el espejo retrovisor. Administrar ración de sedante si es necesario.',
    sector: 'DIVISIÓN-MÉDICA',
    timestamp: '01:15:30 CST',
    source: 'LOCAL_OFFLINE',
  },
];
