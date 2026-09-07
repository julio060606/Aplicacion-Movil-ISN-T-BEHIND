// src/models/visitor.ts

export interface IDocumentData {
  id: string;
  documentType: 'ID_CARD' | 'ENTRY_PERMIT' | 'HEALTH_PASS' | 'LETTER';
  fields: {
    fullName: string;
    birthDate?: string;
    expiryDate?: string;
    district?: string;
    stampCode?: string;
    [key: string]: string | number | boolean | undefined;
  };
  hasDiscrepancy: boolean;
  discrepancyType?: 'EXPIRED_DATE' | 'WRONG_NAME' | 'FORGED_SEAL' | 'ANOMALOUS_FACE';
  photoPlaceholder?: string;
  position?: { x: number; y: number };
  isInspecting?: boolean;
  stampApplied?: 'APPROVED' | 'REJECTED' | null;
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
