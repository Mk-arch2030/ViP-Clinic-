'use strict';

// Stage 6 original-clinic HTTPS runtime. Import has no side effects.
// This module never initializes, migrates, drops, or resets a database.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash, X509Certificate, createPrivateKey, createPublicKey } = require('node:crypto');

const ORIGIN = 'https://127.0.0.1:3443';
const DATABASE = 'roby_intake_proof_stage6';
const SYSTEM_ID = '7695362409703475295';
const SERVER_FINGERPRINT = '4C:36:A2:76:E0:10:50:C5:58:C7:A0:CC:BD:4A:D6:DB:E2:95:F1:BA:C7:2F:BA:F0:63:F3:41:CE:49:E2:9A:17';
const LOGIN_LABEL = 'DR/MK_ROBY';
const ACTOR_ID = '11111111-1111-4111-8111-111111111111';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const regular = filename => {
  const stat = fs.lstatSync(filename);
  assert.ok(stat.isFile() && !stat.isSymbolicLink(), 'Regular non-symlink file required');
  return fs.readFileSync(filename);
};

function verifyTls({ ca, cert, key }, now = Date.now()) {
  assert.ok(ca && cert && key, 'Explicit TLS V2 CA, certificate and key required');
  const authority = new X509Certificate(ca);
  const server = new X509Certificate(cert);
  assert.equal(server.fingerprint256.toUpperCase(), SERVER_FINGERPRINT, 'Unreviewed TLS leaf');
  assert.equal(server.checkIP('127.0.0.1'), '127.0.0.1', 'Loopback SAN required');
  assert.ok(authority.ca && !server.ca, 'CA/leaf constraints invalid');
  assert.ok(server.checkIssued(authority) && server.verify(authority.publicKey), 'Untrusted certificate chain');
  assert.ok(Date.parse(authority.validFrom) <= now && now < Date.parse(authority.validTo), 'CA expired or not yet valid');
  assert.ok(Date.parse(server.validFrom) <= now && now < Date.parse(server.validTo), 'Leaf expired or not yet valid');
  assert.ok(Date.parse(authority.validTo) > Date.parse(server.validTo), 'CA must outlive leaf');
  const actualKey = createPublicKey(createPrivateKey(key)).export({ type:'spki', format:'der' });
  assert.ok(actualKey.equals(server.publicKey.export({ type:'spki', format:'der' })), 'TLS key mismatch');
  return { key, cert, minVersion:'TLSv1.2' };
}

function verifyOriginalAssets(directory, manifest) {
  assert.ok(path.isAbsolute(directory), 'Absolute build directory required');
  assert.equal(fs.realpathSync(directory), directory, 'Build directory realpath mismatch');
  assert.ok(!fs.lstatSync(directory).isSymbolicLink(), 'Build directory symlink forbidden');
  assert.ok(manifest && typeof manifest === 'object' && !Array.isArray(manifest));
  const entries = Object.entries(manifest);
  assert.ok(entries.length >= 2 && entries.length <= 32 && Object.hasOwn(manifest, 'index.html'),
    'Original clinic index.html required');
  const routes = new Map();
  let total = 0;
  for (const [name, hash] of entries) {
    assert.ok(name === 'index.html' || /^assets\/[A-Za-z0-9_-][A-Za-z0-9._-]*\.(js|css)$/.test(name),
      'Unexpected asset path');
    assert.match(hash, /^[a-f0-9]{64}$/, 'Invalid asset digest');
    if (name.startsWith('assets/')) {
      assert.ok(!fs.lstatSync(path.join(directory, 'assets')).isSymbolicLink(), 'Asset symlink forbidden');
    }
    const bytes = regular(path.join(directory, name));
    total += bytes.length;
    assert.ok(total <= 16 * 1024 * 1024, 'Asset budget exceeded');
    assert.equal(digest(bytes), hash, 'Asset bytes differ from reviewed manifest');
    const type = name.endsWith('.html') ? 'text/html; charset=utf-8' :
      name.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8';
    routes.set(name === 'index.html' ? '/' : '/' + name, { bytes, type });
  }
  const html = routes.get('/').bytes.toString('utf8');
  assert.match(html, /<div id="root"><\/div>/, 'Original React root missing');
  assert.ok(!html.includes('stage6-integration'), 'Integration harness is not original clinic');
  assert.ok([...routes.keys()].some(name => name.endsWith('.js')), 'Built JS missing');
  assert.ok([...routes.keys()].some(name => name.endsWith('.css')), 'Built CSS missing');
  return routes;
}

