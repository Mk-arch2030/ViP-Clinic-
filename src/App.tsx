import React, { lazy, Suspense, useMemo } from 'react';
import { TEST_ORIGIN } from './integration/web-api-client';
import { useDoctorSession } from './integration/doctor-session-context';
import { createProtectedClinicBoundary } from './integration/clinic-boundary';
import { CaseCreatePanel } from './components/CaseCreatePanel';
import { ClinicApplication } from './ClinicApplication';
const DemoClinic = lazy(() => import('./DemoClinic'));
function ProtectedClinic({ caseCreateEnabled }: { caseCreateEnabled: boolean }) {
  const model = useDoctorSession();
  const boundary = useMemo(() => createProtectedClinicBoundary(model), [model]);
  return <ClinicApplication boundary={boundary} casePanel={caseCreateEnabled ? (patient, language) => <CaseCreatePanel patient={patient} model={model} language={language} /> : undefined} />;
}
export default function App({ caseCreateEnabled = false }: { caseCreateEnabled?: boolean }) {
  return window.location.origin === TEST_ORIGIN ? <ProtectedClinic caseCreateEnabled={caseCreateEnabled} /> :
    <Suspense fallback={null}><DemoClinic /></Suspense>;
}
