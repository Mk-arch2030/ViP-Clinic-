import React, { lazy, Suspense, useMemo } from 'react';
import { TEST_ORIGIN } from './integration/web-api-client';
import { useDoctorSession } from './integration/doctor-session-context';
import { createProtectedClinicBoundary } from './integration/clinic-boundary';
import { ClinicApplication } from './ClinicApplication';
const DemoClinic = lazy(() => import('./DemoClinic'));
function ProtectedClinic() {
  const model = useDoctorSession();
  const boundary = useMemo(() => createProtectedClinicBoundary(model), [model]);
  return <ClinicApplication boundary={boundary} />;
}
export default function App() {
  return window.location.origin === TEST_ORIGIN ? <ProtectedClinic /> :
    <Suspense fallback={null}><DemoClinic /></Suspense>;
}
