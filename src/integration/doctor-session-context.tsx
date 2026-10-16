import React, { createContext, useContext } from 'react';
import type { ConnectedPatientSession } from './connected-patient-session';

const DoctorSessionContext = createContext<ConnectedPatientSession | null>(null);

export function DoctorSessionProvider({ model, children }: {
  model: ConnectedPatientSession;
  children: React.ReactNode;
}) {
  return <DoctorSessionContext.Provider value={model}>{children}</DoctorSessionContext.Provider>;
}

export function useDoctorSession(): ConnectedPatientSession {
  const model = useContext(DoctorSessionContext);
  if (!model) throw new Error('Protected doctor session provider is missing');
  return model;
}
