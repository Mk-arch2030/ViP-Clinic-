const test = require('node:test');
const assert = require('node:assert/strict');
const Fastify = require('fastify');
const { composeSecuredPatients } = require('./secured-patient-composition');
const { makeHarness } = require('../auth/test-harness.cjs');
const { login, password, DOCTOR, fail } = require('../auth/test-service-contract.cjs');
const origin = 'https://vip.synthetic.invalid';
const patientId = '55555555-5555-4555-8555-555555555555';
const baseHeaders = { origin, 'content-type': 'application/json' };
const cookie = token => '__Host-vip_session=' + token;

async function setup() {
  const h = makeHarness();
  const calls = [];
  h.store.client = { async query(sql, values) {
    calls.push({ sql, values });
    if (/nextval/.test(sql)) return { rows: [{ clinic_patient_number: 'CPN-9002' }] };
    if (/FROM patients/.test(sql)) return { rows: values[0] === patientId ? [{ patient_id: patientId, clinic_patient_number: 'CPN-9001', date_of_birth: null }] : [] };
    if (/INSERT INTO patients/.test(sql)) return { rows: [{ patient_id: values[0], clinic_patient_number: values[1],
      name: values[2], date_of_birth: values[3], profession: values[4], phone: values[5], gender: values[6] }] };
    return { rows: [] };
  } };
  const app = Fastify({ logger: false, trustProxy: false });
  await composeSecuredPatients(app, { auth: h.auth, trustedOrigin: origin });
  await app.ready();
  return { ...h, app, calls };
}

test('invalid configuration and collisions reject rather than expose partial routes', async () => {
  for (const trustedOrigin of [undefined, '*', 'http://localhost:3000', 'https://vip.synthetic.invalid/path']) {
    const app = Fastify();
    await assert.rejects(composeSecuredPatients(app, { auth: makeHarness().auth, trustedOrigin }), fail(503));
    assert.equal(app.hasRoute({ method: 'POST', url: '/auth/login' }), false);
    await app.close();
  }
  const app = Fastify();
  app.post('/patients', async () => ({}));
  await assert.rejects(composeSecuredPatients(app, { auth: makeHarness().auth, trustedOrigin: origin }), fail(503));
  await app.close();
});

test('missing identity, forged browser role, duplicate cookies and unknown sessions cannot dispatch', async () => {
  const h = await setup();
  try {
    for (const headers of [{}, { 'x-actor-role': 'Doctor', 'x-actor-id': DOCTOR },
      { cookie: cookie('A'.repeat(43)) }, { cookie: cookie('A'.repeat(43)) + '; ' + cookie('B'.repeat(43)) }]) {
      const result = await h.app.inject({ method: 'GET', url: '/patients/' + patientId, headers });
      assert.equal(result.statusCode, 401);
    }
    assert.equal(h.calls.length, 0);
    assert.equal(h.app.server.listening, false);
  } finally { await h.app.close(); }
});

test('login rejects missing/untrusted origins, cross-site metadata and role/identity injection', async () => {
  const h = await setup();
  try {
    for (const headers of [{ 'content-type': 'application/json' }, { ...baseHeaders, origin: 'https://evil.invalid' },
      { ...baseHeaders, 'sec-fetch-site': 'cross-site' }]) {
      assert.equal((await h.app.inject({ method: 'POST', url: '/auth/login', headers,
        payload: { loginLabel: 'SYN/DOCTOR', password } })).statusCode, 403);
    }
    assert.equal((await h.app.inject({ method: 'POST', url: '/auth/login', headers: baseHeaders,
      payload: { loginLabel: 'SYN/NURSE', password, role: 'Doctor' } })).statusCode, 400);
    assert.equal((await h.app.inject({ method: 'POST', url: '/auth/login', headers: { origin }, payload: 'password=example' })).statusCode, 415);
    assert.equal((await h.sessions()).length, 0);
  } finally { await h.app.close(); }
});

test('success returns only protected cookie; identity is server-resolved and auth responses are no-store', async () => {
  const h = await setup();
  try {
    const result = await h.app.inject({ method: 'POST', url: '/auth/login', headers: baseHeaders, payload: { loginLabel: 'SYN/NURSE', password } });
    assert.equal(result.statusCode, 200);
    assert.deepEqual(result.json(), { authenticated: true });
    const setCookie = result.headers['set-cookie'];
    assert.match(setCookie, /^__Host-vip_session=[A-Za-z0-9_-]{43}; Path=\/; Secure; HttpOnly; SameSite=Strict; Expires=/);
    assert.doesNotMatch(setCookie, /Domain=/);
    const current = await h.app.inject({ method: 'GET', url: '/auth/session', headers: { cookie: setCookie.split(';')[0], 'x-actor-role': 'Doctor' } });
    assert.equal(current.json().role, 'Nurse');
    assert.equal(current.headers['cache-control'], 'no-store');
    assert.equal((await h.app.inject({ method: 'GET', url: '/patients/' + patientId, headers: { cookie: setCookie.split(';')[0] } })).statusCode, 403);
  } finally { await h.app.close(); }
});

