'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Fastify = require('fastify');
const {
  buildPatientRegistrationRuntime,
  startPatientRegistrationRuntime,
} = require('./patient-registration-runtime');

function dependencies() {
  let closed = 0;

  const pool = {
    async end() { closed += 1; },
  };

  return {
    pool,
    getClosed: () => closed,
    repository: {},
  };
}

test('runtime module import does not listen or connect', () => {
  assert.equal(typeof buildPatientRegistrationRuntime, 'function');
  assert.equal(typeof startPatientRegistrationRuntime, 'function');
});

test('runtime composes POST only before listening', async () => {
  const app = Fastify();
  const deps = dependencies();

  try {
    const result = await buildPatientRegistrationRuntime({
      app,
      composition: {
        pool: deps.pool,
        repository: deps.repository,
      },
    });

    assert.equal(result, app);
    await app.ready();

    assert.equal(app.hasRoute({
      method: 'POST',
      url: '/patients',
    }), true);

    assert.equal(app.hasRoute({
      method: 'GET',
      url: '/patients/:patientId',
    }), false);
  } finally {
    await app.close();
  }

  assert.equal(deps.getClosed(), 0);
});

test('runtime listens on explicit loopback and closes', async () => {
  const deps = dependencies();

  const runtime = await startPatientRegistrationRuntime({
    host: '127.0.0.1',
    port: 0,
    composition: {
      pool: deps.pool,
      repository: deps.repository,
    },
  });

  try {
    assert.equal(runtime.app.server.listening, true);
    assert.equal(runtime.address.includes('127.0.0.1'), true);

    const response = await runtime.app.inject({
      method: 'GET',
      url: '/patients/not-authorized',
    });

    assert.equal(response.statusCode, 404);
  } finally {
    await runtime.app.close();
  }

  assert.equal(deps.getClosed(), 0);
});

test('runtime closes owned pool when listen fails', async () => {
  const app = Fastify();
  let closed = 0;

  app.listen = async () => {
    throw new Error('SIMULATED_LISTEN_FAILURE');
  };

  await assert.rejects(
    startPatientRegistrationRuntime({
      app,
      composition: {
        createPool: () => ({
          async end() { closed += 1; },
        }),
      },
    }),
    /SIMULATED_LISTEN_FAILURE/,
  );

  assert.equal(closed, 1);
});


test('runtime forwards explicit GET opt-in without listening', async () => {
  const { PatientRepository } = require('../persistence/patient-repository');
  const found = '88888888-8888-4888-8888-888888888888';
  const missing = '99999999-9999-4999-8999-999999999999';
  const queries = [];
  const deps = dependencies();
  const client = { async query(sql, params) {
    assert.match(sql, /^\s*SELECT\b/i);
    assert.match(sql, /WHERE patient_id = \$1/i);
    queries.push(params);
    return { rows: params[0] === found ? [{ patient_id: found,
      clinic_patient_number: 'CPN-9003', date_of_birth: null }] : [] };
  } };
  const app = Fastify();
  app.listen = async () => { assert.fail('Build/injection proof must not listen'); };
  try {
    await buildPatientRegistrationRuntime({ app, composition: {
      pool: deps.pool, repository: new PatientRepository(client),
      enableRetrieveExistingPatient: true,
    } });
    await app.ready();
    assert.equal(app.server.listening, false);
    assert.equal(queries.length, 0);
    assert.equal(app.hasRoute({ method: 'POST', url: '/patients' }), true);
    assert.equal(app.hasRoute({ method: 'GET', url: '/patients/:patientId' }), true);
    const response = await app.inject({ method: 'GET', url: '/patients/' + found });
    assert.equal(response.statusCode, 200);
    assert.equal(response.json().patient_id, found);
    const absent = await app.inject({ method: 'GET', url: '/patients/' + missing });
    assert.equal(absent.statusCode, 404);
    assert.deepEqual(absent.json(), { error: 'Patient not found' });
    assert.deepEqual(queries, [[found], [missing]]);
  } finally { await app.close(); }
  assert.equal(deps.getClosed(), 0);
});
