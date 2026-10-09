'use strict';
const { MemoryAuthStore } = require('./test-memory-store.cjs');
const { createAuthService } = require('./auth-service');
const { DOCTOR, NURSE, disabled, password } = require('./test-service-contract.cjs');
const dummy = 'vip-scrypt-v1$' + Buffer.alloc(16).toString('base64url') + '$' + Buffer.alloc(32).toString('base64url');
function makeHarness() {
  let now = 1800000000000;
  const store = new MemoryAuthStore({ actors: [
    { actor_id: DOCTOR, actor_role: 'DOCTOR', lifecycle_state: 'ACTIVE' },
    { actor_id: NURSE, actor_role: 'NURSE', lifecycle_state: 'ACTIVE' },
    { actor_id: disabled, actor_role: 'DOCTOR', lifecycle_state: 'DEACTIVATED' }
  ], credentials: [DOCTOR,NURSE,disabled].map((actor_id,i) => ({ actor_id, login_label: ['SYN/DOCTOR','SYN/NURSE','SYN/DISABLED'][i],
    verifier: dummy, version: 1, enabled: true })), delegations: [{ nurse_id: NURSE, doctor_id: DOCTOR, mode: 'FULL', capabilities: [], version: 1 }] });
  const auth = createAuthService({ store, dummyVerifier: dummy, verify: async value => value === password, clock: () => now });
  return { store, auth, advance: ms => { now += ms; },
    actor: (id, patch) => store.transaction(async () => Object.assign(store.state.actors.find(a => a.actor_id === id), patch)),
    readActor: id => store.transaction(tx => tx.actor(id)),
    credential: (id, patch) => store.transaction(async () => Object.assign(store.state.credentials.find(c => c.actor_id === id), patch)),
    delegation: patch => store.transaction(async () => Object.assign(store.state.delegations[0], patch)),
    mode: mode => store.transaction(async () => { store.state.mode = mode; }),
    sessions: () => store.transaction(async () => structuredClone(store.state.sessions))
  };
}

module.exports = { makeHarness, dummy };
