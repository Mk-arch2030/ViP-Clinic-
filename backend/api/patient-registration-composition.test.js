'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Fastify = require('fastify');
const { composePatientRegistration } = require('./patient-registration-composition');

function makePool() {
  let ended = 0;
  return {
    pool: { async end() { ended += 1; } },
    endCount: () => ended,
  };
}

test('import does not create a server, open a pool, or listen', () => {
  assert.equal(typeof composePatientRegistration, 'function');
});

test('registers POST /patients only, injects dependencies, and does not connect at composition', async () => {
  const app = Fastify();
  const { pool, endCount } = makePool();
  let connects = 0;
  pool.connect = async () => { connects += 1; throw new Error('Unexpected database connection'); };
  const repository = { allocateClinicPatientNumber() {}, createPatient() {} };
  try {
    await composePatientRegistration(app, { pool, repository });
    await app.ready();
    assert.equal(app.dbPool, pool);
    assert.equal(app.patientRepository, repository);
    assert.equal(app.hasRoute({ method: 'POST', url: '/patients' }), true);
    assert.equal(app.hasRoute({ method: 'GET', url: '/patients/:patientId' }), false);
    assert.equal(connects, 0);
  } finally {
    await app.close();
  }
  assert.equal(endCount(), 0, 'external pool must remain open');
});

test('POST /patients dispatches through existing controller and service using mocks', async () => {
  const app = Fastify();
  const calls = [];
  const client = {
    async query(sql) { calls.push(sql); return { rows: [] }; },
    release() { calls.push('RELEASE'); },
  };
  const pool = {
    async connect() { calls.push('CONNECT'); return client; },
    async end() { calls.push('END'); },
  };
  const repository = {
    async allocateClinicPatientNumber(receivedClient) {
      assert.equal(receivedClient, client);
      calls.push('ALLOCATE');
      return 'CPN-TEST';
    },
    async createPatient(patient, receivedClient) {
      assert.equal(receivedClient, client);
      assert.equal(patient.clinicPatientNumber, 'CPN-TEST');
      calls.push('CREATE');
    },
  };
  try {
    await composePatientRegistration(app, { pool, repository });
    const response = await app.inject({
      method: 'POST', url: '/patients',
      payload: {
        name: 'Test Patient', dateOfBirth: '1996-01-01',
        profession: 'Engineer', phone: '01000000000', gender: 'Male',
      },
    });
    assert.equal(response.statusCode, 201);
    const body = response.json();
    assert.equal(body.clinicPatientNumber, 'CPN-TEST');
    assert.equal(body.name, 'Test Patient');
    assert.deepEqual(calls, ['CONNECT', 'BEGIN', 'ALLOCATE', 'CREATE', 'COMMIT', 'RELEASE']);
    const getResponse = await app.inject({ method: 'GET', url: '/patients/some-id' });
    assert.equal(getResponse.statusCode, 404);
  } finally {
    await app.close();
  }
});

test('composition-owned pool is closed with Fastify', async () => {
  const app = Fastify();
  const { pool, endCount } = makePool();
  await composePatientRegistration(app, { createPool: () => pool });
  await app.close();
  assert.equal(endCount(), 1);
});

test('owned pool is closed if route registration fails', async () => {
  const app = Fastify();
  const { pool, endCount } = makePool();
  app.post('/patients', async () => ({}));
  await assert.rejects(() => composePatientRegistration(app, { createPool: () => pool }));
  assert.equal(endCount(), 1);
  await app.close();
});


test('explicit false preserves POST-only composition', async () => {
  const app = Fastify();
  const { pool } = makePool();
  try {
    await composePatientRegistration(app, { pool, enableRetrieveExistingPatient: false });
    await app.ready();
    assert.equal(app.hasRoute({ method: 'POST', url: '/patients' }), true);
    assert.equal(app.hasRoute({ method: 'GET', url: '/patients/:patientId' }), false);
  } finally { await app.close(); }
});

test('opt-in GET dispatches through existing retrieval and preserves POST', async () => {
  const { calculateAge } = require('../../domain/patient');
  const found = '66666666-6666-4666-8666-666666666666';
  const missing = '77777777-7777-4777-8777-777777777777';
  const row = { patient_id: found, clinic_patient_number: 'CPN-9002',
    name: 'Synthetic Composition Fixture', date_of_birth: '1990-02-01',
    profession: 'Tester', phone: '00000000000', gender: 'Male' };
  const calls = [];
  const forbidden = () => { assert.fail('GET attempted a mutation or connection'); };
  const pool = {
    connect: forbidden,
    end: forbidden,
    async query(sql, params) {
      assert.match(sql, /^\s*SELECT\b/i);
      assert.match(sql, /FROM patients/i);
      assert.match(sql, /WHERE patient_id = \$1/i);
      assert.doesNotMatch(sql, /nextval|INSERT|UPDATE|DELETE|BEGIN|COMMIT|ROLLBACK/i);
      calls.push({ sql, params });
      return { rows: params[0] === found ? [{ ...row }] : [] };
    },
  };
  const app = Fastify();
  try {
    await composePatientRegistration(app, { pool, enableRetrieveExistingPatient: true });
    await app.ready();
    assert.equal(calls.length, 0);
    assert.equal(app.hasRoute({ method: 'POST', url: '/patients' }), true);
    assert.equal(app.hasRoute({ method: 'GET', url: '/patients/:patientId' }), true);
    app.patientRepository.allocateClinicPatientNumber = forbidden;
    app.patientRepository.createPatient = forbidden;
    const before = new Date();
    const response = await app.inject({ method: 'GET', url: '/patients/' + found });
    const after = new Date();
    assert.equal(response.statusCode, 200);
    const body = response.json();
    const { age, ...persisted } = body;
    assert.deepEqual(persisted, row);
    assert.ok([calculateAge(row.date_of_birth, before), calculateAge(row.date_of_birth, after)].includes(age));
    const absent = await app.inject({ method: 'GET', url: '/patients/' + missing });
    assert.equal(absent.statusCode, 404);
    assert.deepEqual(absent.json(), { error: 'Patient not found' });
    assert.deepEqual(calls.map(c => c.params), [[found], [missing]]);
  } finally { await app.close(); }
});

test('opt-in owned pool closes once on normal close', async () => {
  const app = Fastify();
  const { pool, endCount } = makePool();
  await composePatientRegistration(app, { createPool: () => pool, enableRetrieveExistingPatient: true });
  await app.close();
  assert.equal(endCount(), 1);
});

test('opt-in duplicate GET closes owned pool on composition failure', async () => {
  const app = Fastify();
  const { pool, endCount } = makePool();
  app.get('/patients/:patientId', async () => ({}));
  try {
    await assert.rejects(() => composePatientRegistration(app, {
      createPool: () => pool, enableRetrieveExistingPatient: true,
    }), error => error.code === 'FST_ERR_DUPLICATED_ROUTE');
    assert.equal(endCount(), 1);
  } finally { await app.close(); }
  assert.equal(endCount(), 1);
});
