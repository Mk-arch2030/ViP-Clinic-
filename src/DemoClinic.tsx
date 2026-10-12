import React from 'react';
import { clinicStore } from './services/clinicStore';
import { ClinicApplication } from './ClinicApplication';
import type { ClinicBoundary } from './integration/clinic-boundary';
// Loaded only at the demo origin. Never evaluated by the protected clinic.
const boundary: ClinicBoundary = {
  protectedMode: false, getState: () => clinicStore.getState(),
  getCurrentClinicDay: () => clinicStore.getCurrentClinicDay(),
  blocked: () => false, failure: () => null, hasMore: () => false,
  registerPatient: input => clinicStore.registerPatient(input),
  setActorRole: role => clinicStore.setActorRole(role),
  setOperatingMode: mode => clinicStore.setOperatingMode(mode),
  closeClinicDay: role => clinicStore.closeClinicDay(role),
  openNewClinicDay: role => clinicStore.openNewClinicDay(role),
  recordArrivalAndVisit: input => clinicStore.recordArrivalAndVisit(input as Parameters<typeof clinicStore.recordArrivalAndVisit>[0]),
  recordVisitExit: (id, role) => clinicStore.recordVisitExit(id, role),
  updateEncounter: (id, updates, role) => clinicStore.updateEncounter(id, updates as Parameters<typeof clinicStore.updateEncounter>[1], role),
  authorizePrescription: (id, role) => clinicStore.authorizePrescription(id, role),
  completeCase: (id, role) => clinicStore.completeCase(id, role),
  resetToSeed: () => clinicStore.resetToSeed(),
};
export default function DemoClinic() { return <ClinicApplication boundary={boundary} />; }
