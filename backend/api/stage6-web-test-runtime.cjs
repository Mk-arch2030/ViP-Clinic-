'use strict';

// Explicit test infrastructure. Import loads only Node builtins and starts nothing.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash, X509Certificate, createPrivateKey, createPublicKey } = require('node:crypto');
const ORIGIN = 'https://127.0.0.1:3443';
const DATABASE = 'roby_web_proof_stage6';
const SYSTEM_ID = '7694773229923891271';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const CLEAR_COOKIE = '__Host-vip_session=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0';
const SOURCE_FILES = Object.freeze([
  'src/integration/basic-patient.ts','src/integration/web-api-client.ts','src/integration/web-api-client.test.ts',
  'src/integration/session-coordinator.ts','src/integration/session-coordinator.test.ts',
  'src/integration/Stage6IntegrationApp.tsx','src/integration/main.tsx','src/integration/integration.css',
  'stage6-integration.html','vite.stage6.config.ts','backend/api/stage6-web-test-runtime.cjs',
  'backend/api/stage6-web-test-runtime.test.cjs',
]);

function tlsOptions(tls, now = Date.now()) {
  assert.ok(tls && (typeof tls.key === 'string' || Buffer.isBuffer(tls.key)) &&
    (typeof tls.cert === 'string' || Buffer.isBuffer(tls.cert)), 'Explicit certificate/key required');
  const cert = new X509Certificate(tls.cert);
  assert.equal(cert.checkIP('127.0.0.1'),'127.0.0.1','Certificate must cover the selected loopback IP');
  assert.ok(Date.parse(cert.validFrom) <= now && now < Date.parse(cert.validTo),'Certificate not currently valid');
  const key = createPublicKey(createPrivateKey(tls.key)).export({ format:'der',type:'spki' });
  assert.ok(key.equals(cert.publicKey.export({ format:'der',type:'spki' })),'Certificate/key mismatch');
  return { key:tls.key,cert:tls.cert,minVersion:'TLSv1.2' };
}

function readAssets(directory, manifest) {
  assert.equal(typeof directory,'string');
  assert.ok(path.isAbsolute(directory));
  assert.equal(fs.realpathSync(directory),directory,'Resolved build directory differs');
  assert.ok(!fs.lstatSync(directory).isSymbolicLink(),'Build root symlink prohibited');
  assert.ok(manifest && typeof manifest === 'object' && !Array.isArray(manifest));
  const entries = Object.entries(manifest);
  assert.ok(entries.length >= 1 && entries.length <= 32 && Object.hasOwn(manifest,'stage6-integration.html'));
  const assets = new Map();
  let total = 0;
  for (const [name,expectedHash] of entries) {
    assert.ok(name === 'stage6-integration.html' || /^assets\/[A-Za-z0-9_-][A-Za-z0-9._-]*\.(js|css)$/.test(name),'Unapproved asset path');
    assert.match(expectedHash,/^[0-9a-f]{64}$/);
    const file = path.join(directory,name);
    if (name.startsWith('assets/')) assert.ok(!fs.lstatSync(path.join(directory,'assets')).isSymbolicLink(),'Asset directory symlink prohibited');
    const stat = fs.lstatSync(file);
    assert.ok(stat.isFile() && !stat.isSymbolicLink(),'Only regular assets accepted');
    const bytes = fs.readFileSync(file);
    total += bytes.length;
    assert.ok(total <= 16*1024*1024,'Asset budget exceeded');
    assert.equal(digest(bytes),expectedHash,'Build bytes mismatch');
    const type = name.endsWith('.html') ? 'text/html; charset=utf-8' : name.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8';
    assets.set(name === 'stage6-integration.html' ? '/' : '/'+name,{ bytes,type });
  }
  return assets;
}

