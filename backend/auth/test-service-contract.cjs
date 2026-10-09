'use strict';

const assert = require('node:assert/strict');
const { IDLE_MS, ABSOLUTE_MS } = require('./auth-service');
const { AuthError } = require('./errors');
const DOCTOR = '11111111-1111-4111-8111-111111111111';
const NURSE = '22222222-2222-4222-8222-222222222222';
const disabled = '33333333-3333-4333-8333-333333333333';
const password = 'synthetic proof password only';
const fail = code => error => error.statusCode === code;
const login = (h, loginLabel = 'SYN/DOCTOR', extra = {}) => h.auth.login({ loginLabel, password, source: 'synthetic-peer', ...extra });

const cases = [
  ['wrong password, unknown label and disabled Actor deny with the same generic failure', async h => {
    for (const args of [{ password: 'wrong synthetic password' }, { loginLabel: 'UNKNOWN' }, { loginLabel: 'SYN/DISABLED' }]) {
      await assert.rejects(login(h, args.loginLabel, args), fail(401));
    }
    assert.equal((await h.sessions()).length, 0);
  }],
  ['missing, malformed and forged session identifiers fail before dispatch', async h => {
    for (const token of [undefined, '', 'not-a-session', 'A'.repeat(43)]) await assert.rejects(h.auth.current(token), fail(401));
  }],
  ['active identity comes from persisted Actor, not a login label or supplied role', async h => {
    const { token } = await login(h, 'syn/doctor');
    const current = await h.auth.current(token);
    assert.equal(current.actorIdentityReference, DOCTOR);
    assert.equal(current.role, 'Doctor');
    assert.equal(current.lifecycle, 'ACTIVE');
    assert.equal(current.csrf.length, 43);
    const stored = await h.sessions();
    assert.equal(stored.length, 1);
    assert.equal(JSON.stringify(stored).includes(token), false);
  }],
  ['deactivation blocks existing sessions and new login, preserving Actor identity', async h => {
    const { token } = await login(h);
    await h.actor(DOCTOR, { lifecycle_state: 'DEACTIVATED' });
    await assert.rejects(h.auth.current(token), fail(401));
    await assert.rejects(login(h), fail(401));
    assert.equal((await h.readActor(DOCTOR)).actor_id, DOCTOR);
  }],
  ['Nurse deactivation also removes current session authority', async h => {
    const { token } = await login(h, 'SYN/NURSE');
    await h.actor(NURSE, { lifecycle_state: 'DEACTIVATED' });
    await assert.rejects(h.auth.current(token), fail(401));
    await assert.rejects(login(h, 'SYN/NURSE'), fail(401));
  }],
  ['idle and absolute expiry are enforced; activity cannot extend absolute time', async h => {
    const first = await login(h);
    h.advance(IDLE_MS);
    await assert.rejects(h.auth.current(first.token), fail(401));
    const second = await login(h);
    for (let elapsed = IDLE_MS / 2; elapsed < ABSOLUTE_MS; elapsed += IDLE_MS / 2) {
      h.advance(IDLE_MS / 2);
      await h.auth.current(second.token);
    }
    h.advance(IDLE_MS / 2);
    await assert.rejects(h.auth.current(second.token), fail(401));
  }],
  ['logout requires current CSRF and makes the old identifier unusable', async h => {
    const { token } = await login(h);
    await assert.rejects(h.auth.logout(token, 'forged'), fail(403));
    const current = await h.auth.current(token);
    await h.auth.logout(token, current.csrf);
    await assert.rejects(h.auth.current(token), fail(401));
  }],
  ['successful reauthentication rotates; failed login leaves the valid session intact', async h => {
    const first = await login(h);
    await assert.rejects(login(h, undefined, { priorToken: first.token, password: 'wrong synthetic password' }), fail(401));
    await h.auth.current(first.token);
    const second = await login(h, undefined, { priorToken: first.token });
    assert.notEqual(first.token, second.token);
    await assert.rejects(h.auth.current(first.token), fail(401));
    await h.auth.current(second.token);
  }],
  ['a prior session belonging to another Actor cannot be adopted', async h => {
    const nurse = await login(h, 'SYN/NURSE');
    await assert.rejects(login(h, undefined, { priorToken: nurse.token }), fail(401));
    await h.auth.current(nurse.token);
  }],
  ['credential version change and disabling credentials invalidate existing sessions', async h => {
    const first = await login(h);
    await h.credential(DOCTOR, { version: 2 });
    await assert.rejects(h.auth.current(first.token), fail(401));
    const second = await login(h);
    await h.credential(DOCTOR, { enabled: false });
    await assert.rejects(h.auth.current(second.token), fail(401));
    await assert.rejects(login(h), fail(401));
  }],
  ['Nurse FULL cannot access patient routes or unknown clinical operations', async h => {
    const { token } = await login(h, 'SYN/NURSE');
    const { csrf } = await h.auth.current(token);
    let dispatched = 0;
    for (const op of ['PATIENT_RETRIEVE','PATIENT_REGISTER','CASE_COMPLETE','CLINIC_DAY_CLOSE','UNKNOWN']) {
      await assert.rejects(h.auth.withAuthorized(token, op, csrf, async () => { dispatched++; }), fail(403));
    }
    assert.equal(dispatched, 0);
  }],
  ['FULL and LIMITED remain within the four contracted capabilities and current mode', async h => {
    const { token } = await login(h, 'SYN/NURSE');
    const { csrf } = await h.auth.current(token);
    const call = op => h.auth.withAuthorized(token, op, csrf, async () => 'permitted');
    assert.equal(await call('ARRIVAL'), 'permitted');
    await h.delegation({ mode: 'LIMITED', capabilities: ['ARRIVAL'] });
    await assert.rejects(call('EXIT'), fail(403));
    assert.equal(await call('ARRIVAL'), 'permitted');
    await h.mode('DOCTOR_ONLY');
    await assert.rejects(call('ARRIVAL'), fail(403));
    await h.mode('DOCTOR_NURSE');
    await h.actor(DOCTOR, { lifecycle_state: 'DEACTIVATED' });
    await assert.rejects(call('ARRIVAL'), fail(403));
  }],
  ['authorization uses current persisted role after a session has been issued', async h => {
    const { token } = await login(h);
    await h.actor(DOCTOR, { actor_role: 'NURSE' });
    await assert.rejects(h.auth.withAuthorized(token, 'PATIENT_RETRIEVE', undefined, async () => 'forbidden'), fail(403));
  }],
  ['concurrent successful logins never retain more than three live sessions', async h => {
    const results = await Promise.all(Array.from({ length: 4 }, () => login(h)));
    const sessions = await h.sessions();
    assert.equal(sessions.filter(s => s.revoked_at === null).length, 3);
    const checks = await Promise.allSettled(results.map(r => h.auth.current(r.token)));
    assert.equal(checks.filter(r => r.status === 'fulfilled').length, 3);
    assert.equal(checks.filter(r => r.status === 'rejected' && r.reason.statusCode === 401).length, 1);
  }],
  ['concurrent logout and protected work are serialized; revoked sessions cannot dispatch later', async h => {
    const { token } = await login(h);
    const { csrf } = await h.auth.current(token);
    let dispatched = 0;
    await Promise.allSettled([
      h.auth.logout(token, csrf),
      h.auth.withAuthorized(token, 'PATIENT_REGISTER', csrf, async () => { dispatched++; })
    ]);
    assert.ok(dispatched <= 1);
    await assert.rejects(h.auth.withAuthorized(token, 'PATIENT_REGISTER', csrf, async () => { dispatched++; }), fail(401));
  }],
  ['conflicting deactivation and protected work commit in order, never after committed deactivation', async h => {
    const { token } = await login(h);
    const { csrf } = await h.auth.current(token);
    await Promise.allSettled([
      h.actor(DOCTOR, { lifecycle_state: 'DEACTIVATED' }),
      h.auth.withAuthorized(token, 'PATIENT_REGISTER', csrf, async () => 'bounded work')
    ]);
    await assert.rejects(h.auth.withAuthorized(token, 'PATIENT_REGISTER', csrf, async () => assert.fail('deactivated dispatch')), fail(401));
  }],
  ['transactional dispatch failure rolls back and returns a generic unavailable boundary', async h => {
    const { token } = await login(h);
    const before = await h.sessions();
    await assert.rejects(h.auth.withAuthorized(token, 'PATIENT_RETRIEVE', undefined, async () => {
      throw new Error('secret SQL diagnostics');
    }), error => error.statusCode === 503 && !error.message.includes('secret'));
    assert.deepEqual(await h.sessions(), before);
  }],
  ['attempt reservation bounds parallel wrong-password work and resets only after expiry', async h => {
    const results = await Promise.allSettled(Array.from({ length: 7 }, () => login(h, 'UNKNOWN', { password: 'wrong synthetic password' })));
    assert.equal(results.filter(r => r.status === 'rejected' && r.reason.statusCode === 401).length, 5);
    assert.equal(results.filter(r => r.status === 'rejected' && r.reason.statusCode === 429).length, 2);
    h.advance(900000);
    await assert.rejects(login(h, 'UNKNOWN'), fail(401));
  }],
  ['missing lifecycle, unknown roles and missing Actor fail closed', async h => {
    await h.actor(DOCTOR, { lifecycle_state: 'DEACTIVATED' });
    await assert.rejects(login(h), fail(401));
    assert.throws(() => require('./authorization').resolveActor({ actor_id: DOCTOR, actor_role: 'ADMIN', lifecycle_state: 'ACTIVE' }), fail(401));
    assert.throws(() => require('./authorization').resolveActor({ actor_id: DOCTOR, actor_role: 'DOCTOR' }), fail(401));
    assert.throws(() => require('./authorization').resolveActor(null), fail(401));
  }]
];

module.exports = { cases, DOCTOR, NURSE, disabled, password, login, fail };
