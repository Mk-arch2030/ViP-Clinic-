'use strict';

// Source/build/start only. No database creation, reset, migration or proof rewrite.
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash, randomBytes } = require('node:crypto');
const prior = require('./stage6-device-package.cjs');
const REPO = path.resolve(__dirname, '../..');
const PROOF_HEAD = 'fdd52be105e90a3c5f4894d9f5b5fe7fb8f73bd8';
const REVIEWED_THEME_HASH = 'ba5a7bd86fbed4d4b60d531928cba047f18a193366452e1762773f149c9f9c76';
const TOKENS = Object.freeze({ preflight:'ROBY_CLINIC_CONNECTED_PREFLIGHT', build:'ROBY_CLINIC_CONNECTED_BUILD', start:'ROBY_CLINIC_CONNECTED_START' });
const hash = value => createHash('sha256').update(value).digest('hex');
const git = (repo, args) => execFileSync('git', ['-C', repo, ...args], { env:{ ...process.env, GIT_OPTIONAL_LOCKS:'0' }, maxBuffer:32*1024*1024 });
let phase = 'ARGUMENT_GUARD';

function parseArgs(args) {
  assert.equal(args.length, 3);
  const [mode, token, head] = args;
  assert.ok(Object.hasOwn(TOKENS, mode)); assert.equal(token, TOKENS[mode]); assert.match(head, /^[0-9a-f]{40}$/);
  return { mode, head };
}
function sources(repo, head) {
  const result = prior.sourcePreflight(repo, head);
  const names = git(repo, ['ls-tree', '-r', '--name-only', head]).toString().trim().split('\n').filter(name =>
    (name.startsWith('src/') && name !== 'src/index.css') || ['clinic-connected.html', 'vite.clinic-connected.config.ts', 'backend/web-proof/clinic-connected-device.cjs', 'backend/web-proof/clinic-connected-device.test.cjs'].includes(name));
  assert.ok(names.includes('src/App.tsx') && names.includes('src/components/ConnectedPatients.tsx'));
  for (const name of names) {
    const bytes = git(repo, ['show', head + ':' + name]);
    assert.equal(hash(prior.readRegular(path.join(repo, name))), hash(bytes), 'Source mismatch'); result[name] = hash(bytes);
  }
  const lock = JSON.parse(prior.readRegular(path.join(repo, 'package-lock.json')));
  for (const name of ['lucide-react', 'tailwindcss', '@tailwindcss/vite', '@vitejs/plugin-react']) {
    assert.equal(JSON.parse(prior.readRegular(path.join(repo, 'node_modules', name, 'package.json'))).version, lock.packages['node_modules/' + name]?.version);
  }
  return result;
}
function devicePaths(home, head) {
  const base = prior.devicePaths(home, head);
  const root = path.join(base.root, 'clinic-connected');
  return { ...base, root, build:path.join(root, 'build-' + head), run:path.join(root, 'run-' + head), manifest:path.join(root, 'run-' + head, 'build-manifest.json'),
    baseline:path.join(base.root, 'run-' + PROOF_HEAD, 'database-baseline.json') };
}
function publicTls(paths) {
  prior.safeDirectory(paths.tls, true);
  const cert = prior.readRegular(path.join(paths.tls, 'server.cert.pem'), 16384, true);
  const ca = prior.readRegular(path.join(paths.tls, 'ca.cert.der'), 16384, true);
  return { cert, review:prior.verifyPublicCertificates(ca, cert) };
}
function baselineRecord(value) {
  assert.deepEqual(Object.keys(value).sort(), ['head','database','systemId','schemaHash'].sort());
  assert.equal(value.head, PROOF_HEAD); assert.equal(value.database, prior.DATABASE); assert.equal(value.systemId, prior.SYSTEM_ID); assert.match(value.schemaHash, /^[0-9a-f]{64}$/);
  return value;
}
function validateExistingBaseline(value) {
  // Auth activity is expected after the owner's successful browser login/GET.
  // It is not reset, replayed or treated as a fresh zero-session proof.
  for (const count of [value.sessions, value.attempts]) assert.ok(Number.isSafeInteger(count) && count >= 0);
  prior.validateNewBaseline({ ...value, sessions:0, attempts:0 }, PROOF_HEAD);
}
async function verifyExistingDatabase(client, record, identity) {
  baselineRecord(record);
  assert.equal(await identity(client, prior.DATABASE), prior.SYSTEM_ID);
  let began = false;
  try {
    await client.query('BEGIN READ ONLY'); began = true;
    const value = await prior.collectBaseline(client, prior.SYSTEM_ID);
    validateExistingBaseline(value);
    assert.equal(hash(JSON.stringify(await prior.schemaState(client))), record.schemaHash);
    const owner = await client.query('SELECT pg_get_userbyid(datdba)=current_user AS owns FROM pg_database WHERE datname=current_database()');
    assert.equal(owner.rows[0].owns, true);
    await client.query('COMMIT'); began = false;
    return value;
  } finally { if (began) await client.query('ROLLBACK'); }
}
async function unusedPort() {
  await new Promise((resolve, reject) => {
    const socket = net.createConnection({ host:'127.0.0.1', port:3443 });
    socket.setTimeout(1500);
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned prior listener must be closed first')); });
    socket.once('timeout', () => { socket.destroy(); reject(new Error('Inconclusive port probe')); });
    socket.once('error', error => { socket.destroy(); error.code === 'ECONNREFUSED' ? resolve() : reject(error); });
  });
}
function writeNew(file, value) {
  const fd = fs.openSync(file, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function validateManifest(value, expected) {
  assert.deepEqual(Object.keys(value).sort(), ['head','proofHead','origin','database','sources','themeHash','tls','assets'].sort());
  for (const key of ['head','proofHead','origin','database','themeHash']) assert.equal(value[key], expected[key]);
  assert.deepEqual(value.sources, expected.sources); assert.deepEqual(value.tls, expected.tls); prior.validateAssetMap(value.assets);
}
async function execute({ mode, head }) {
  phase = 'SOURCE_TLS_AND_PRIOR_PREPARATION_RECORD';
  const before = prior.snapshot(REPO), sourceHashes = sources(REPO, head);
  const paths = devicePaths(process.env.HOME, head), tls = publicTls(paths);
  const record = baselineRecord(JSON.parse(prior.readRegular(paths.baseline, 16384, true)));
  const themeHash = hash(prior.readRegular(path.join(REPO, 'src/index.css')));
  assert.equal(themeHash, REVIEWED_THEME_HASH, 'Protected theme differs from owner-reviewed bytes');
  const guards = require('../auth/postgres-proof-guards.cjs');
  const cluster = guards.clusterPaths(process.env.HOME, process.env.PREFIX || '/data/data/com.termux/files/usr');
  const pid = guards.preflightCluster(cluster); process.kill(Number(pid), 0);
  await unusedPort(); assert.deepEqual(prior.snapshot(REPO), before);
  console.log('CONNECTED_SOURCE_TLS_PRIOR_RECORD_AND_UNUSED_PORT=PASS_NOT_SQL_OR_BROWSER_PROOF');
  console.log('PROTECTED_LOCAL_THEME_SHA256=' + themeHash);
  if (mode === 'preflight') return;
  const expected = { head, proofHead:PROOF_HEAD, origin:prior.ORIGIN, database:prior.DATABASE, sources:sourceHashes, themeHash, tls:tls.review };
  if (mode === 'build') {
    phase = 'FRESH_CONNECTED_BUILD';
    if (!fs.existsSync(paths.root)) fs.mkdirSync(paths.root, { mode:0o700 });
    prior.safeDirectory(paths.root, true);
    assert.equal(fs.existsSync(paths.build), false); assert.equal(fs.existsSync(paths.run), false);
    fs.mkdirSync(paths.build, { mode:0o700 }); fs.mkdirSync(paths.run, { mode:0o700 });
    const vite = path.join(REPO, 'node_modules/vite/bin/vite.js'); prior.readRegular(vite);
    execFileSync(process.execPath, [vite, 'build', '--config', path.join(REPO, 'vite.clinic-connected.config.ts'), '--outDir', paths.build], { cwd:REPO, stdio:'pipe', timeout:120000, maxBuffer:4*1024*1024 });
    const html = path.join(paths.build, 'clinic-connected.html'); prior.readRegular(html);
    assert.equal(fs.existsSync(path.join(paths.build, 'stage6-integration.html')), false);
    fs.renameSync(html, path.join(paths.build, 'stage6-integration.html'));
    const assets = prior.buildAssets(paths.build);
    assert.deepEqual(sources(REPO, head), sourceHashes); assert.deepEqual(prior.snapshot(REPO), before); publicTls(paths);
    writeNew(paths.manifest, { ...expected, assets });
    console.log('EXISTING_CLINIC_UI_SEPARATE_BUILD_AND_ASSET_MANIFEST=PASS'); console.log('MANIFEST=' + paths.manifest);
    return;
  }
  prior.safeDirectory(paths.root, true); prior.safeDirectory(paths.run, true);
  const manifest = JSON.parse(prior.readRegular(paths.manifest, 4*1024*1024, true)); validateManifest(manifest, expected);
  assert.deepEqual(prior.buildAssets(paths.build), manifest.assets);
  phase = 'EXISTING_STAGE6_READONLY_BUSINESS_BASELINE';
  const proof = require('../auth/postgres-proof.cjs');
  const { Pool } = require('pg');
  const pool = new Pool(proof.connectionOptions(cluster, prior.DATABASE));
  let app, handed = false;
  try {
    const client = await pool.connect();
    try { await verifyExistingDatabase(client, record, (connection, database) => proof.identity(connection, cluster, database)); }
    finally { client.release(); }
    console.log('EXISTING_STAGE6_IDENTITY_SCHEMA_AND_UNCHANGED_BUSINESS_BASELINE=PASS');
    const key = prior.readRegular(path.join(paths.tls, 'server.key.pem'), 16384, true);
    const { AuthRepository } = require('../persistence/auth-repository');
    const { createAuthService } = require('../auth/auth-service');
    const { createVerifier } = require('../auth/password-verifier');
    const auth = createAuthService({ store:new AuthRepository(pool), dummyVerifier:await createVerifier(randomBytes(32).toString('base64url')) });
    const runtime = require('../api/stage6-web-test-runtime.cjs');
    handed = true;
    app = await runtime.buildStage6WebTestRuntime({ auth, pool, ownsPool:true, tls:{ key, cert:tls.cert }, assetsDirectory:paths.build, manifest:manifest.assets });
    assert.deepEqual(sources(REPO, head), sourceHashes); assert.deepEqual(prior.snapshot(REPO), before);
    assert.equal(guards.preflightCluster(cluster), pid); process.kill(Number(pid), 0);
    phase = 'OWNED_CONNECTED_HTTPS_LISTENER';
    const address = await app.listen({ host:'127.0.0.1', port:3443 });
    assert.equal(address, prior.ORIGIN); assert.equal(app.server.address().address, '127.0.0.1');
    const close = await prior.shutdownOwned(app, () => assert.deepEqual(prior.snapshot(REPO), before));
    const stopped = async () => { try { await close(); console.log('OWNED_CONNECTED_LISTENER_AND_POOL_CLOSED=PASS'); console.log('PROTECTED_SOURCE_STATUS_INDEX_AND_UNTRACKED_BYTES=UNCHANGED'); } catch { console.error('OWNED_CLOSE=FAILED_INSPECT'); process.exitCode=1; } };
    process.once('SIGINT', stopped); process.once('SIGTERM', stopped);
    console.log('LISTENER_ADDRESS=' + address); console.log('EXISTING_CLINIC_UI_WITH_SERVER_PATIENT_TAB=STARTED_NOT_BROWSER_PROOF');
    console.log('DATABASE_CREATE_RESET_PROOF_REWRITE_AND_PRIOR_DATABASE_CONNECTIONS=NONE');
    return close;
  } catch (error) {
    if (app) await app.close(); else if (!handed) await pool.end();
    throw error;
  }
}
async function main(args = process.argv.slice(2)) {
  let before, close;
  try {
    const parsed = parseArgs(args); before = prior.snapshot(REPO); close = await execute(parsed);
    assert.deepEqual(prior.snapshot(REPO), before); console.log('PROTECTED_SOURCE_STATUS_INDEX_AND_UNTRACKED_BYTES=UNCHANGED');
  } catch (error) {
    if (close) try { await close(); } catch { console.error('OWNED_CLOSE=FAILED_INSPECT'); }
    console.error('CONNECTED_COMMAND=FAILED_RETAIN_BOUNDED_STATE'); console.error('FAILED_PHASE=' + phase);
    if (typeof error.code === 'string' && /^[A-Z0-9_]{1,16}$/.test(error.code)) console.error('ERROR_CODE=' + error.code);
    process.exitCode=1;
  } finally {
    if (before) try { assert.deepEqual(prior.snapshot(REPO), before); } catch { if (close) try { await close(); } catch {} console.error('PROTECTED_STATE=CHANGED_INSPECT'); process.exitCode=1; }
    console.log('CLUSTER_STOP_DROP_RESET_AND_TRUST_CHANGES=NONE');
  }
}
module.exports = { PROOF_HEAD, TOKENS, parseArgs, sources, devicePaths, baselineRecord, validateExistingBaseline, verifyExistingDatabase, validateManifest };
if (require.main === module) void main();
