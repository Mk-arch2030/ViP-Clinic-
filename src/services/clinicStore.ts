// Clinical Store & Persistence Service for Dr. Roby Clinic
// Preserves Patient -> Case -> Visit -> Clinic Day distinctions
// Strictly derives age from DOB. Preserves clinical authority boundaries.

import {
  PatientRecord,
  CaseRecord,
  VisitRecord,
  ClinicDayRecord,
  ActorRole,
  OperatingMode,
  ArrivalCondition,
  MedicationRegimenItem,
  Prescription,
  InvestigationItem,
  VitalSigns,
  FollowUpDecision,
} from '../domain/types';
import { calculateAge, calculateDetailedAge, DetailedAge } from '../domain/patientAge';

const STORAGE_KEY = 'dr_roby_clinic_emr_v1';

export interface ClinicState {
  patients: PatientRecord[];
  cases: CaseRecord[];
  visits: VisitRecord[];
  clinicDays: ClinicDayRecord[];
  currentClinicDayId: string;
  nextCpnNumber: number;
  actorRole: ActorRole;
  operatingMode: OperatingMode;
}

const INITIAL_CLINIC_DAY: ClinicDayRecord = {
  id: 'CD-2026-09-22',
  workingDate: '2026-09-22',
  status: 'OPEN',
  lifecycle: 'WORKING',
  counter: 3,
  openedAt: '2026-09-22T08:00:00Z',
};

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    patientId: 'a1b2c3d4-0001-7000-8000-000000000001',
    clinicPatientNumber: 'CPN-1001',
    name: 'Ahmed Hassan',
    dateOfBirth: '1988-04-12',
    profession: 'Civil Engineer',
    phone: '+20 100 234 5678',
    gender: 'Male',
    registeredAt: '2026-09-22T08:15:00Z',
    pastHistory: {
      chronicIllnesses: ['None'],
      knownAllergies: ['Seasonal rhinitis / pollen'],
      surgicalHistory: ['Appendectomy (2014)'],
      familyHistory: ['Father: Type 2 Diabetes'],
      lifestyleNotes: 'Non-smoker, desk work 8 hours daily',
    },
  },
  {
    patientId: 'a1b2c3d4-0002-7000-8000-000000000002',
    clinicPatientNumber: 'CPN-1002',
    name: 'Mona Ali',
    dateOfBirth: '1994-09-25',
    profession: 'School Teacher',
    phone: '+20 111 876 5432',
    gender: 'Female',
    registeredAt: '2026-09-22T08:45:00Z',
    pastHistory: {
      chronicIllnesses: ['Bronchial Asthma'],
      knownAllergies: ['Penicillin (causes urticaria/rash)'],
      surgicalHistory: ['None'],
      familyHistory: ['Mother: Hypertension'],
      lifestyleNotes: 'Active school day, uses inhaler intermittently',
    },
  },
  {
    patientId: 'a1b2c3d4-0003-7000-8000-000000000003',
    clinicPatientNumber: 'CPN-1003',
    name: 'Omar Mahmoud',
    dateOfBirth: '1972-11-03',
    profession: 'Senior Accountant',
    phone: '+20 122 345 6789',
    gender: 'Male',
    registeredAt: '2026-09-20T09:00:00Z',
    pastHistory: {
      chronicIllnesses: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      knownAllergies: ['Sulfa drugs'],
      surgicalHistory: ['Knee arthroscopy (2019)'],
      familyHistory: ['Both parents: Ischemic heart disease, diabetes'],
      lifestyleNotes: 'Sedentary, former smoker (quit 2021)',
    },
  },
];

const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'C-001',
    patientId: 'a1b2c3d4-0001-7000-8000-000000000001',
    title: 'Acute Tension-Type Headache & Cervical Strain',
    state: 'Awaiting Doctor',
    openedClinicDayId: 'CD-2026-09-22',
    openedDate: '2026-09-22',
    activeVisitId: 'V-001',
  },
  {
    id: 'C-002',
    patientId: 'a1b2c3d4-0002-7000-8000-000000000002',
    title: 'Acute Asthma Exacerbation with Upper Respiratory Triggers',
    state: 'With Doctor',
    openedClinicDayId: 'CD-2026-09-22',
    openedDate: '2026-09-22',
    activeVisitId: 'V-002',
  },
  {
    id: 'C-003',
    patientId: 'a1b2c3d4-0003-7000-8000-000000000003',
    title: 'T2DM Glycemic Control & Peripheral Neuropathy Assessment',
    state: 'Exited — Follow-up Pending',
    openedClinicDayId: 'CD-2026-09-20',
    openedDate: '2026-09-20',
    activeVisitId: 'V-003',
  },
];

