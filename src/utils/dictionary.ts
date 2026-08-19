// src/utils/dictionary.ts

/**
 * Diccionario centralizado de cadenas y textos de interfaz de ISN'T BEHIND
 * Facilita localización y centralización de textos de lore.
 */
export const dictionary = {
  institution: {
    fullName: 'CONSORCIO INDUSTRIAL S.T. - C.S.T.',
    systemName: 'TERMINAL DE CONTROL Y GESTIÓN NOCTURNA',
    sector: 'SECTOR 4',
  },
  menu: {
    story: '[ STORY ]',
    settings: '[ SETTINGS ]',
    exit: '[ EXIT ]',
    credits: 'credits',
  },
  shift: {
    startSession: '[ INICIAR SESIÓN ]',
    startShift: '[ INICIAR TURNO ]',
    confirmTransmission: '[ CONFIRMAR RECEPCIÓN ]',
    abandon: '[ ABANDONAR ]',
    approve: '[ APROBAR ]',
    reject: '[ RECHAZAR ]',
    strikes: 'STRIKES',
  },
  messages: {
    workstationEnabled: 'SU ESTACIÓN DE TRABAJO HA SIDO HABILITADA.',
    consorcioWarning: 'EVITE ERRORES. EL CONSORCIO NO PERDONA.',
    radioStatic: '>> CONEXIÓN ESTABLECIDA... C.S.T. RED DE TRANSMISIÓN LOCAL... SECTOR 4 APERTURADO... ESPERE NUEVAS DIRECTIVAS.',
  },
} as const;
