const test = require('node:test');
const assert = require('node:assert/strict');
const { createAuthService } = require('./auth-service');
const { cases, DOCTOR, NURSE, disabled, password, login, fail } = require('./test-service-contract.cjs');
const dummy = 'vip-scrypt-v1$' + Buffer.alloc(16).toString('base64url') + '$' + Buffer.alloc(32).toString('base64url');

const { makeHarness } = require('./test-harness.cjs');

for (const [name, run] of cases) test('fake-store contract: ' + name, async () => run(makeHarness()));

test('credential verification race rechecks lifecycle before issuing a session', async () => {
  const h = makeHarness();
  let release, reached;
  const ready = new Promise(resolve => { reached = resolve; });
  const auth = createAuthService({ store: h.store, dummyVerifier: dummy, verify: () => { reached(); return new Promise(resolve => { release = resolve; }); } });
  const pending = auth.login({ loginLabel: 'SYN/DOCTOR', password, source: 'synthetic' });
  await ready;
  await h.actor(DOCTOR, { lifecycle_state: 'DEACTIVATED' });
  release(true);
  await assert.rejects(pending, fail(401));
  assert.equal((await h.sessions()).length, 0);
});

test('outages fail closed without exposing store diagnostics', async () => {
  const auth = createAuthService({ dummyVerifier: dummy, store: { transaction: async () => { throw new Error('secret database configuration'); } } });
  await assert.rejects(auth.current('A'.repeat(43)), error => error.statusCode === 503 && !error.message.includes('secret'));
});

test('credential replacement during verification cannot issue a stale-version session', async () => {
  const h = makeHarness();
  let finish, reached;
  const ready = new Promise(resolve => { reached = resolve; });
  const auth = createAuthService({ store: h.store, dummyVerifier: dummy, verify: () => { reached(); return new Promise(resolve => { finish = resolve; }); } });
  const pending = auth.login({ loginLabel: 'SYN/DOCTOR', password, source: 'synthetic' });
  await ready;
  await h.credential(DOCTOR, { version: 2 });
  finish(true);
  await assert.rejects(pending, fail(401));
  assert.equal((await h.sessions()).length, 0);
});

test('missing policy and removed delegation cannot grant Nurse participation', async () => {
  const h = makeHarness();
  const { token } = await login(h, 'SYN/NURSE');
  const { csrf } = await h.auth.current(token);
  await h.store.transaction(async () => { h.store.state.delegations = []; });
  await assert.rejects(h.auth.withAuthorized(token, 'ARRIVAL', csrf, async () => assert.fail()), fail(403));
  await h.mode(undefined);
  await assert.rejects(h.auth.withAuthorized(token, 'ARRIVAL', csrf, async () => assert.fail()), fail(403));
});

test('source budget limits distinct login labels and capacity remains bounded', async () => {
  const h = makeHarness();
  for (let i = 0; i < 20; i++) await assert.rejects(login(h, 'UNKNOWN-' + i), fail(401));
  await assert.rejects(login(h, 'ANOTHER-UNKNOWN'), fail(429));
  const other = makeHarness();
  for (let i = 0; i < 5000; i++) other.store.state.attempts['fake-' + i] = { count:1, expires_at:1900000000000 };
  await assert.rejects(login(other), fail(503));
});

