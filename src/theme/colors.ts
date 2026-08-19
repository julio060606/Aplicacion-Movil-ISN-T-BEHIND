// src/theme/colors.ts
/**
 * Paleta de colores institucional y CRT para "ISN'T BEHIND"
 * Temática: Terminal industrial vintage, fósforo verde, sello burocrático y horror analógico.
 */
export const colors = {
  // Fondos y superficies
  background: '#060606',
  surfaceDark: '#0d0d0d',
  surfaceCard: '#141414',
  surfaceOverlay: 'rgba(6, 6, 6, 0.85)',
  surfaceHighlight: '#1f1f1f',

  // Terminal CRT y fósforo
  crtGreen: '#00ff66',
  crtGreenDim: 'rgba(0, 255, 102, 0.6)',
  crtGreenGlow: 'rgba(0, 255, 102, 0.15)',
  crtAmber: '#ffb000',

  // Sello burocrático CST y alertas
  stampRed: '#641111',
  stampRedBright: '#8a0303',
  stampRedDim: 'rgba(100, 17, 17, 0.5)',
  danger: '#e63946',
  warning: '#f4a261',

  // Textos y contrastes
  textPrimary: '#ffffff',
  textSecondary: '#d4d4d4',
  textMuted: '#888888',
  textSubtle: '#555555',
  textDisabled: '#333333',

  // Bordes y separadores
  borderDark: '#222222',
  borderMedium: '#444444',
  borderLight: '#666666',

  // =========================================================================
  // PALETA COLORBOXING (UI DIEGÉTICA & MOCKS DE ALTO CONTRASTE)
  // =========================================================================
  colorbox: {
    mirrorConvex: '#d97706',       // Naranja intenso (Espejo retrovisor)
    cctvClock: '#0284c7',          // Cyan / Azul monitor (CCTV / Reloj)
    clientArea: '#1e293b',         // Azul grisáceo oscuro (Sprite del Cliente)
    docCarousel: '#78350f',        // Marrón madera / papel (Carrusel de Docs)
    uvLamp: '#6b21a8',             // Púrpura UV (Lámpara ultravioleta)
    keyboard: '#374151',           // Gris carbón (Teclado mecánico)
    drawerStorage: '#1e3a8a',      // Azul acero oscuro (Cajones de guardado)
    inventory: '#065f46',          // Verde esmeralda profundo (Inventario)
    pcTerminal: '#0f172a',         // Azul marino / terminal PC
    faxPrinter: '#991b1b',         // Rojo oscuro industrial (Impresora Fax)
    faxFinePaper: '#fef2f2',       // Blanco hueso / Multa
    hangingClipboard: '#b45309',   // Mostaza / Cuero (Comandas)
    draggableNotebook: '#451a03',  // Cuero oscuro (Cuaderno del jugador)
    cashRegister: '#064e3b',       // Verde caja registradora
    dividerLine: '#641111',        // Línea roja divisoria
  },

  // Cajas Grises / Mocks para desarrollo genérico
  mockGraybox: '#2a2a2a',
  mockBorder: '#3a3a3a',
  mockAccent: '#555555',
} as const;

export type ColorTokens = keyof typeof colors;
