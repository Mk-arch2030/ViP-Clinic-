'use strict';

// Stage 8 synthetic acceptance device entrypoint.
// No side effects on import.
// No migrations, seeding, reset or automatic listener.

const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const { randomBytes } = require('node:crypto');

const { Pool } = require('pg');
const { AuthRepository } =
  require('../persistence/auth-repository');
const { createAuthService } =
  require('../auth/auth-service');
const { createVerifier } =
  require('../auth/password-verifier');

const { verifyStage8Database } =
  require('./stage8-database-guard.cjs');
const { verifyStage8Tls } =
  require('./stage8-tls-guard.cjs');
const { verifyStage8Assets } =
  require('./stage8-assets-guard.cjs');

const {
  buildStage8HttpsRuntime,
  listenStage8HttpsRuntime
} = require('./stage8-https-runtime.cjs');

const TOKEN = 'ROBY_STAGE8_DEVICE_PREFLIGHT';

function devicePaths(home = os.homedir()) {
  assert.ok(path.isAbsolute(home));

  const base = path.join(home, 'roby-stage8-pg');

  return Object.freeze({
    dataDirectory: path.join(base, 'data'),
    socketDirectory: path.join(base, 'socket'),
    tlsDirectory: path.join(base, 'tls-acceptance-v1'),
    assetsDirectory: path.join(
      home,
      'ViP-Clinic-Stage8',
      'dist-stage8-acceptance'
    )
  });
}

function connectionOptions(paths) {
  return {
    host: paths.socketDirectory,
    port: 55445,
    database: 'roby_stage8_acceptance',
    user: os.userInfo().username,
    password: '',
    ssl: false,
    max: 6,
    connectionTimeoutMillis: 5000,
    options:
      '-c search_path=pg_catalog,public ' +
      '-c statement_timeout=10000 ' +
      '-c lock_timeout=5000'
  };
}

async function startDevice({
  token,
  listen = false,
  paths = devicePaths()
} = {}) {
  assert.equal(token, TOKEN);
  assert.equal(typeof listen, 'boolean');

  // Validate local static inputs before database access.
  verifyStage8Tls(paths.tlsDirectory);
  verifyStage8Assets(paths.assetsDirectory);

  const pool = new Pool(connectionOptions(paths));
  let app;

  try {
    await verifyStage8Database(pool, paths);

    if (!listen) {
      return {
        status: 'STAGE8_PREFLIGHT_PASS',
        close: () => pool.end()
      };
    }

    const dummyVerifier = await createVerifier(
      randomBytes(32).toString('base64url')
    );

    const auth = createAuthService({
      store: new AuthRepository(pool),
      dummyVerifier
    });

    app = await buildStage8HttpsRuntime({
      pool,
      auth,
      databasePaths: paths,
      tlsDirectory: paths.tlsDirectory,
      assetsDirectory: paths.assetsDirectory
    });

    const address = await listenStage8HttpsRuntime(
      app,
      'ROBY_STAGE8_HTTPS_ACCEPTANCE_LISTEN'
    );

    return {
      status: 'STAGE8_HTTPS_STARTED_NOT_E2E_PROOF',
      address,
      close: async () => {
        try {
          await app.close();
        } finally {
          await pool.end();
        }
      }
    };
  } catch (error) {
    if (app) {
      await app.close().catch(() => {});
    }

    await pool.end().catch(() => {});
    throw error;
  }
}

module.exports = {
  TOKEN,
  devicePaths,
  connectionOptions,
  startDevice
};
