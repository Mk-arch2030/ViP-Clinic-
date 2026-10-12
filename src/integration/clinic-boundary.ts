import type { ClinicDayRecord, PatientRecord, CaseRecord, VisitRecord, ActorRole, OperatingMode, PastHistory } from '../domain/types';
import type { Registration, BasicPatient } from './basic-patient';
import type { ConnectedPatientSession } from './connected-patient-session';
export type ClinicPatient = Omit<PatientRecord, 'dateOfBirth' | 'pastHistory' | 'registeredAt'> & {
  dateOfBirth: string | null; pastHistory: PastHistory | null; registeredAt: string | null;
};
export interface ClinicData {
  retrievedPatientId?: string | null;
  patients: ClinicPatient[]; cases: CaseRecord[]; visits: VisitRecord[];
  actorRole: ActorRole; operatingMode: OperatingMode;
}
export interface ClinicBoundary {
  readonly protectedMode: boolean;
  getState(): ClinicData;
  getCurrentClinicDay(): ClinicDayRecord | null;
  subscribe?(listener: () => void): () => void;
  blocked(): boolean;
  failure(): string | null;
  hasMore(): boolean;
  search?(query: string): Promise<void>;
  retrieve?(id: string): Promise<ClinicPatient | null>;
  registerPatient(input: Registration): ClinicPatient | null | Promise<ClinicPatient | null>;
  setActorRole(role: ActorRole): void;
  setOperatingMode(mode: OperatingMode): void;
  closeClinicDay(role: ActorRole): void;
  openNewClinicDay(role: ActorRole): void;
  recordArrivalAndVisit(input: unknown): VisitRecord;
  recordVisitExit(id: string, role: ActorRole): void;
  updateEncounter(id: string, updates: unknown, role: ActorRole): void;
  authorizePrescription(id: string, role: ActorRole): void;
  completeCase(id: string, role: ActorRole): void;
  resetToSeed(): void;
}
export function toClinicPatient(patient: BasicPatient): ClinicPatient {
  return { patientId: patient.patientId, clinicPatientNumber: patient.clinicPatientNumber,
    name: patient.name, dateOfBirth: patient.dateOfBirth, profession: patient.profession,
    phone: patient.phone, gender: patient.gender, pastHistory: patient.pastHistory ?? null, registeredAt: null };
}
export function searchInput(query: string): ['cpn' | 'name', string] {
  const value = query.normalize('NFC').trim();
  return [/^(?:CPN-)?[1-9][0-9]{0,18}$/i.test(value) ? 'cpn' : 'name', value];
}
export function createProtectedClinicBoundary(model: ConnectedPatientSession): ClinicBoundary {
  const unsupported = (): never => { throw new Error('This clinical operation is not connected to the server yet.'); };
  const authorized = () => {
    const view = model.getSnapshot().session;
    return view.state === 'authenticated' && view.session?.role === 'Doctor' && !view.logoutUnconfirmed && !view.registrationUnconfirmed;
  };
  return {
    protectedMode: true,
    subscribe: model.subscribe,
    getState() {
      const view = model.getSnapshot().session;
      const patients = authorized() ? [...view.searchResults] : [];
      if (authorized() && view.patient) {
        const index = patients.findIndex(p => p.patientId === view.patient!.patientId);
        if (index < 0) patients.push(view.patient); else patients[index] = view.patient;
      }
      return { retrievedPatientId: authorized() ? view.patient?.patientId ?? null : null, patients: patients.map(toClinicPatient), cases: [], visits: [], actorRole: view.session?.role ?? 'Nurse', operatingMode: 'DOCTOR_ONLY' };
    },
    getCurrentClinicDay: () => null,
    blocked: () => !authorized() || model.getSnapshot().session.busy || model.getSnapshot().session.mutationsBlocked,
    failure: () => model.getSnapshot().session.failure,
    hasMore: () => model.getSnapshot().session.searchHasMore,
    async search(query) { if (!authorized()) return; await model.search(...searchInput(query)); },
    async retrieve(id) {
      if (!authorized() || model.getSnapshot().session.busy) return null;
      await model.retrieve(id, true);
      const view = model.getSnapshot().session;
      return authorized() && !view.failure && view.patient?.patientId === id ? toClinicPatient(view.patient) : null;
    },
    async registerPatient(input) {
      if (!authorized() || !input.pastHistory) return null;
      const result = await model.register(input);
      return authorized() && result?.pastHistory ? toClinicPatient(result) : null;
    },
    setActorRole: unsupported, setOperatingMode: unsupported,
    closeClinicDay: unsupported, openNewClinicDay: unsupported,
    recordArrivalAndVisit: unsupported, recordVisitExit: unsupported,
    updateEncounter: unsupported, authorizePrescription: unsupported,
    completeCase: unsupported, resetToSeed: unsupported,
  };
}
