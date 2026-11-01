import { createContext, useContext } from 'react';
import type { ProtectedIntakeDraft } from './protected-intake-draft-types';

export interface ProtectedIntakeDraftAccess {
  readonly initialDraft: ProtectedIntakeDraft | null;
  readonly onDraftChange: (draft: ProtectedIntakeDraft) => void;
  readonly onRegistrationStarted: () => void;
}

export const ProtectedIntakeDraftContext =
  createContext<ProtectedIntakeDraftAccess | null>(null);

export function useProtectedIntakeDraft():
  ProtectedIntakeDraftAccess | null {
  return useContext(ProtectedIntakeDraftContext);
}
