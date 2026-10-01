// Clinical EMR Core Domain Types for Dr. Roby Clinic

export type ActorRole = 'Doctor' | 'Nurse';

export type NurseLifecycle = 'ACTIVE' | 'DEACTIVATED';

export type OperatingMode = 'DOCTOR_ONLY' | 'DOCTOR_NURSE';

export type Gender = 'Male' | 'Female';

export type CaseState =
  | 'Arrived — Awaiting Registration'
  | 'Awaiting Doctor'
  | 'With Doctor'
  | 'Exited — Follow-up Pending'
  | 'Completed';

export type ArrivalCondition = 'Normal' | 'Moderately Unwell' | 'Severely Unwell';

export type ClinicDayStatus = 'OPEN' | 'CLOSED';
export type ClinicDayLifecycle = 'WORKING' | 'CONCLUDED';

export interface PastHistory {
  chronicIllnesses: string[];
  knownAllergies: string[];
  surgicalHistory: string[];
  familyHistory: string[];
  lifestyleNotes: string;
}

export interface PatientRecord {
  patientId: string; // UUID technical identity
  clinicPatientNumber: string; // Sequential CPN e.g. CPN-1001 (Patient-level, persistent)
  name: string;
  dateOfBirth: string; // YYYY-MM-DD (Authoritative)
  profession: string;
  phone: string;
  gender: Gender;
  pastHistory: PastHistory;
  registeredAt: string;
}

export interface VitalSigns {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  temperatureCelsius?: number;
  oxygenSaturation?: number;
}

export type InvestigationCategory = 'Laboratory' | 'Radiology';

export interface InvestigationItem {
  id: string;
  category: InvestigationCategory;
  name: string;
  notes?: string;
  urgent?: boolean;
}

export interface MedicationRegimenItem {
  id: string;
  name: string;
  strength: string; // e.g. 500mg, 10mg/5ml
  form: string; // Tablet, Capsule, Syrup, Inhaler, Topical Cream, Injection, Drops
  dose: string; // e.g. 1 tablet, 10ml, 2 puffs
  frequency: string; // e.g. Once daily, BID (every 12h), TID (every 8h), PRN
  route: string; // Oral, Topical, Inhalation, IM, IV, Sublingual
  duration: string; // e.g. 7 days, 14 days, 30 days
  quantity?: string; // e.g. 1 box, 2 strips, 100ml bottle
  instructions: string; // e.g. Take after food, avoid sun exposure
  prn?: boolean; // Pro re nata (as needed)
}

export interface Prescription {
  id: string;
  items: MedicationRegimenItem[];
  clinicalCounseling: string;
  patientInstructions: string;
  isAuthorized: boolean;
  authorizedAt: string | null;
  authorizedBy: string | null; // Must be Attending Physician (Dr. Roby, MD)
}

export interface FollowUpDecision {
  required: boolean;
  intervalDays?: number;
  targetDate?: string;
  clinicalInstructions?: string;
}

export interface VisitRecord {
  id: string; // e.g. V-001
  caseId: string; // Link to Case
  patientId: string; // Link to Patient
  clinicDayId: string; // Link to ClinicDay
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  visitType: 'Visit & Consultation'; // Authoritative fixed type
  operationalStatus: 'ARRIVED' | 'AWAITING_DOCTOR' | 'WITH_DOCTOR' | 'EXITED' | 'COMPLETED';
  caseStateSnapshot: CaseState;
  protectionState: 'OPEN' | 'PROTECTED';
  arrivalCondition: ArrivalCondition;
  operationalContext: string;
  
  // Clinical Encounter Details (Doctor Authority)
  currentComplaint: string;
  vitals?: VitalSigns;
  examinationNotes?: string;
  investigations: InvestigationItem[];
  preliminaryDiagnosis: string;
  finalDiagnosis: string;
  treatmentAdvice: string;
  prescription: Prescription;
  followUp: FollowUpDecision;
  
  exitRecordedAt?: string;
  exitRecordedBy?: ActorRole;
}

export interface CaseRecord {
  id: string; // e.g. C-001
  patientId: string;
  title: string;
  state: CaseState;
  openedClinicDayId: string;
  openedDate: string;
  completedClinicDayId?: string;
  completedDate?: string;
  completedBy?: 'Doctor'; // Only Doctor can complete
  activeVisitId?: string;
}

export interface ClinicDayRecord {
  id: string; // e.g. CD-2026-09-22
  workingDate: string; // YYYY-MM-DD
  status: ClinicDayStatus;
  lifecycle: ClinicDayLifecycle;
  counter: number;
  openedAt: string;
  closedAt?: string;
  closedBy?: 'Doctor';
}
