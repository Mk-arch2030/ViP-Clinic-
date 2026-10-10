import { parsePatient, parseRegistration, record, UUID, type BasicPatient, type Registration } from './basic-patient';

export interface ServerSession {
  readonly actorIdentityReference: string; readonly role: 'Doctor' | 'Nurse'; readonly lifecycle: 'ACTIVE'; readonly csrf: string;
}
export type FailureKind = 'unauthorized' | 'forbidden' | 'not-found' | 'invalid' | 'throttled' | 'unavailable' | 'busy' | 'outcome-unknown';
export class ApiFailure extends Error {
  constructor(public readonly status: number, public readonly kind: FailureKind, public readonly retryAfter?: number) {
    super(kind); this.name = 'ApiFailure';
  }
}
export interface WebApi {
  session(signal?: AbortSignal): Promise<ServerSession>;
  login(loginLabel: string, password: string, signal?: AbortSignal): Promise<void>;
  logout(csrf: string, signal?: AbortSignal): Promise<void>;
  retrieve(patientId: string, signal?: AbortSignal): Promise<BasicPatient>;
  register(input: Registration, csrf: string, signal?: AbortSignal): Promise<BasicPatient>;
}
export const TEST_ORIGIN = 'https://127.0.0.1:3443';
function parseSession(value: unknown): ServerSession {
  const row = record(value);
  if (Object.keys(row).length !== 4 || Object.keys(row).some(key => !['actorIdentityReference','role','lifecycle','csrf'].includes(key)) ||
      typeof row.actorIdentityReference !== 'string' || !UUID.test(row.actorIdentityReference) ||
      !['Doctor','Nurse'].includes(String(row.role)) || row.lifecycle !== 'ACTIVE' ||
      typeof row.csrf !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(row.csrf)) throw new Error('Invalid response');
  return Object.freeze(row) as unknown as ServerSession;
}
export function createWebApi({ origin, fetcher = globalThis.fetch }: { origin: string; fetcher?: typeof fetch }): WebApi {
  // Fixed origin and paths: neither a query string nor browser storage configures this boundary.
  function transport() {
    if (origin !== TEST_ORIGIN || typeof fetcher !== 'function') throw new ApiFailure(0, 'unavailable');
  }
  async function request(path: string, method: 'GET' | 'POST', expected: number, body?: unknown, csrf?: string, signal?: AbortSignal): Promise<unknown> {
    transport();
    if (csrf !== undefined && !/^[A-Za-z0-9_-]{43}$/.test(csrf)) throw new ApiFailure(400, 'invalid');
    let response: Response;
    try {
      response = await fetcher(path, { method, credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal,
        headers: { ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}), ...(csrf !== undefined ? { 'X-CSRF-Token': csrf } : {}) },
        ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
    } catch { throw new ApiFailure(0, 'unavailable'); }
    if (response.status !== expected) {
      const status = response.status;
      const kind = status === 401 ? 'unauthorized' : status === 403 ? 'forbidden' : status === 404 ? 'not-found' :
        [400,413,415].includes(status) ? 'invalid' : status === 429 ? 'throttled' : 'unavailable';
      const retry = response.headers.get('Retry-After');
      throw new ApiFailure(status, kind, status === 429 && retry && /^\d{1,4}$/.test(retry) ? Math.min(Number(retry),900) : undefined);
    }
    if (expected === 204) return undefined;
    if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get('Content-Type') ?? '')) throw new ApiFailure(503, 'unavailable');
    // Never expose the response error body or secret-bearing diagnostics to the UI.
    try { return await response.json(); } catch { throw new ApiFailure(503, 'unavailable'); }
  }
  async function parsed<T>(work: Promise<unknown>, parser: (value: unknown) => T): Promise<T> {
    const value = await work;
    try { return parser(value); } catch { throw new ApiFailure(503, 'unavailable'); }
  }
  return Object.freeze({
    session: signal => parsed(request('/auth/session','GET',200,undefined,undefined,signal),parseSession),
    async login(loginLabel, password, signal) {
      transport();
      if (typeof loginLabel !== 'string' || !/^[A-Za-z0-9/_-]{3,64}$/.test(loginLabel) ||
          typeof password !== 'string' || password.length > 1024) throw new ApiFailure(400,'invalid');
      await parsed(request('/auth/login','POST',200,{ loginLabel,password },undefined,signal), value => {
        const row = record(value);
        if (Object.keys(row).length !== 1 || row.authenticated !== true) throw new Error('Invalid response');
      });
    },
    async logout(csrf, signal) { await request('/auth/logout','POST',204,{},csrf,signal); },
    retrieve(patientId, signal) {
      if (!UUID.test(patientId)) return Promise.reject(new ApiFailure(400,'invalid'));
      return parsed(request('/patients/'+encodeURIComponent(patientId),'GET',200,undefined,undefined,signal),parsePatient);
    },
    register(input, csrf, signal) {
      let body: Registration;
      try { body = parseRegistration(input); } catch { return Promise.reject(new ApiFailure(400,'invalid')); }
      return parsed(request('/patients','POST',201,body,csrf,signal),parsePatient);
    }
  } satisfies WebApi);
}