async function verifyIsolatedDatabase(pool, expected) {
  assert.ok(pool && typeof pool.connect === 'function');
  assert.ok(expected && typeof expected === 'object');
  for (const key of ['dataDirectory', 'socketDirectory']) {
    assert.equal(typeof expected[key], 'string');
    assert.ok(path.isAbsolute(expected[key]));
    assert.equal(fs.realpathSync(expected[key]), expected[key], key + ' mismatch');
  }
  const client = await pool.connect();
  let begun = false;
  try {
    await client.query('BEGIN READ ONLY');
    begun = true;
    const state = (await client.query(`SELECT current_database() AS database,
      current_setting('data_directory') AS data_directory,
      current_setting('unix_socket_directories') AS sockets,
      current_setting('port') AS port,
      current_setting('listen_addresses') AS addresses,
      inet_server_addr()::text AS server_address,
      (pg_control_system()).system_identifier::text AS system_id`)).rows[0];
    assert.equal(state.database, DATABASE);
    assert.equal(fs.realpathSync(state.data_directory), expected.dataDirectory);
    assert.equal(state.sockets, expected.socketDirectory);
    assert.equal(state.port, '55441');
    assert.equal(state.addresses, '', 'TCP must remain disabled');
    assert.equal(state.server_address, null, 'Unix socket connection required');
    assert.equal(state.system_id, SYSTEM_ID);
    const credential = (await client.query(`SELECT c.actor_id::text AS actor_id, c.login_label,
      c.enabled, a.actor_role, a.lifecycle_state
      FROM vip_auth.credentials c
      JOIN public.actors a ON a.actor_id=c.actor_id
      WHERE c.login_label=$1`, [LOGIN_LABEL])).rows;
    assert.equal(credential.length, 1, 'Exactly one Doctor credential required');
    assert.equal(credential[0].actor_id, ACTOR_ID);
    assert.equal(credential[0].login_label, LOGIN_LABEL);
    assert.equal(credential[0].enabled, true);
    assert.equal(credential[0].actor_role, 'DOCTOR');
    assert.equal(credential[0].lifecycle_state, 'ACTIVE');
    const tables = (await client.query(`SELECT
      to_regclass('public.patient_intakes') IS NOT NULL AS intake,
      to_regclass('public.past_history_items') IS NOT NULL AS history,
      to_regclass('vip_auth.sessions') IS NOT NULL AS sessions`)).rows[0];
    assert.deepEqual(tables, { intake:true, history:true, sessions:true });
    await client.query('COMMIT');
    begun = false;
    return { database:DATABASE, systemId:SYSTEM_ID, loginLabel:LOGIN_LABEL };
  } finally {
    if (begun) await client.query('ROLLBACK').catch(() => {});
    client.release();
  }
}

async function buildOriginalClinicRuntime({ pool, auth, tls, assetsDirectory, manifest, expectedDatabase, authDiagnostics = false } = {}) {
  // Explicit caller owns pool. No automatic listener, schema changes, or credential provisioning.
  assert.ok(auth && typeof auth.login === 'function' && typeof auth.withAuthorized === 'function');
  const https = verifyTls(tls);
  const routes = verifyOriginalAssets(assetsDirectory, manifest);
  await verifyIsolatedDatabase(pool, expectedDatabase);
  const Fastify = require('fastify');
  const app = Fastify({ https, logger:false, trustProxy:false, bodyLimit:4096,
    requestTimeout:15000, connectionTimeout:15000, keepAliveTimeout:5000 });
  try {
    app.addHook('onRequest', async (request, reply) => {
      if (request.raw.socket.encrypted !== true) return reply.code(403).send({ error:'Protected transport required' });
      if (request.headers.host !== '127.0.0.1:3443') return reply.code(400).send({ error:'Invalid request' });
      reply.header('X-Content-Type-Options', 'nosniff');
      reply.header('Cache-Control', 'no-store');
      reply.header('Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    });
    // Expired HttpOnly cookies must be removed by the server, without weakening login.
    app.addHook('onSend', require('./expired-session-cookie.cjs').clearRejectedSession);
    if (authDiagnostics) app.addHook('onResponse', async (request, reply) => {
      const route = request.routeOptions.url;
      if (['/auth/login','/auth/session','/auth/logout'].includes(route))
        console.log('AUTH_ROUTE=' + route + ' AUTH_STATUS=' + reply.statusCode);
    });
    const { composeSecuredPatients } = require('./secured-patient-composition');
    await composeSecuredPatients(app, { auth, trustedOrigin:ORIGIN });
    for (const [url, asset] of routes) {
      app.get(url, async (_request, reply) => reply.type(asset.type).send(asset.bytes));
    }
    app.setNotFoundHandler((_request, reply) => reply.code(404).send({ error:'Not found' }));
    app.setErrorHandler((_error, _request, reply) => reply.code(503).send({ error:'Service unavailable' }));
    await app.ready();
    return app;
  } catch (error) {
    await app.close().catch(() => {});
    throw error;
  }
}

// Separate opt-in; do not call until preflight/tests and owner device approval.
async function listenOriginalClinicRuntime(app, token) {
  assert.equal(token, 'ROBY_ORIGINAL_CLINIC_HTTPS_LISTEN');
  assert.ok(app && typeof app.listen === 'function');
  return app.listen({ host:'127.0.0.1', port:3443 });
}

module.exports = {
  ORIGIN, DATABASE, SYSTEM_ID, LOGIN_LABEL, SERVER_FINGERPRINT,
  verifyTls, verifyOriginalAssets, verifyIsolatedDatabase,
  buildOriginalClinicRuntime, listenOriginalClinicRuntime
};
