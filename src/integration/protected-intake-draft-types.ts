/**
 * Unsaved new-patient form fields only.
 * No credentials, session tokens, actor identity, or server patient records.
 */
export interface ProtectedIntakeDraft {
  readonly name: string;
  readonly dateOfBirth: string;
  readonly profession: string;
  readonly phone: string;
  readonly gender: 'Male' | 'Female';
  readonly chronic: string;
  readonly allergies: string;
  readonly surgeries: string;
  readonly family: string;
  readonly lifestyle: string;
}

export const EMPTY_PROTECTED_INTAKE_DRAFT: Readonly<ProtectedIntakeDraft> =
  Object.freeze({
    name: '',
    dateOfBirth: '',
    profession: '',
    phone: '',
    gender: 'Male',
    chronic: '',
    allergies: '',
    surgeries: '',
    family: '',
    lifestyle: '',
  });
