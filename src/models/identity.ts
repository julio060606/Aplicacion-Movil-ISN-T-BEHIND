// src/models/identity.ts
/**
 * =========================================================================
 * MODELO CANÓNICO DE IDENTIDAD Y BUROCRACIA CIVIL / C.S.T.
 * =========================================================================
 * Define las entidades de identidad personal (estilo credencial federal de EE.UU.)
 * y estatus de residencia corporativo bajo el régimen de Portwall.
 */

export type PersonSex = 'M' | 'F' | 'X';

/**
 * 1. Identidad Civil Canónica (DNI / State ID estilo EE.UU. 2000s)
 */
export interface IPersonIdentity {
  /** Nombre completo en formato anglosajón / burocrático: "APELLIDO, NOMBRE M." */
  fullName: string;
  /** Código de identidad civil (Formato SSN / Federal ID: "XXX-XX-XXXX") */
  idNumber: string;
  /** Fecha de nacimiento en formato "MM/DD/YYYY" */
  birthDate: string;
  /** Sexo registral: Masculino, Femenino o No determinado */
  sex: PersonSex;
  /** Fecha de expiración del carnet "MM/DD/YYYY" */
  expiryDate: string;
  /** Distrito de emisión o nacionalidad */
  nationality: string;
  /** URI opcional de fotografía capturada o null si aún no existe */
  photoUri: string | null;
}

/**
 * 2. Estatus Burocrático y Residencia C.S.T. (Formulario de Concesión / Estadía)
 */
export interface ICitizenStayStatus {
  /** Nivel o rango ciudadano asignado por el régimen */
  citizenLevel: string;
  /** Código de permiso de estadía / residencia */
  stayCode: string;
  /** Sector comercial o cuadrante asignado */
  sectorAssigned: string;
  /** Código de autorización laboral C.S.T. */
  workAuthorizationCode: string;
}

/**
 * Datos canónicos de identidad del protagonista (impresos en su DNI inicial)
 */
export const PROTAGONIST_IDENTITY: IPersonIdentity = {
  fullName: 'VANCE, JOHN E.',
  idNumber: '941-20-8841',
  birthDate: '04/18/1972',
  sex: 'M',
  expiryDate: '11/10/2004',
  nationality: 'PORTWALL DIST.',
  photoUri: null,
};

/**
 * Datos de residencia y concesión iniciales del protagonista
 */
export const PROTAGONIST_STAY_STATUS: ICitizenStayStatus = {
  citizenLevel: 'NIVEL 3 [RESIDENTE]',
  stayCode: 'ST-4092-B',
  sectorAssigned: 'SECTOR 4 - PORTWALL',
  workAuthorizationCode: 'CST-AUTH-4092',
};
