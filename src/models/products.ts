/**
 * =========================================================================
 * src/models/products.ts
 * =========================================================================
 * Modelos de datos para productos y mercancías que llegan a la ventanilla.
 * =========================================================================
 */

export interface IProductItem {
  id: string;
  name: string;
  shortName: string;
  code: string;
  category: 'ALIMENTO' | 'MEDICINA' | 'CONTRABANDO' | 'COMBUSTIBLE';
  officialPrice: number;
  blackMarketPrice: number;
  weightKg: number;
  hasUvStamp: boolean;
  uvStampText: string;
  iconType: 'LATA' | 'MEDICINA' | 'CIGARROS' | 'GASOLINA';
  notes: string;
}

export const INITIAL_PRODUCTS_PILE: IProductItem[] = [
  {
    id: 'prod-01',
    name: 'RACIÓN DE CARNE MAGRA C.S.T.',
    shortName: 'LATA CARNE',
    code: 'CST-RAC-104',
    category: 'ALIMENTO',
    officialPrice: 12,
    blackMarketPrice: 28,
    weightKg: 0.5,
    hasUvStamp: true,
    uvStampText: '★ LOTE C.S.T. OFICIAL #884-A ★',
    iconType: 'LATA',
    notes: 'Ración de carne prensada de contingencia. Precinto intacto.',
  },
  {
    id: 'prod-02',
    name: 'ESTABILIZADOR ANTIBIÓTICO',
    shortName: 'ANTIBIÓTICO',
    code: 'MED-CST-500',
    category: 'MEDICINA',
    officialPrice: 25,
    blackMarketPrice: 65,
    weightKg: 0.2,
    hasUvStamp: true,
    uvStampText: '★ PHARM-CST: APTO SECTOR 4 ★',
    iconType: 'MEDICINA',
    notes: 'Frasco farmacológico de amplio espectro. Uso regulado.',
  },
  {
    id: 'prod-03',
    name: 'TABACO RUBIO SIN FILTRO',
    shortName: 'CIGARRILLOS',
    code: 'CONTR-TAB-09',
    category: 'CONTRABANDO',
    officialPrice: 8,
    blackMarketPrice: 35,
    weightKg: 0.1,
    hasUvStamp: false,
    uvStampText: '⚠ NO REGISTRADO // FALSIFICADO ⚠',
    iconType: 'CIGARROS',
    notes: 'Paquete de contrabando sin timbrado aduanero. Alta demanda.',
  },
  {
    id: 'prod-04',
    name: 'QUEROSENO DE SERVICIO 2L',
    shortName: 'BIDÓN 2L',
    code: 'FUEL-CST-02',
    category: 'COMBUSTIBLE',
    officialPrice: 18,
    blackMarketPrice: 42,
    weightKg: 1.8,
    hasUvStamp: true,
    uvStampText: '★ COMBUSTIBLE REFINADO C.S.T. ★',
    iconType: 'GASOLINA',
    notes: 'Combustible para estufas y generadores de semisótano.',
  },
];
