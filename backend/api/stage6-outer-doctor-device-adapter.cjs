'use strict';

// Owner-directed Doctor First outer-gate adapter.
// Independent from the preserved original clinic device adapter.
// Import has no database, TLS or listener side effects.

const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const { randomBytes } = require('node:crypto');
const { Pool } = require('pg');
const { AuthRepository } = require('../persistence/auth-repository');
const { createAuthService } = require('../auth/auth-service');
const { createVerifier } = require('../auth/password-verifier');
const original = require('./stage6-original-device-adapter.cjs');
const runtime = require('./original-clinic-https-runtime.cjs');

const MANIFEST = Object.freeze({
  'index.html': '5d4afdd937647808bc9237d1528a956e1bac9407ba681d288daa34f7fd732d4d',
  'assets/index-CqPJO-CD.js': 'd6dc91b56e1b329fb106f98e31025f28b1c9ff03e4db740fa95d5489a46f58c1',
  'assets/index-S6K4ltaM.css': '15714371df315030275e2028849b896bd984abf5175ef07c779cb484c825f861'
});

const TOKEN = 'ROBY_OUTER_DOCTOR_GATE_PREFLIGHT';

function verifyExactBuildInventory(directory, manifest) {
  const expected = Object.keys(manifest).sort();
  const actual = [];
  for (const entry of require('node:fs').readdirSync(directory)) {
    const location = path.join(directory, entry);
    const stat = require('node:fs').lstatSync(location);
    if (stat.isSymbolicLink()) throw new Error('Unexpected build symlink');
    if (entry === 'assets' && stat.isDirectory()) {
      for (const asset of require('node:fs').readdirSync(location)) {
        const assetPath = path.join(location, asset);
        const assetStat = require('node:fs').lstatSync(assetPath);
        if (!assetStat.isFile() || assetStat.isSymbolicLink()) {
          throw new Error('Unexpected build asset type');
        }
        actual.push('assets/' + asset);
      }
    } else if (stat.isFile()) {
      actual.push(entry);
    } else {
      throw new Error('Unexpected build entry');
    }
  }
  assert.deepEqual(actual.sort(), expected, 'Unexpected build file inventory');
  return runtime.verifyOriginalAssets(directory, manifest);
}


function devicePaths(home = os.homedir()) {
  const paths = original.devicePaths(home);
  return {
    ...paths,
    buildDirectory: path.join(home, 'vip-shared-session-step105-build-review')
  };
}

function preflightDevice(paths, serverKeyFile) {
  // Reuse original private-input and TLS validation without modifying it.
  const originalPaths = {
    ...paths,
    buildDirectory: path.join(path.dirname(paths.buildDirectory), 'vip-clinic-original-stage6-build')
  };
  const { tls, password } = original.preflightDevice(originalPaths, serverKeyFile);
  verifyExactBuildInventory(paths.buildDirectory, MANIFEST);
  return { tls, password };
}

async function startDevice({
  token, serverKeyFile, listen = false, paths = devicePaths()
} = {}) {
  assert.equal(token, TOKEN, 'Outer doctor gate owner token required');
  assert.equal(typeof listen, 'boolean');
  const { tls, password } = preflightDevice(paths, serverKeyFile);
  const pool = new Pool({
    host: paths.socketDirectory,
    port: 55441,
    database: 'roby_intake_proof_stage6',
    user: os.userInfo().username,
    password,
    ssl: false,
    max: 6,
    connectionTimeoutMillis: 5000,
    options: '-c search_path=pg_catalog,public -c statement_timeout=10000 -c lock_timeout=5000'
  });
  let app;
  try {
    await runtime.verifyIsolatedDatabase(pool, paths);
    if (!listen) {
      return {
        status: 'OUTER_GATE_PREFLIGHT_PASS',
        close: () => pool.end()
      };
    }
    const dummyVerifier = await createVerifier(randomBytes(32).toString('base64url'));
    const auth = createAuthService({
      store: new AuthRepository(pool),
      dummyVerifier
    });
    app = await runtime.buildOriginalClinicRuntime({
      pool,
      auth,
      tls,
      assetsDirectory: paths.buildDirectory,
      manifest: MANIFEST,
      expectedDatabase: paths
    });
    const address = await runtime.listenOriginalClinicRuntime(
      app, 'ROBY_ORIGINAL_CLINIC_HTTPS_LISTEN'
    );
    return {
      status: 'OUTER_GATE_HTTPS_STARTED_NOT_BROWSER_PROOF',
      address,
      close: async () => {
        try { await app.close(); }
        finally { await pool.end(); }
      }
    };
  } catch (error) {
    if (app) await app.close().catch(() => {});
    await pool.end().catch(() => {});
    throw error;
  }
}

if (require.main === module) {
  const action = process.argv[4] || 'preflight';
  if (!['preflight', 'listen'].includes(action)) {
    console.error('OUTER_GATE=INVALID_ACTION');
    process.exitCode = 1;
  } else {
    startDevice({
      token: process.argv[2],
      serverKeyFile: process.argv[3],
      listen: action === 'listen'
    }).then(result => {
      console.log('OUTER_GATE=' + result.status);
      if (result.address) console.log('LISTENER_ADDRESS=' + result.address);
      if (action === 'preflight') return result.close();
      let closing = false;
      const shutdown = () => {
        if (closing) return;
        closing = true;
        result.close().then(
          () => process.exit(0),
          () => process.exit(1)
        );
      };
      process.once('SIGINT', shutdown);
      process.once('SIGTERM', shutdown);
    }).catch(error => {
      console.error('OUTER_GATE=FAILED');
      console.error('ERROR_TYPE=' + error.name);
      console.error('ERROR_MESSAGE=' + error.message);
      process.exitCode = 1;
    });
  }
}

module.exports = { MANIFEST, TOKEN, devicePaths, verifyExactBuildInventory, preflightDevice, startDevice };
