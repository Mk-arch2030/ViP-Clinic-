import { ApiFailure, type ServerSession, type WebApi, type FailureKind } from './web-api-client';
import type { BasicPatient, Registration } from './basic-patient';
export interface SessionView {
  readonly state: 'checking' | 'unauthenticated' | 'authenticated' | 'unavailable';
  readonly session: ServerSession | null; readonly patient: BasicPatient | null;
  readonly busy: boolean; readonly failure: FailureKind | null; readonly retryAfter?: number;
  readonly mutationsBlocked: boolean; readonly logoutUnconfirmed: boolean;
  readonly registrationUnconfirmed: boolean;
}
const initial: SessionView = Object.freeze({ state:'checking',session:null,patient:null,busy:false,failure:null,
  mutationsBlocked:true,logoutUnconfirmed:false,registrationUnconfirmed:false });
export class SessionCoordinator {
  private view: SessionView = initial;
  private listeners = new Set<() => void>();
  private generation = 0;
  private pending?: AbortController;
  constructor(private readonly api: WebApi) {}
  getSnapshot = (): SessionView => this.view;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private set(patch: Partial<SessionView>) { this.view = Object.freeze({ ...this.view,...patch }); this.listeners.forEach(listener => listener()); }
  private begin(patch: Partial<SessionView>): { id: number; signal: AbortSignal } {
    this.pending?.abort(); this.pending = new AbortController();
    const id = ++this.generation;
    this.set({ busy:true,failure:null,...patch });
    return { id,signal:this.pending.signal };
  }
  private failed(error: unknown, id: number, mutation = false) {
    if (id !== this.generation) return;
    const failure = error instanceof ApiFailure ? error : new ApiFailure(0,'unavailable');
    if (failure.status === 401) {
      this.set({ state:'unauthenticated',session:null,patient:null,mutationsBlocked:true,failure:'unauthorized',busy:false });
    } else if (failure.kind === 'unavailable') {
      this.set({ state:'unavailable',session:null,patient:null,mutationsBlocked:true,busy:false,
        registrationUnconfirmed:this.view.registrationUnconfirmed || mutation,
        failure:mutation ? 'outcome-unknown' : 'unavailable' });
    } else {
      this.set({ busy:false,patient:null,failure:failure.kind,retryAfter:failure.retryAfter,
        mutationsBlocked:this.view.mutationsBlocked || failure.status === 403 });
    }
  }
  async refresh() {
    // Explicit reconciliation can supersede a read, but never cancel a pending mutation to imply rollback.
    if (this.view.busy) return;
    const { id,signal } = this.begin({ state:'checking',session:null,patient:null,mutationsBlocked:true });
    try {
      const session = await this.api.session(signal);
      if (id === this.generation) this.set({ state:'authenticated',session,busy:false,mutationsBlocked:false,logoutUnconfirmed:false });
    } catch (error) {
      this.failed(error,id);
      if (id === this.generation && this.view.state === 'checking') this.set({ state:'unavailable' });
      if (id === this.generation && this.view.state === 'unauthenticated') this.set({ logoutUnconfirmed:false });
    }
  }
  async login(loginLabel: string, password: string) {
    if (this.view.busy || this.view.logoutUnconfirmed) return;
    const { id,signal } = this.begin({ state:'checking',session:null,patient:null,mutationsBlocked:true });
    try {
      await this.api.login(loginLabel,password,signal);
      if (id !== this.generation) return;
      const session = await this.api.session(signal);
      if (id === this.generation) this.set({ state:'authenticated',session,busy:false,mutationsBlocked:false });
    } catch (error) {
      this.failed(error,id);
      if (id === this.generation && this.view.state === 'checking') this.set({ state:'unauthenticated' });
    }
  }
  async retrieve(patientId: string) {
    if (this.view.busy || this.view.state !== 'authenticated') return;
    const { id,signal } = this.begin({ patient:null });
    try { const patient = await this.api.retrieve(patientId,signal); if (id === this.generation) this.set({ patient,busy:false }); }
    catch (error) { this.failed(error,id); }
  }
  async register(input: Registration) {
    if (this.view.busy || this.view.state !== 'authenticated' || this.view.mutationsBlocked || this.view.registrationUnconfirmed || !this.view.session) return;
    const { csrf } = this.view.session;
    const { id,signal } = this.begin({ patient:null });
    this.mutationPending = true;
    try { const patient = await this.api.register(input,csrf,signal); if (id === this.generation) this.set({ patient,busy:false }); }
    catch (error) { this.failed(error,id,true); }
    finally { if (id === this.generation) this.mutationPending = false; }
  }
  async logout() {
    // Logout can supersede GET; never offer it during registration. Revocation is server-confirmed only.
    if (!this.view.session || this.view.logoutUnconfirmed || this.mutationPending) return;
    const { csrf } = this.view.session;
    const { id,signal } = this.begin({ state:'checking',session:null,patient:null,mutationsBlocked:true,logoutUnconfirmed:true });
    try { await this.api.logout(csrf,signal); if (id === this.generation) this.set({ state:'unauthenticated',busy:false,logoutUnconfirmed:false }); }
    catch (error) { this.failed(error,id); if (id === this.generation && this.view.state !== 'unauthenticated') this.set({ state:'unavailable',session:null,logoutUnconfirmed:true }); }
  }
  private mutationPending = false;
  dispose() {
    ++this.generation; this.pending?.abort(); this.listeners.clear(); this.view = initial; this.mutationPending = false;
  }
}
