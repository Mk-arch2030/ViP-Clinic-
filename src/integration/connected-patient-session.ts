import { SessionCoordinator, type SessionView } from './session-coordinator';
import type { FailureKind, WebApi } from './web-api-client';
import type { Registration } from './basic-patient';

export interface PatientNotice { readonly operation: 'retrieve' | 'register'; readonly kind: FailureKind }
export interface ConnectedView { readonly session: SessionView; readonly notice: PatientNotice | null }

// Presentation state only. No clinicStore, remembered role or persisted patient cache.
export class ConnectedPatientSession {
  private readonly coordinator: SessionCoordinator;
  private readonly listeners = new Set<() => void>();
  private notice: PatientNotice | null = null;
  private actor: string | null = null;
  private value: ConnectedView;
  private unsubscribe: () => void;
  constructor(api: WebApi) {
    this.coordinator = new SessionCoordinator(api);
    this.value = Object.freeze({ session: this.coordinator.getSnapshot(), notice: null });
    this.unsubscribe = this.coordinator.subscribe(() => this.publish());
  }
  private publish() {
    const session = this.coordinator.getSnapshot();
    const actor = session.session?.actorIdentityReference ?? null;
    if (session.state === 'unauthenticated' || session.state === 'unavailable' ||
        (actor && this.actor && actor !== this.actor)) this.notice = null;
    if (actor || session.state === 'unauthenticated' || session.state === 'unavailable') this.actor = actor;
    this.value = Object.freeze({ session, notice: this.notice });
    this.listeners.forEach(listener => listener());
  }
  getSnapshot = () => this.value;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  refresh = () => this.coordinator.refresh();
  async login(label: string, password: string) { this.notice = null; this.publish(); await this.coordinator.login(label, password); }
  async logout() { this.notice = null; this.publish(); await this.coordinator.logout(); }
  private allowed(operation: 'retrieve' | 'register') {
    const view = this.coordinator.getSnapshot();
    if (view.busy || view.state !== 'authenticated' || !view.session) return false;
    if (view.session.role !== 'Doctor') {
      this.notice = { operation, kind: 'forbidden' }; this.publish(); return false;
    }
    if (operation === 'register' && (view.mutationsBlocked || view.registrationUnconfirmed)) return false;
    this.notice = null; this.publish(); return true;
  }
  async retrieve(id: string) {
    if (!this.allowed('retrieve')) return;
    await this.coordinator.retrieve(id);
    const failure = this.coordinator.getSnapshot().failure;
    if (failure) { this.notice = { operation: 'retrieve', kind: failure }; this.publish(); }
  }
  async register(input: Registration) {
    if (!this.allowed('register')) return;
    await this.coordinator.register(input);
    const failure = this.coordinator.getSnapshot().failure;
    if (failure) { this.notice = { operation: 'register', kind: failure }; this.publish(); }
  }
  dispose() { this.unsubscribe(); this.coordinator.dispose(); this.listeners.clear(); }
}
