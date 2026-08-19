// src/theme/typography.ts
/**
 * =========================================================================
 * MAPA TIPOGRÁFICO DEFINITIVO // CONTEXTO HISTÓRICO CORPORATIVO AÑOS 2000
 * =========================================================================
 * Asignación semántica de fuentes para UI diegética, documentos, sellos,
 * pantallas digitales y manuscritos anómalos de "ISN'T BEHIND".
 */
export const TYPOGRAPHY = {
  // 1. SISTEMA OPERATIVO & TERMINAL CRT
  systemPC: 'Inconsolata-Light',

  // 2. SELLOS OFICIALES Y DÍA
  stamps: 'Syne-Mono',

  // 3. IMPRESORA DE FAX Y MULTAS
  faxMain: 'ShareTechMono-Regular',
  faxSecondary: 'VT323-Regular',

  // 4. PANTALLAS DIGITALES (CCTV, RELOJ Y CAJA REGISTRADORA)
  digitalMain: 'ChakraPetch-Regular',
  digitalSecondary: 'Orbitron-Regular',

  // 5. DOCUMENTOS Y EXPEDIENTES
  dirtyDoc: 'SpecialElite-Regular', // Cuaderno de notas, pasaportes antiguos
  cleanDoc: 'CourierPrime-Regular', // Contratos oficiales, letra pequeña corporativa

  // 6. MANUSCRITOS Y ADULTERACIONES
  handwriting: 'Caveat-Regular',                 // Firmas y notas a mano alzada
  handwritingNumbers: 'NanumPenScript-Regular',  // Números / fechas adulteradas a mano
} as const;

export type TypographyTokens = keyof typeof TYPOGRAPHY;
