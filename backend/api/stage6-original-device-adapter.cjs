'use strict';

// Owner-invoked, loopback-only Stage 6 original-clinic device adapter.
// No side effects on import; no schema initialization, migration or reset.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { Pool } = require('pg');
const { AuthRepository } = require('../persistence/auth-repository');
const { createAuthService } = require('../auth/auth-service');
const { createVerifier } = require('../auth/password-verifier');
const {
  verifyTls, verifyOriginalAssets, verifyIsolatedDatabase,
  buildOriginalClinicRuntime, listenOriginalClinicRuntime
} = require('./original-clinic-https-runtime.cjs');

const MANIFEST = Object.freeze({
  'index.html':'c76a705c64b63b249b88a21ffcc6797acd081bde63367e7b8eb4a911f11b54cf',
  'assets/index-2N0Bm-oO.js':'8bbf28ba8f929ad45ed23f95fceb2fc6703424f34609208d381fe49de454241e',
  'assets/index-5HTzZxPU.css':'c183113e367184ca1ee933ee27d6f319182d633afde03ec6d31656847ce694e9'
});

function devicePaths(home = os.homedir()) {
  assert.ok(path.isAbsolute(home));
  const base = path.join(home, 'vip-intake-proof-stage6-isolated');
  return {
    base,
    dataDirectory:path.join(base, 'data'),
    socketDirectory:path.join(base, 'socket'),
    tlsDirectory:path.join(base, 'tls-long-lived-v2'),
    buildDirectory:path.join(home, 'vip-clinic-original-stage6-build'),
    passwordFile:path.join(base, 'postgres-bootstrap-password')
  };
}

function readPrivateRegular(filename) {
  const stat = fs.lstatSync(filename);
  assert.ok(stat.isFile() && !stat.isSymbolicLink(), 'Private input must be a regular file');
  assert.equal(stat.mode & 0o077, 0, 'Private input must not be group/world accessible');
  return fs.readFileSync(filename);
}

function publicRegular(filename) {
  const stat = fs.lstatSync(filename);
  assert.ok(stat.isFile() && !stat.isSymbolicLink(), 'Certificate must be a regular file');
  return fs.readFileSync(filename);
}

function preflightDevice(paths, serverKeyFile) {
  assert.ok(path.isAbsolute(serverKeyFile), 'Explicit absolute TLS server key path required');
  assert.equal(path.dirname(serverKeyFile), paths.tlsDirectory, 'TLS key must belong to V2 directory');
  const tls = {
    ca:publicRegular(path.join(paths.tlsDirectory, 'ca.cert.pem')),
    cert:publicRegular(path.join(paths.tlsDirectory, 'server.cert.pem')),
    key:readPrivateRegular(serverKeyFile)
  };
  verifyTls(tls);
  verifyOriginalAssets(paths.buildDirectory, MANIFEST);
  const password = readPrivateRegular(paths.passwordFile).toString('utf8').trim();
  assert.ok(password.length > 0, 'Isolated database password missing');
  return { tls, password };
}

async function startDevice({ token, serverKeyFile, listen = false, paths = devicePaths() } = {}) {
  assert.equal(token, 'ROBY_ORIGINAL_CLINIC_DEVICE_PREFLIGHT');
  assert.equal(typeof listen, 'boolean');
  const { tls, password } = preflightDevice(paths, serverKeyFile);
  const pool = new Pool({
    host:paths.socketDirectory, port:55441, database:'roby_intake_proof_stage6',
    user:os.userInfo().username, password, ssl:false, max:6,
    connectionTimeoutMillis:5000,
    options:'-c search_path=pg_catalog,public -c statement_timeout=10000 -c lock_timeout=5000'
  });
  let app;
  try {
    await verifyIsolatedDatabase(pool, paths);
    if (!listen) return { status:'REAL_DATABASE_AND_ORIGINAL_ASSETS_PREFLIGHT_PASS', close:() => pool.end() };
    const dummyVerifier = await createVerifier(randomBytes(32).toString('base64url'));
    const auth = createAuthService({ store:new AuthRepository(pool), dummyVerifier });
    app = await buildOriginalClinicRuntime({
      pool, auth, tls, assetsDirectory:paths.buildDirectory,
      manifest:MANIFEST, expectedDatabase:paths
    });
    const address = await listenOriginalClinicRuntime(app, 'ROBY_ORIGINAL_CLINIC_HTTPS_LISTEN');
    return { status:'HTTPS_LOOPBACK_STARTED_NOT_BROWSER_PROOF', address, close:async () => {
      try { await app.close(); } finally { await pool.end(); }
    } };
  } catch (error) {
    if (app) await app.close().catch(() => {});
    await pool.end().catch(() => {});
    throw error;
  }
}

if (require.main === module) {
  const token = process.argv[2];
  const key = process.argv[3];
  const action = process.argv[4] || 'preflight';
  if (!['preflight','listen'].includes(action)) {
    console.error('DEVICE_ADAPTER=INVALID_ACTION');
    process.exitCode = 1;
  } else {
    startDevice({ token, serverKeyFile:key, listen:action === 'listen' }).then(result => {
      console.log('DEVICE_ADAPTER=' + result.status);
      if (result.address) console.log('LISTENER_ADDRESS=' + result.address);
      if (action === 'preflight') return result.close();
      const shutdown = () => { result.close().then(() => process.exit(0), () => process.exit(1)); };
      process.once('SIGINT', shutdown);
      process.once('SIGTERM', shutdown);
    }).catch(error => {
      console.error('DEVICE_ADAPTER=FAILED');
      console.error('ERROR_TYPE=' + error.name);
      console.error('ERROR_MESSAGE=' + error.message);
      process.exitCode = 1;
    });
  }
}

module.exports = { MANIFEST, devicePaths, preflightDevice, startDevice };