async function buildStage6WebTestRuntime({ auth, pool, ownsPool = false, trustedOrigin = ORIGIN, tls, assetsDirectory, manifest } = {}) {
  // A pool already created by an explicit caller is never contacted during build.
  let app;
  let closed = false;
  const closeOwned = async () => { if (ownsPool && !closed) { closed = true; await pool.end(); } };
  try {
    assert.equal(trustedOrigin,ORIGIN,'Only the fixed loopback test origin is accepted');
    assert.equal(typeof ownsPool,'boolean');
    if (ownsPool) assert.equal(typeof pool?.end,'function');
    const https = tlsOptions(tls);
    const assets = readAssets(assetsDirectory,manifest);
    const Fastify = require('fastify');
    app = Fastify({ https,logger:false,trustProxy:false,bodyLimit:4096,requestTimeout:15000,
      connectionTimeout:15000,keepAliveTimeout:5000 });
    app.addHook('onClose',closeOwned);
    app.addHook('onRequest',async (request,reply) => {
      if (request.raw.socket.encrypted !== true) return reply.code(403).send({ error:'Protected transport required' });
      if (request.headers.host !== '127.0.0.1:3443') return reply.code(400).send({ error:'Invalid request' });
      reply.header('X-Content-Type-Options','nosniff');
      reply.header('Cache-Control','no-store');
      reply.header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    });
    app.addHook('onSend',async (request,reply,payload) => {
      // An invalid HttpOnly cookie cannot be cleared by the UI; don't trap a user after idle expiry.
      if (reply.statusCode === 401 && ['/auth/session','/auth/logout'].includes(request.routeOptions.url)) reply.header('Set-Cookie',CLEAR_COOKIE);
      return payload;
    });
    const { composeSecuredPatients } = require('./secured-patient-composition');
    await composeSecuredPatients(app,{ auth,trustedOrigin });
    for (const [url,asset] of assets) app.get(url,async (_request,reply) => reply.type(asset.type).send(asset.bytes));
    app.setNotFoundHandler((_request,reply) => reply.code(404).send({ error:'Not found' }));
    app.setErrorHandler((_error,_request,reply) => reply.code(503).send({ error:'Service unavailable' }));
    await app.ready();
    return app;
  } catch (error) {
    if (app) await app.close().catch(() => {});
    await closeOwned();
    throw new Error('Web test runtime unavailable');
  }
}

function sourcePreflight(repo, expectedHead) {
  assert.match(expectedHead,/^[0-9a-f]{40}$/);
  const guards = require('../auth/postgres-proof-guards.cjs');
  guards.preflightSource(repo,expectedHead);
  const { execFileSync } = require('node:child_process');
  for (const filename of SOURCE_FILES) {
    assert.equal(digest(fs.readFileSync(path.join(repo,filename))),
      digest(execFileSync('git',['-C',repo,'show',expectedHead+':'+filename])),'Integration source bytes mismatch');
  }
  return guards;
}

async function startStage6WebTestRuntime(options = {}) {
  // Not a production or automatic CLI entry. Stage 6-E owns preparation and explicit invocation.
  assert.equal(options.token,'ROBY_STAGE6_WEB_START','Explicit execution token required');
  assert.equal(options.buildHead,options.expectedHead,'Build/source HEAD mismatch');
  const repo = path.resolve(__dirname,'../..');
  const guards = sourcePreflight(repo,options.expectedHead);
  tlsOptions(options.tls);
  readAssets(options.assetsDirectory,options.manifest);
  const expected = guards.clusterPaths(process.env.HOME,process.env.PREFIX || '/data/data/com.termux/files/usr');
  const pid = guards.preflightCluster(expected);
  process.kill(Number(pid),0);
  const before = guards.snapshot(repo);
  const { Pool } = require('pg');
  const { connectionOptions,identity } = require('../auth/postgres-proof.cjs');
  const pool = new Pool(connectionOptions(expected,DATABASE));
  let app;
  let poolHandedToBuilder = false;
  try {
    const client = await pool.connect();
    try {
      assert.equal(await identity(client,expected,DATABASE),SYSTEM_ID);
      assert.equal((await client.query('SHOW transaction_read_only')).rows[0].transaction_read_only,'off');
      // Requires independently prepared Stage 6 evidence. Never initializes or resets here.
      const proof = (await client.query('SELECT head,system_identifier FROM vip_auth.proof_manifest WHERE singleton=true')).rows;
      assert.deepEqual(proof,[{ head:options.expectedHead,system_identifier:SYSTEM_ID }]);
    } finally { client.release(); }
    const { AuthRepository } = require('../persistence/auth-repository');
    const { createAuthService } = require('../auth/auth-service');
    const { createVerifier } = require('../auth/password-verifier');
    const { randomBytes } = require('node:crypto');
    const dummyVerifier = await createVerifier(randomBytes(32).toString('base64url'));
    const auth = createAuthService({ store:new AuthRepository(pool),dummyVerifier });
    poolHandedToBuilder = true;
    app = await buildStage6WebTestRuntime({ ...options,pool,ownsPool:true,auth });
    assert.equal(guards.preflightCluster(expected),pid);
    assert.deepEqual(guards.snapshot(repo),before);
    const address = await app.listen({ host:'127.0.0.1',port:3443 });
    return { app,address };
  } catch {
    if (app) await app.close().catch(() => {});
    else if (!poolHandedToBuilder) await pool.end().catch(() => {});
    throw new Error('Web test startup failed; inspect bounded state');
  }
}

module.exports = { ORIGIN,DATABASE,tlsOptions,readAssets,buildStage6WebTestRuntime,startStage6WebTestRuntime };
