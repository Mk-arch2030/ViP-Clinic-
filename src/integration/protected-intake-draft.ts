/**
 * Volatile draft holder only.
 * Not an authentication source, patient database, or registration journal.
 */
export function createProtectedIntakeDraft<T extends object>() {
  let owner: string | null = null;
  let value: T | null = null;

  return Object.freeze({
    capture(actorIdentityReference: string, draft: T): void {
      if (!actorIdentityReference) return;

      if (owner !== null && owner !== actorIdentityReference) {
        owner = null;
        value = null;
        return;
      }

      owner = actorIdentityReference;
      value = { ...draft };
    },

    resume(actorIdentityReference: string | null): T | null {
      if (!actorIdentityReference) return null;

      if (owner !== null && owner !== actorIdentityReference) {
        owner = null;
        value = null;
        return null;
      }

      return value === null ? null : { ...value };
    },

    registrationStarted(): void {
      owner = null;
      value = null;
    },

    clear(): void {
      owner = null;
      value = null;
    }
  });
}
