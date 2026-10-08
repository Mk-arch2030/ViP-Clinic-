'use strict';

const { registerNewPatientController } = require('./controllers/register-new-patient-controller');
const { createPostgresPool } = require('../config/postgres');
const { PatientRepository } = require('../persistence/patient-repository');

/**
 * Compose the currently authorized POST /patients operation on an existing
 * Fastify instance. This function never starts the server or queries the DB.
 *
 * A caller-provided pool remains caller-owned. A pool created here is closed
 * by Fastify's onClose lifecycle hook.
 */
async function composePatientRegistration(app, options = {}) {
  if (!app || typeof app.post !== 'function' || typeof app.decorate !== 'function' || typeof app.addHook !== 'function') {
    throw new TypeError('A Fastify instance is required');
  }

  const ownsPool = options.pool === undefined;
  const pool = ownsPool ? (options.createPool || createPostgresPool)() : options.pool;
  if (!pool) throw new TypeError('A PostgreSQL pool is required');

  try {
    const repository = options.repository || new PatientRepository(pool);
    app.decorate('dbPool', pool);
    app.decorate('patientRepository', repository);
    app.post('/patients', registerNewPatientController);
    if (ownsPool) {
      app.addHook('onClose', async () => {
        await pool.end();
      });
    }
    return app;
  } catch (error) {
    if (ownsPool && typeof pool.end === 'function') {
      try { await pool.end(); } catch { /* preserve original error */ }
    }
    throw error;
  }
}

module.exports = { composePatientRegistration };