const INITIAL_VISITS: VisitRecord[] = [
  {
    id: 'V-001',
    caseId: 'C-001',
    patientId: 'a1b2c3d4-0001-7000-8000-000000000001',
    clinicDayId: 'CD-2026-09-22',
    date: '2026-09-22',
    time: '09:10',
    visitType: 'Visit & Consultation',
    operationalStatus: 'AWAITING_DOCTOR',
    caseStateSnapshot: 'Awaiting Doctor',
    protectionState: 'OPEN',
    operationalContext: 'Arrival recorded — waiting for Doctor',
    arrivalCondition: 'Normal',
    currentComplaint: 'Bilateral pressing headache radiating to occiput for 2 days; exacerbated by computer screen work.',
    vitals: {
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 80,
      heartRate: 74,
      respiratoryRate: 16,
      temperatureCelsius: 36.8,
      oxygenSaturation: 99,
    },
    examinationNotes: 'Neck muscle spasm noted. Fundoscopy normal. No focal neurological deficits.',
    investigations: [],
    preliminaryDiagnosis: 'Episodic Tension-Type Headache with Cervicogenic Component',
    finalDiagnosis: '',
    treatmentAdvice: 'Ergonomic screen adjustments, hydration, neck stretching exercises.',
    prescription: {
      id: 'RX-V001',
      items: [
        {
          id: 'RX-M1',
          name: 'Paracetamol',
          strength: '500mg',
          form: 'Tablet',
          dose: '1-2 tablets',
          frequency: 'Every 8 hours as needed (PRN)',
          route: 'Oral',
          duration: '3 days',
          quantity: '1 box (20 tablets)',
          instructions: 'Take with plenty of water after food. Do not exceed 4g/day.',
          prn: true,
        },
      ],
      clinicalCounseling: 'Ensure adequate hydration and regular breaks from screen work.',
      patientInstructions: 'Rest in a quiet, dark room if headache escalates.',
      isAuthorized: false,
      authorizedAt: null,
      authorizedBy: null,
    },
    followUp: {
      required: true,
      intervalDays: 7,
      clinicalInstructions: 'Return if headache worsens or does not resolve in 5 days.',
    },
  },
  {
    id: 'V-002',
    caseId: 'C-002',
    patientId: 'a1b2c3d4-0002-7000-8000-000000000002',
    clinicDayId: 'CD-2026-09-22',
    date: '2026-09-22',
    time: '09:35',
    visitType: 'Visit & Consultation',
    operationalStatus: 'WITH_DOCTOR',
    caseStateSnapshot: 'With Doctor',
    protectionState: 'OPEN',
    operationalContext: 'Doctor encounter in progress',
    arrivalCondition: 'Moderately Unwell',
    currentComplaint: 'Dry persistent cough for 4 days, chest tightness and nocturnal wheezing waking her up.',
    vitals: {
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 75,
      heartRate: 88,
      respiratoryRate: 22,
      temperatureCelsius: 37.1,
      oxygenSaturation: 96,
    },
    examinationNotes: 'Bilateral expiratory wheezes on auscultation. Prolonged expiratory phase. No intercostal retraction.',
    investigations: [
      {
        id: 'INV-001',
        category: 'Laboratory',
        name: 'Complete Blood Count (CBC) with Differential',
        notes: 'Check for eosinophilia and infective leukocytosis',
        urgent: false,
      },
      {
        id: 'INV-002',
        category: 'Radiology',
        name: 'Chest X-Ray PA View',
        notes: 'Evaluate for focal infiltrates or hyperinflation',
        urgent: false,
      },
    ],
    preliminaryDiagnosis: 'Mild-to-Moderate Acute Asthma Exacerbation',
    finalDiagnosis: 'Acute Asthma Bronchospasm triggered by viral upper respiratory tract infection',
    treatmentAdvice: 'Avoid dust and strong perfumes. Steam inhalation twice daily.',
    prescription: {
      id: 'RX-V002',
      items: [
        {
          id: 'RX-M2',
          name: 'Salbutamol Inhaler',
          strength: '100mcg/puff',
          form: 'Inhaler',
          dose: '2 puffs',
          frequency: 'Every 6 hours as needed',
          route: 'Inhalation',
          duration: '14 days',
          quantity: '1 canister (200 doses)',
          instructions: 'Use spacer if available. Rinse mouth after use.',
          prn: true,
        },
        {
          id: 'RX-M3',
          name: 'Budesonide / Formoterol',
          strength: '160/4.5mcg',
          form: 'Turbuhaler',
          dose: '1 inhalation',
          frequency: 'Twice daily (morning and night)',
          route: 'Inhalation',
          duration: '30 days',
          quantity: '1 inhaler',
          instructions: 'Maintain daily adherence. Rinse mouth thoroughly.',
          prn: false,
        },
      ],
      clinicalCounseling: 'Strict demonstration of proper metered-dose inhaler inhalation technique provided.',
      patientInstructions: 'Seek urgent medical attention if chest tightness fails to respond to 4 puffs of Salbutamol within 15 minutes.',
      isAuthorized: true,
      authorizedAt: '2026-09-22T09:50:00Z',
      authorizedBy: 'Dr. Roby, MD (Attending Physician)',
    },
    followUp: {
      required: true,
      intervalDays: 5,
      clinicalInstructions: 'Re-evaluate peak expiratory flow and resolution of wheeze.',
    },
  },
  {
    id: 'V-004',
    caseId: 'C-003',
    patientId: 'a1b2c3d4-0003-7000-8000-000000000003',
    clinicDayId: 'CD-2026-09-20',
    date: '2026-09-20',
    time: '09:15',
    visitType: 'Visit & Consultation',
    operationalStatus: 'COMPLETED',
    caseStateSnapshot: 'Exited — Follow-up Pending',
    protectionState: 'PROTECTED',
    operationalContext: 'Initial encounter for diabetic review and foot symptoms',
    arrivalCondition: 'Normal',
    currentComplaint: 'Initial workup for suboptimal glycemic readings and bilateral burning sensations in toes.',
    vitals: {
      bloodPressureSystolic: 138,
      bloodPressureDiastolic: 86,
      heartRate: 80,
      respiratoryRate: 18,
      temperatureCelsius: 36.7,
      oxygenSaturation: 98,
    },
    examinationNotes: 'Monofilament test reveals diminished sensation on distal 1st and 5th metatarsal heads.',
    investigations: [
      {
        id: 'INV-003',
        category: 'Laboratory',
        name: 'HbA1c & Fasting Lipid Profile',
        notes: 'Glycemic control baseline',
        urgent: false,
      },
    ],
    preliminaryDiagnosis: 'Type 2 Diabetes with Diabetic Peripheral Neuropathy',
    finalDiagnosis: 'Uncontrolled T2DM with Early Symmetrical Distal Sensory Neuropathy',
    treatmentAdvice: 'Diabetic foot care education, inspect feet daily, wear protective footwear.',
    prescription: {
      id: 'RX-V004',
      items: [
        {
          id: 'RX-M4',
          name: 'Metformin HCl',
          strength: '850mg',
          form: 'Tablet',
          dose: '1 tablet',
          frequency: 'Twice daily with meals',
          route: 'Oral',
          duration: '30 days',
          quantity: '1 box (60 tablets)',
          instructions: 'Take during or immediately after meals to reduce GI distress.',
          prn: false,
        },
        {
          id: 'RX-M5',
          name: 'Alpha-Lipoic Acid',
          strength: '600mg',
          form: 'Capsule',
          dose: '1 capsule',
          frequency: 'Once daily on an empty stomach',
          route: 'Oral',
          duration: '30 days',
          quantity: '1 box (30 capsules)',
          instructions: 'Take 30 minutes before breakfast.',
          prn: false,
        },
      ],
      clinicalCounseling: 'Comprehensive dietary review for low glycemic load carbohydrates conducted.',
      patientInstructions: 'Record fasting and 2-hour postprandial glucose in logbook.',
      isAuthorized: true,
      authorizedAt: '2026-09-20T09:40:00Z',
      authorizedBy: 'Dr. Roby, MD (Attending Physician)',
    },
    followUp: {
      required: true,
      intervalDays: 2,
      clinicalInstructions: 'Return on 2026-09-22 with laboratory blood results and glucose log.',
    },
  },
  {
    id: 'V-003',
    caseId: 'C-003',
    patientId: 'a1b2c3d4-0003-7000-8000-000000000003',
    clinicDayId: 'CD-2026-09-22',
    date: '2026-09-22',
    time: '10:05',
    visitType: 'Visit & Consultation',
    operationalStatus: 'EXITED',
    caseStateSnapshot: 'Exited — Follow-up Pending',
    protectionState: 'PROTECTED',
    operationalContext: 'Recorded Visit — follow-up continuity; previous Visits remain preserved',
    arrivalCondition: 'Normal',
    currentComplaint: 'Follow-up review with laboratory reports: Fasting glucose 142 mg/dL, HbA1c 7.4%. Tingling slightly improved.',
    vitals: {
      bloodPressureSystolic: 130,
      bloodPressureDiastolic: 82,
      heartRate: 76,
      respiratoryRate: 16,
      temperatureCelsius: 36.6,
      oxygenSaturation: 99,
    },
    examinationNotes: 'Repeat neurological check shows stable sensation. Peripheral pulses palpable and symmetric.',
    investigations: [],
    preliminaryDiagnosis: 'T2DM under medical optimization; resolving neuropathic burning.',
    finalDiagnosis: 'Type 2 Diabetes Mellitus with satisfactory treatment response',
    treatmentAdvice: 'Continue Mediterranean diet regimen. Aim for 30 minutes brisk walking daily.',
    prescription: {
      id: 'RX-V003',
      items: [
        {
          id: 'RX-M6',
          name: 'Metformin HCl (Extended Release)',
          strength: '1000mg',
          form: 'Tablet',
          dose: '1 tablet',
          frequency: 'Once daily with evening dinner',
          route: 'Oral',
          duration: '60 days',
          quantity: '2 boxes (60 tablets)',
          instructions: 'Swallow whole with a full glass of water. Do not crush or chew.',
          prn: false,
        },
      ],
      clinicalCounseling: 'Patient encouraged by improvement. Re-emphasized smoking cessation maintenance.',
      patientInstructions: 'Continue home glucometer check twice weekly.',
      isAuthorized: true,
      authorizedAt: '2026-09-22T10:20:00Z',
      authorizedBy: 'Dr. Roby, MD (Attending Physician)',
    },
    followUp: {
      required: true,
      intervalDays: 30,
      clinicalInstructions: 'Repeat HbA1c in 3 months and check renal function tests.',
    },
    exitRecordedAt: '2026-09-22T10:25:00Z',
    exitRecordedBy: 'Nurse',
  },
];

