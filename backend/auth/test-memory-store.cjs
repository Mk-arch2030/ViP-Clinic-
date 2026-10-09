'use strict';

// Test-only repository double. Never wire into a production composition.
const { AuthError } = require('./errors');
class MemoryAuthStore {
  constructor({ actors = [], credentials = [], delegations = [], mode = 'DOCTOR_NURSE' } = {}) {
    this.state = { actors: structuredClone(actors), credentials: structuredClone(credentials),
      delegations: structuredClone(delegations), mode, sessions: [], attempts: {} };
    this.tail = Promise.resolve();
    this.client = { query: async () => { throw new Error('Test must supply a business client'); } };
  }
  async transaction(work) {
    const prior = this.tail;
    let release;
    this.tail = new Promise(resolve => { release = resolve; });
    await prior;
    const before = structuredClone(this.state);
    const s = this.state;
    const tx = {
      client: this.client,
      actor: async id => structuredClone(s.actors.find(a => a.actor_id === id) ?? null),
      credentialByLabel: async label => structuredClone(s.credentials.find(c => c.login_label === label) ?? null),
      credentialByActor: async id => structuredClone(s.credentials.find(c => c.actor_id === id) ?? null),
      session: async digest => structuredClone(s.sessions.find(t => t.digest === digest) ?? null),
      liveSessions: async (id, now) => structuredClone(s.sessions.filter(t => t.actor_id === id && t.revoked_at === null &&
        t.idle_deadline > now && t.absolute_deadline > now).sort((a,b) => a.issued_at-b.issued_at || a.digest.localeCompare(b.digest))),
      insertSession: async session => { s.sessions.push(structuredClone(session)); },
      revokeSession: async (digest, now) => { s.sessions.find(t => t.digest === digest).revoked_at = now; },
      touchSession: async (digest, now, deadline) => { Object.assign(s.sessions.find(t => t.digest === digest), { last_seen_at: now, idle_deadline: deadline }); },
      authorization: async id => {
        const delegation = s.delegations.find(d => d.nurse_id === id) ?? null;
        return structuredClone({ mode: s.mode, delegation, grantor: delegation ? s.actors.find(a => a.actor_id === delegation.doctor_id) : null });
      },
      reserveAttempt: async (key, limit, now) => {
        for (const [k,v] of Object.entries(s.attempts)) if (v.expires_at <= now) delete s.attempts[k];
        const counter = s.attempts[key];
        if (counter?.count >= limit) throw new AuthError(429);
        if (!counter && Object.keys(s.attempts).length >= 5000) throw new AuthError(503);
        s.attempts[key] = { count: (counter?.count ?? 0)+1, expires_at: counter?.expires_at ?? now+900000 };
      },
      clearAttempt: async key => { delete s.attempts[key]; }
    };
    try { return await work(tx); }
    catch (error) { this.state = before; throw error; }
    finally { release(); }
  }
}
module.exports = { MemoryAuthStore };