test('authenticated Doctor retrieval returns 200/404 and deactivation denies immediately', async () => {
  const h = await setup();
  try {
    const { token } = await login(h);
    const headers = { cookie: cookie(token) };
    const found = await h.app.inject({ method: 'GET', url: '/patients/' + patientId, headers });
    assert.equal(found.statusCode, 200);
    assert.equal(found.json().patient_id, patientId);
    assert.equal((await h.app.inject({ method: 'GET', url: '/patients/66666666-6666-4666-8666-666666666666', headers })).statusCode, 404);
    await h.actor(DOCTOR, { lifecycle_state: 'DEACTIVATED' });
    const before = h.calls.length;
    assert.equal((await h.app.inject({ method: 'GET', url: '/patients/' + patientId, headers })).statusCode, 401);
    assert.equal(h.calls.length, before);
  } finally { await h.app.close(); }
});

test('CSRF, strict basic payload and Nurse denial precede patient writes', async () => {
  const h = await setup();
  const payload = { name: 'Synthetic Patient', dateOfBirth: '1990-02-01', profession: 'Tester', phone: '00000000000', gender: 'Male' };
  try {
    const { token } = await login(h);
    const { csrf } = await h.auth.current(token);
    const headers = { ...baseHeaders, cookie: cookie(token) };
    assert.equal((await h.app.inject({ method: 'POST', url: '/patients', headers, payload })).statusCode, 403);
    assert.equal((await h.app.inject({ method: 'POST', url: '/patients', headers: { ...headers, 'x-csrf-token': csrf }, payload: { ...payload, role: 'Doctor' } })).statusCode, 400);
    const nurse = await login(h, 'SYN/NURSE');
    const nurseCsrf = (await h.auth.current(nurse.token)).csrf;
    assert.equal((await h.app.inject({ method: 'POST', url: '/patients', headers: { ...baseHeaders, cookie: cookie(nurse.token), 'x-csrf-token': nurseCsrf }, payload })).statusCode, 403);
    assert.equal(h.calls.length, 0);
    const result = await h.app.inject({ method: 'POST', url: '/patients', headers: { ...headers, 'x-csrf-token': csrf }, payload });
    assert.equal(result.statusCode, 201);
    assert.equal(h.calls[0].sql, 'SAVEPOINT vip_patient_registration');
    assert.equal(h.calls.at(-1).sql, 'RELEASE SAVEPOINT vip_patient_registration');
    assert.equal(h.calls.some(c => c.sql === 'COMMIT'), false);
  } finally { await h.app.close(); }
});

test('logout requires CSRF and clears the same secure cookie; old cookie then fails', async () => {
  const h = await setup();
  try {
    const { token } = await login(h);
    const headers = { ...baseHeaders, cookie: cookie(token) };
    assert.equal((await h.app.inject({ method: 'POST', url: '/auth/logout', headers, payload: {} })).statusCode, 403);
    const { csrf } = await h.auth.current(token);
    const result = await h.app.inject({ method: 'POST', url: '/auth/logout', headers: { ...headers, 'x-csrf-token': csrf }, payload: {} });
    assert.equal(result.statusCode, 204);
    assert.match(result.headers['set-cookie'], /Path=\/; Secure; HttpOnly; SameSite=Strict; Max-Age=0/);
    assert.equal((await h.app.inject({ method: 'GET', url: '/auth/session', headers })).statusCode, 401);
  } finally { await h.app.close(); }
});

test('infrastructure errors are generic and unauthenticated errors expose no diagnostics', async () => {
  const h = await setup();
  try {
    const { token } = await login(h);
    h.store.client.query = async () => { throw new Error('password secret and database address'); };
    const result = await h.app.inject({ method: 'GET', url: '/patients/' + patientId, headers: { cookie: cookie(token) } });
    assert.equal(result.statusCode, 503);
    assert.deepEqual(result.json(), { error: 'Service unavailable' });
  } finally { await h.app.close(); }
});
