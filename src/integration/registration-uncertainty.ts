/** A denial guard only: no patient, credential, session or actor data. */
export interface RegistrationJournal {
  pending(): boolean;
  reserve(): Promise<string>;
  confirm(operationId: string): Promise<void>;
}
export const REGISTRATION_MARKER = 'roby_registration_uncertain_v1';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createRegistrationJournal({ storage, locks, uuid = () => crypto.randomUUID() }: {
  storage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  locks?: Pick<LockManager, 'request'>;
  uuid?: () => string;
}): RegistrationJournal {
  function read(): string | null { return storage().getItem(REGISTRATION_MARKER); }
  function parse(value: string): { version: 1; operationId: string } {
    const row = JSON.parse(value);
    if (!row || Array.isArray(row) || Object.keys(row).length !== 2 || row.version !== 1 ||
      typeof row.operationId !== 'string' || !uuidPattern.test(row.operationId)) throw new Error('Unresolved registration');
    return row;
  }
  async function exclusively<T>(work: () => T): Promise<T> {
    if (!locks?.request) throw new Error('Registration recovery storage unavailable');
    return locks.request(REGISTRATION_MARKER, { mode: 'exclusive' }, work);
  }
  return Object.freeze({
    pending() { try { return read() !== null; } catch { return true; } },
    reserve() {
      return exclusively(() => {
        if (read() !== null) throw new Error('Unresolved registration');
        const operationId = uuid();
        if (!uuidPattern.test(operationId)) throw new Error('Registration recovery storage unavailable');
        const encoded = JSON.stringify({ version: 1, operationId });
        storage().setItem(REGISTRATION_MARKER, encoded);
        if (read() !== encoded) throw new Error('Registration recovery storage unavailable');
        return operationId;
      });
    },
    confirm(operationId) {
      return exclusively(() => {
        const encoded = read();
        if (encoded === null || parse(encoded).operationId !== operationId) throw new Error('Unresolved registration');
        storage().removeItem(REGISTRATION_MARKER);
        if (read() !== null) throw new Error('Registration recovery storage unavailable');
      });
    }
  });
}

export function browserRegistrationJournal(): RegistrationJournal {
  return createRegistrationJournal({ storage: () => window.localStorage, locks: navigator.locks });
}
