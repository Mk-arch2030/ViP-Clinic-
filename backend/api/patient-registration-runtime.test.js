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