export class ClinicStore {
  private state: ClinicState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): ClinicState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    return {
      patients: INITIAL_PATIENTS,
      cases: INITIAL_CASES,
      visits: INITIAL_VISITS,
      clinicDays: [INITIAL_CLINIC_DAY],
      currentClinicDayId: INITIAL_CLINIC_DAY.id,
      nextCpnNumber: 1004,
      actorRole: 'Doctor',
      operatingMode: 'DOCTOR_NURSE',
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (err) {
      console.error('Failed to persist clinic state to localStorage:', err);
    }
  }

  public getState(): ClinicState {
    return this.state;
  }

  public setActorRole(role: ActorRole): void {
    this.state.actorRole = role;
    this.saveState();
  }

  public setOperatingMode(mode: OperatingMode): void {
    this.state.operatingMode = mode;
    this.saveState();
  }

  public getCurrentClinicDay(): ClinicDayRecord {
    const day = this.state.clinicDays.find(
      (d) => d.id === this.state.currentClinicDayId
    );
    if (!day) {
      return this.state.clinicDays[0];
    }
    return day;
  }

  // Sequential CPN Allocation: CPN-<number>
  public allocateClinicPatientNumber(): string {
    const cpn = `CPN-${this.state.nextCpnNumber}`;
    this.state.nextCpnNumber += 1;
    this.saveState();
    return cpn;
  }

  // Register New Patient: Creates technical UUID + Allocates CPN
  public registerPatient(params: {
    name: string;
    dateOfBirth: string;
    profession: string;
    phone: string;
    gender: 'Male' | 'Female';
    pastHistory?: {
      chronicIllnesses?: string[];
      knownAllergies?: string[];
      surgicalHistory?: string[];
      familyHistory?: string[];
      lifestyleNotes?: string;
    };
  }): PatientRecord {
    if (!params.name?.trim()) throw new Error('Patient name is required');
    if (!params.dateOfBirth) throw new Error('Date of Birth is required');
    if (!params.phone?.trim()) throw new Error('Phone number is required');

    // Technical identity: standard UUID
    const patientId = crypto.randomUUID();
    const clinicPatientNumber = this.allocateClinicPatientNumber();

    const newPatient: PatientRecord = {
      patientId,
      clinicPatientNumber,
      name: params.name.trim(),
      dateOfBirth: params.dateOfBirth,
      profession: params.profession?.trim() || 'General',
      phone: params.phone.trim(),
      gender: params.gender || 'Male',
      registeredAt: new Date().toISOString(),
      pastHistory: {
        chronicIllnesses: params.pastHistory?.chronicIllnesses || [],
        knownAllergies: params.pastHistory?.knownAllergies || [],
        surgicalHistory: params.pastHistory?.surgicalHistory || [],
        familyHistory: params.pastHistory?.familyHistory || [],
        lifestyleNotes: params.pastHistory?.lifestyleNotes || '',
      },
    };

    this.state.patients.push(newPatient);
    this.saveState();
    return newPatient;
  }

  public searchPatients(query: string): PatientRecord[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.state.patients;
    return this.state.patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.clinicPatientNumber.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }

  public getPatientById(patientId: string): PatientRecord | undefined {
    return this.state.patients.find((p) => p.patientId === patientId);
  }

  public getPatientByCpn(cpn: string): PatientRecord | undefined {
    return this.state.patients.find((p) => p.clinicPatientNumber === cpn);
  }

  public getCasesForPatient(patientId: string): CaseRecord[] {
    return this.state.cases.filter((c) => c.patientId === patientId);
  }

  public getVisitsForCase(caseId: string): VisitRecord[] {
    return this.state.visits.filter((v) => v.caseId === caseId);
  }

  public getVisitsForPatient(patientId: string): VisitRecord[] {
    return this.state.visits.filter((v) => v.patientId === patientId);
  }

  public getVisitById(visitId: string): VisitRecord | undefined {
    return this.state.visits.find((v) => v.id === visitId);
  }

  public getCaseById(caseId: string): CaseRecord | undefined {
    return this.state.cases.find((c) => c.id === caseId);
  }

  // Create Case (Doctor or Intake): links strictly to 1 Patient
  public createCase(params: {
    patientId: string;
    title: string;
  }): CaseRecord {
    const patient = this.getPatientById(params.patientId);
    if (!patient) throw new Error('Patient does not exist');

    const caseCount = this.state.cases.length + 1;
    const caseId = `C-${String(caseCount).padStart(3, '0')}`;
    const currentDay = this.getCurrentClinicDay();

    const newCase: CaseRecord = {
      id: caseId,
      patientId: params.patientId,
      title: params.title.trim() || `Clinical Case #${caseCount}`,
      state: 'Awaiting Doctor',
      openedClinicDayId: currentDay.id,
      openedDate: currentDay.workingDate,
    };

    this.state.cases.push(newCase);
    this.saveState();
    return newCase;
  }

  // Complete Case: Doctor Only clinical authority!
  public completeCase(caseId: string, actorRole: ActorRole): CaseRecord {
    if (actorRole !== 'Doctor') {
      throw new Error('Case completion is strictly reserved for the Doctor.');
    }

    const caseRecord = this.getCaseById(caseId);
    if (!caseRecord) throw new Error('Case not found');

    const currentDay = this.getCurrentClinicDay();
    caseRecord.state = 'Completed';
    caseRecord.completedClinicDayId = currentDay.id;
    caseRecord.completedDate = currentDay.workingDate;
    caseRecord.completedBy = 'Doctor';

    this.saveState();
    return caseRecord;
  }

  // Record Arrival & New Visit: Operational action (Doctor or Nurse)
  public recordArrivalAndVisit(params: {
    patientId: string;
    caseId?: string;
    newCaseTitle?: string;
    currentComplaint: string;
    arrivalCondition: ArrivalCondition;
  }): VisitRecord {
    const patient = this.getPatientById(params.patientId);
    if (!patient) throw new Error('Patient not found');

    const currentDay = this.getCurrentClinicDay();
    if (currentDay.status === 'CLOSED') {
      throw new Error('Cannot record visit for a closed clinic day.');
    }

    let targetCase: CaseRecord;
    if (params.caseId) {
      const existing = this.getCaseById(params.caseId);
      if (!existing) throw new Error('Selected case not found');
      targetCase = existing;
      targetCase.state = 'Awaiting Doctor';
    } else {
      targetCase = this.createCase({
        patientId: params.patientId,
        title: params.newCaseTitle || 'Clinical Consultation',
      });
    }

    const visitCount = this.state.visits.length + 1;
    const visitId = `V-${String(visitCount).padStart(3, '0')}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newVisit: VisitRecord = {
      id: visitId,
      caseId: targetCase.id,
      patientId: params.patientId,
      clinicDayId: currentDay.id,
      date: currentDay.workingDate,
      time: timeStr,
      visitType: 'Visit & Consultation',
      operationalStatus: 'AWAITING_DOCTOR',
      caseStateSnapshot: 'Awaiting Doctor',
      protectionState: 'OPEN',
      operationalContext: 'Arrival recorded — waiting for Doctor',
      arrivalCondition: params.arrivalCondition || 'Normal',
      currentComplaint: params.currentComplaint || 'Consultation request',
      investigations: [],
      preliminaryDiagnosis: '',
      finalDiagnosis: '',
      treatmentAdvice: '',
      prescription: {
        id: `RX-${visitId}`,
        items: [],
        clinicalCounseling: '',
        patientInstructions: '',
        isAuthorized: false,
        authorizedAt: null,
        authorizedBy: null,
      },
      followUp: {
        required: false,
      },
    };

    targetCase.activeVisitId = visitId;
    currentDay.counter += 1;

    this.state.visits.push(newVisit);
    this.saveState();
    return newVisit;
  }

  // Update Encounter / Clinical Details: Doctor authority
  public updateEncounter(
    visitId: string,
    updates: {
      currentComplaint?: string;
      vitals?: VitalSigns;
      examinationNotes?: string;
      investigations?: InvestigationItem[];
      preliminaryDiagnosis?: string;
      finalDiagnosis?: string;
      treatmentAdvice?: string;
      prescription?: Prescription;
      followUp?: FollowUpDecision;
      operationalStatus?: VisitRecord['operationalStatus'];
    },
    actorRole: ActorRole
  ): VisitRecord {
    const visit = this.getVisitById(visitId);
    if (!visit) throw new Error('Visit not found');

    if (
      (updates.finalDiagnosis !== undefined ||
        updates.preliminaryDiagnosis !== undefined ||
        updates.investigations !== undefined ||
        updates.treatmentAdvice !== undefined ||
        updates.prescription !== undefined ||
        updates.followUp !== undefined) &&
      actorRole !== 'Doctor'
    ) {
      throw new Error('Clinical diagnoses, investigations, and treatment plans are Doctor authority only.');
    }

    // Prescription authorization is reserved for authorizePrescription().
    if (updates.prescription !== undefined) {
      const proposed = updates.prescription;
      const current = visit.prescription;

      // An authorized prescription cannot be edited in place.
      if (
        current.isAuthorized &&
        JSON.stringify(proposed) !== JSON.stringify(current)
      ) {
        throw new Error('Authorized prescription cannot be modified through encounter updates.');
      }
      if (
        proposed.isAuthorized !== current.isAuthorized ||
        proposed.authorizedAt !== current.authorizedAt ||
        proposed.authorizedBy !== current.authorizedBy
      ) {
        throw new Error('Prescription authorization cannot be changed through encounter updates.');
      }
    }

    if (updates.currentComplaint !== undefined) visit.currentComplaint = updates.currentComplaint;
    if (updates.vitals !== undefined) visit.vitals = updates.vitals;
    if (updates.examinationNotes !== undefined) visit.examinationNotes = updates.examinationNotes;
    if (updates.investigations !== undefined) visit.investigations = updates.investigations;
    if (updates.preliminaryDiagnosis !== undefined) visit.preliminaryDiagnosis = updates.preliminaryDiagnosis;
    if (updates.finalDiagnosis !== undefined) visit.finalDiagnosis = updates.finalDiagnosis;
    if (updates.treatmentAdvice !== undefined) visit.treatmentAdvice = updates.treatmentAdvice;
    if (updates.prescription !== undefined) visit.prescription = updates.prescription;
    if (updates.followUp !== undefined) visit.followUp = updates.followUp;

    if (updates.operationalStatus !== undefined) {
      visit.operationalStatus = updates.operationalStatus;
      const caseRecord = this.getCaseById(visit.caseId);
      if (caseRecord) {
        if (updates.operationalStatus === 'WITH_DOCTOR') {
          caseRecord.state = 'With Doctor';
          visit.caseStateSnapshot = 'With Doctor';
          visit.operationalContext = 'Doctor encounter in progress';
        } else if (updates.operationalStatus === 'EXITED') {
          caseRecord.state = 'Exited — Follow-up Pending';
          visit.caseStateSnapshot = 'Exited — Follow-up Pending';
          visit.operationalContext = 'Visit exited — follow-up continuity pending';
        }
      }
    }

    this.saveState();
    return visit;
  }

  // Authorize Prescription: Doctor Only!
  public authorizePrescription(
    visitId: string,
    actorRole: ActorRole
  ): Prescription {
    if (actorRole !== 'Doctor') {
      throw new Error('Authorizing prescriptions is strictly reserved for the Doctor.');
    }

    const visit = this.getVisitById(visitId);
    if (!visit) throw new Error('Visit not found');

    visit.prescription.isAuthorized = true;
    visit.prescription.authorizedAt = new Date().toISOString();
    visit.prescription.authorizedBy = 'Dr. Roby, MD (Attending Physician)';

    this.saveState();
    return visit.prescription;
  }

  // Record Patient Visit Exit: Operational action (Doctor or Nurse)
  public recordVisitExit(visitId: string, actorRole: ActorRole): VisitRecord {
    const visit = this.getVisitById(visitId);
    if (!visit) throw new Error('Visit not found');

    visit.operationalStatus = 'EXITED';
    visit.protectionState = 'PROTECTED';
    visit.exitRecordedAt = new Date().toISOString();
    visit.exitRecordedBy = actorRole;

    const caseRecord = this.getCaseById(visit.caseId);
    if (caseRecord && caseRecord.state !== 'Completed') {
      caseRecord.state = 'Exited — Follow-up Pending';
      visit.caseStateSnapshot = 'Exited — Follow-up Pending';
    }

    this.saveState();
    return visit;
  }

  // Close Clinic Day: Doctor Only!
  public closeClinicDay(actorRole: ActorRole): ClinicDayRecord {
    if (actorRole !== 'Doctor') {
      throw new Error('Closing the Clinic Day is strictly reserved for the Doctor.');
    }

    const currentDay = this.getCurrentClinicDay();
    currentDay.status = 'CLOSED';
    currentDay.lifecycle = 'CONCLUDED';
    currentDay.closedAt = new Date().toISOString();
    currentDay.closedBy = 'Doctor';

    // Protect all visits of this day
    this.state.visits
      .filter((v) => v.clinicDayId === currentDay.id)
      .forEach((v) => {
        v.protectionState = 'PROTECTED';
      });

    this.saveState();
    return currentDay;
  }

  // Open New Clinic Day: Doctor Only!
  public openNewClinicDay(actorRole: ActorRole): ClinicDayRecord {
    if (actorRole !== 'Doctor') {
      throw new Error('Opening a Clinic Day is strictly reserved for the Doctor.');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newId = `CD-${todayStr}-${Date.now().toString().slice(-4)}`;

    const newDay: ClinicDayRecord = {
      id: newId,
      workingDate: todayStr,
      status: 'OPEN',
      lifecycle: 'WORKING',
      counter: 0,
      openedAt: new Date().toISOString(),
    };

    this.state.clinicDays.push(newDay);
    this.state.currentClinicDayId = newDay.id;
    this.saveState();
    return newDay;
  }

  // Utility to calculate derived age
  public getDerivedAge(dateOfBirth: string): { simpleAge: number; detailed: DetailedAge } {
    return {
      simpleAge: calculateAge(dateOfBirth),
      detailed: calculateDetailedAge(dateOfBirth),
    };
  }

  // Reset to original seeded baseline if needed
  public resetToSeed(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
  }
}

export const clinicStore = new ClinicStore();
