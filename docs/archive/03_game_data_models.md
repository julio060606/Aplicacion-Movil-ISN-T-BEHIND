# 📜 MODELOS DE DATOS Y CONTRATOS NARRATIVOS (Para el Game Designer y Guionista)
**Proyecto:** ISN'T BEHIND (Simulador de Gestión & Thriller Psicológico 2D)  
**Target:** React Native 0.85+ / Expo SDK 56+  
**Última Actualización:** 2026-08-18  

---

## 1. INTERFACES TYPESCRIPT ACTUALES DEL SISTEMA

### A. Parámetros de Navegación del Flujo Narrativo
Definidos en [`src/models/types.ts`](file:///src/models/types.ts):

```typescript
export type RootStackParamList = {
  MainMenu: undefined;
  WeeklyIntro: { weekNumber?: number };
  DailyIntro: { dayNumber: number };
  GameInterface: { currentDay: number; shiftConfigId?: string };
  Shift: undefined; // Alias retrocompatible de GameInterface
};
```

### B. Modelo del Turno y Cola de Visitantes (Dominio del Juego)

```typescript
export type ShiftPhase = 'PRE_SHIFT' | 'RUNNING' | 'PAUSED' | 'EVALUATION' | 'ENDED';

export interface IShiftState {
  dayNumber: number;
  phase: ShiftPhase;
  elapsedRealSeconds: number;
  totalShiftSeconds: number; // Ej: 180s (3 minutos = 6 horas in-game)
  inGameTime: string;        // "00:00" - "06:00"
  strikes: number;           // Infracciones cometidas en el turno
  maxStrikes: number;        // Límite de infracciones permitidas (ej. 3)
  currentVisitor: IVisitor | null;
  visitorQueue: IVisitor[];
  activeAnomalies: IActiveAnomaly[];
  isBehindChecked: boolean;
}

export interface IVisitor {
  id: string;
  name: string;
  photoId: string;
  appearanceDescription: string;
  documents: IDocumentData[];
  dialogues: {
    greeting: string;
    onQuestion: string;
    onApprove: string;
    onReject: string;
  };
  expectedDecision: 'APPROVE' | 'REJECT';
  rejectionReason?: string;
  isEntity: boolean; // Si es un impostor/anomalía
}

export interface IDocumentData {
  id: string;
  documentType: 'ID_CARD' | 'ENTRY_PERMIT' | 'HEALTH_PASS' | 'LETTER';
  fields: {
    fullName: string;
    birthDate: string;
    expiryDate: string;
    district: string;
    stampCode: string;
  };
  hasDiscrepancy: boolean;
  discrepancyType?: 'EXPIRED_DATE' | 'WRONG_NAME' | 'FORGED_SEAL' | 'ANOMALOUS_FACE';
}

export interface IActiveAnomaly {
  id: string;
  category: 'DOCUMENT_ANOMALY' | 'LIGHT_OUTAGE' | 'PHONE_LORE' | 'BEHIND_SHADOW';
  triggerTimeSeconds: number;
  timeLimitSeconds: number;
  penaltyStress: number;
  penaltyStalker: number;
}
```

---

## 2. FORMATO JSON REQUERIDO PARA CARGA DE DÍAS Y DIÁLOGOS

El motor de juego consume archivos de configuración declarativos en formato JSON para inicializar cada jornada. A continuación se detallan los esquemas exactos:

### A. Archivo de Configuración de Día (`day_01.json`)

```json
{
  "dayNumber": 1,
  "weekNumber": 1,
  "shiftDurationSeconds": 180,
  "maxStrikesAllowed": 3,
  "ambientWeather": "FOG",
  "radioTransmission": {
    "frequency": "84.2",
    "message": ">> CONEXIÓN ESTABLECIDA... C.S.T. RED DE TRANSMISIÓN LOCAL... SECTOR 4 APERTURADO... ESPERE NUEVAS DIRECTIVAS."
  },
  "directives": [
    "Verificar que la fecha de expiración del documento sea posterior a 1986.",
    "El sello CST debe tener el código de autorización C.S.T.-04.",
    "Rechazar inmediatamente a cualquier sujeto con discrepancias en su nombre."
  ],
  "visitors": [
    {
      "id": "vis_day1_001",
      "name": "ARTHUR VANCE",
      "photoId": "photo_male_40s_normal",
      "appearanceDescription": "Hombre de mediana edad, abrigo gris desgastado.",
      "documents": [
        {
          "id": "doc_001_id",
          "documentType": "ID_CARD",
          "fields": {
            "fullName": "ARTHUR VANCE",
            "birthDate": "12/04/1942",
            "expiryDate": "15/11/1988",
            "district": "SECTOR INDUSTRIAL NORTE",
            "stampCode": "C.S.T.-04"
          },
          "hasDiscrepancy": false
        }
      ],
      "dialogues": {
        "greeting": "Buenas noches, oficial. Vengo del turno de fundición.",
        "onQuestion": "Mis papeles están en regla. Solo quiero regresar a mi dormitorio.",
        "onApprove": "Gracias. Que termine tranquilo su turno.",
        "onReject": "¿Qué dice? ¡Tiene que ser un error, déjeme pasar!"
      },
      "expectedDecision": "APPROVE",
      "isEntity": false
    },
    {
      "id": "vis_day1_002",
      "name": "MARGARET O'NEIL",
      "photoId": "photo_female_30s_uncanny",
      "appearanceDescription": "Mujer joven, mirada fija sin pestañear.",
      "documents": [
        {
          "id": "doc_002_id",
          "documentType": "ID_CARD",
          "fields": {
            "fullName": "MARGARET O'NEIL",
            "birthDate": "03/09/1955",
            "expiryDate": "01/01/1984",
            "district": "SECTOR RESIDENCIAL ESTE",
            "stampCode": "C.S.T.-04"
          },
          "hasDiscrepancy": true,
          "discrepancyType": "EXPIRED_DATE"
        }
      ],
      "dialogues": {
        "greeting": "Permiso de tránsito nocturno. Por favor.",
        "onQuestion": "...El frío no deja pensar con claridad.",
        "onApprove": "...",
        "onReject": "Usted no debería estar mirando los papeles... debería mirar atrás."
      },
      "expectedDecision": "REJECT",
      "rejectionReason": "DOCUMENTO VENCIDO (EXP. 1984)",
      "isEntity": true
    }
  ],
  "scheduledAnomalies": [
    {
      "id": "anom_day1_01",
      "category": "LIGHT_OUTAGE",
      "triggerTimeSeconds": 90,
      "timeLimitSeconds": 15,
      "penaltyStress": 20,
      "penaltyStalker": 15
    }
  ]
}
```

---

## 3. GUÍA DE REGLAS NARRATIVAS PARA EL GUIONISTA

1. **Tono y Atmósfera:**
   - La ambientación debe reflejar burocracia opresiva, frialdad industrial vintage (década de los 80) y horror psicológico sutil (estilo *Papers, Please* mezclado con thriller análogo).
2. **Estructura de Diálogos:**
   - Mantener las respuestas cortas (máximo 120 caracteres por línea) para evitar que el texto desborde los contenedores móviles.
3. **Pistas e Inconsistencias:**
   - Los impostores/entidades no siempre son violentos; sus anomalías pueden manifestarse en frases fuera de contexto ("¿Escuchó ese sonido en el pasillo trasero?") o fechas incongruentes.
