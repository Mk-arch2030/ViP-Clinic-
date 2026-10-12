'use strict';
// New build adapter only. Reuses the established TLS, doctor identity and runtime.
// No schema migration, credential change or database initialization.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { createHash, randomBytes, X509Certificate, createPrivateKey, createPublicKey } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const runtime = require('./original-clinic-https-runtime.cjs');
const previous = require('./stage6-original-device-adapter.cjs');
const outer = require('./stage6-outer-doctor-device-adapter.cjs');
const guards = require('../web-proof/stage6-device-package.cjs');
const BRANCH = 'work/original-clinic-postgres-unification';
const TOKEN = 'ROBY_ORIGINAL_CLINIC_UNIFIED';
const REPO = path.resolve(__dirname, '../..');
const hash = value => createHash('sha256').update(value).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: REPO, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }, maxBuffer:32*1024*1024 }).toString().trim();
function parseArgs(args) {
  assert.ok(args.length === 3 || args.length === 4, 'Action/token/full HEAD and existing key path for preflight/listen required');
  const [action, token, head, serverKeyFile] = args;
  assert.ok(['build', 'preflight', 'listen'].includes(action), 'Unknown action');
  assert.equal(token, TOKEN, 'Owner execution token required');
  assert.match(head, /^[0-9a-f]{40}$/);
  if (serverKeyFile !== undefined) assert.ok(path.isAbsolute(serverKeyFile), 'Existing absolute key path required');
  return { action, head, serverKeyFile };
}
function sourceCheck(head) {
  assert.equal(git('rev-parse', 'HEAD'), head, 'Source HEAD mismatch');
  assert.equal(git('branch', '--show-current'), BRANCH, 'Dedicated branch required');
  assert.ok(['git@github.com:Mk-arch2030/ViP-Clinic-.git','https://github.com/Mk-arch2030/ViP-Clinic-.git','ssh://git@github.com/Mk-arch2030/ViP-Clinic-.git'].includes(git('remote','get-url','origin')));
  assert.equal(git('diff', '--cached', '--name-only'), '', 'Staged changes prohibited');
  assert.equal(git('ls-files', '-u'), '', 'Unmerged paths prohibited');
  const files = git('ls-tree', '-r', '--name-only', head).split('\n').filter(name =>
    /^(src|backend|domain|application)\//.test(name) || ['package.json','package-lock.json','index.html','vite.config.ts'].includes(name));
  const sources = {};
  for (const name of files) {
    if (name === 'src/index.css') continue; // Preserve the owner's local theme, record its actual hash separately.
    const bytes = guards.readRegular(path.join(REPO, name));
    assert.equal(hash(bytes), hash(execFileSync('git', ['show', head + ':' + name], { cwd: REPO, maxBuffer:32*1024*1024 })), 'Source bytes differ: ' + name);
    sources[name] = hash(bytes);
  }
  const lock = JSON.parse(guards.readRegular(path.join(REPO, 'package-lock.json')));
  for (const name of ['react','react-dom','vite','pg','fastify','tsx']) {
    assert.equal(JSON.parse(guards.readRegular(path.join(REPO,'node_modules',name,'package.json'))).version, lock.packages['node_modules/'+name]?.version, 'Run npm ci for locked dependencies');
  }
  return sources;
}
function buildPaths(home, head) {
  assert.ok(path.isAbsolute(home));
  const root = path.join(home, 'vip-original-unified-review');
  return { root, build: path.join(root, 'build-' + head), manifest: path.join(root, 'manifest-' + head + '.json') };
}
function locateExistingKey(tlsDirectory) {
  // Select only an existing private key matching the pinned public certificate;
  // never print key bytes and never generate, rewrite or rotate a key.
  guards.safeDirectory(tlsDirectory);
  const cert = new X509Certificate(guards.readRegular(path.join(tlsDirectory, 'server.cert.pem'), 16384));
  assert.equal(cert.fingerprint256.toUpperCase(), runtime.SERVER_FINGERPRINT);
  const expected = cert.publicKey.export({ type:'spki', format:'der' });
  const matches = [];
  for (const name of fs.readdirSync(tlsDirectory)) {
    if (!name.endsWith('.pem')) continue;
    const file = path.join(tlsDirectory, name), stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 16384 || (stat.mode & 0o077) || stat.uid !== process.getuid()) continue;
    try {
      const actual = createPublicKey(createPrivateKey(guards.readRegular(file,16384))).export({ type:'spki', format:'der' });
      if (actual.equals(expected)) matches.push(file);
    } catch { /* Certificates and public keys are not private-key candidates. */ }
  }
  assert.equal(matches.length, 1, 'Exactly one existing matching private key required; otherwise pass the prior explicit key path');
  return matches[0];
}
function writeNew(file, value) {
  const fd = fs.openSync(file, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function assetManifest(directory) {
  const names = ['index.html', ...fs.readdirSync(path.join(directory,'assets')).map(n=>'assets/'+n)];
  const manifest = Object.fromEntries(names.map(name => [name, hash(guards.readRegular(path.join(directory,name)))]));
  outer.verifyExactBuildInventory(directory, manifest);
  return manifest;
}
function validateRecord(record, expected) {
  assert.deepEqual(Object.keys(record).sort(), ['head','branch','themeHash','sources','assets'].sort());
  for (const key of ['head','branch','themeHash']) assert.equal(record[key], expected[key]);
  assert.deepEqual(record.sources, expected.sources);
  assert.ok(record.assets && Object.hasOwn(record.assets,'index.html'));
  return record.assets;
}
async function execute({ action, head, serverKeyFile }) {
  const before = guards.snapshot(REPO);
  let pool, app;
  try {
    const sources = sourceCheck(head);
    const paths = buildPaths(os.homedir(), head);
    const expected = { head, branch: BRANCH, themeHash: hash(guards.readRegular(path.join(REPO,'src/index.css'))), sources };
    if (action === 'build') {
      guards.safeDirectory(os.homedir());
      if (!fs.existsSync(paths.root)) fs.mkdirSync(paths.root, { mode:0o700 });
      guards.safeDirectory(paths.root,true);
      assert.equal(fs.existsSync(paths.build),false,'Fresh build path required; do not overwrite prior proof');
      fs.mkdirSync(paths.build,{mode:0o700});
      execFileSync(process.execPath,[path.join(REPO,'node_modules/vite/bin/vite.js'),'build','--outDir',paths.build,'--emptyOutDir','false'],{cwd:REPO,stdio:'pipe',timeout:120000,maxBuffer:4*1024*1024});
      const assets = assetManifest(paths.build);
      assert.deepEqual(sourceCheck(head), sources);
      assert.deepEqual(guards.snapshot(REPO), before);
      writeNew(paths.manifest,{...expected,assets});
      return { status:'UNIFIED_ORIGINAL_CLINIC_BUILD_PASS_NOT_BROWSER_PROOF', close:async()=>{} };
    }
    guards.safeDirectory(paths.root,true);
    const record=JSON.parse(guards.readRegular(paths.manifest,4*1024*1024,true));
    const assets=validateRecord(record,expected);
    assert.deepEqual(assetManifest(paths.build),assets);
    // Existing private inputs and certificate/identity pins are reused unchanged.
    const existing=previous.devicePaths(os.homedir());
    const {tls,password}=previous.preflightDevice(existing,serverKeyFile ?? locateExistingKey(existing.tlsDirectory));
    const {Pool}=require('pg');
    pool=new Pool({host:existing.socketDirectory,port:55441,database:'roby_intake_proof_stage6',user:os.userInfo().username,password,ssl:false,max:6,connectionTimeoutMillis:5000,
      options:'-c search_path=pg_catalog,public -c statement_timeout=10000 -c lock_timeout=5000'});
    await runtime.verifyIsolatedDatabase(pool,existing);
    assert.deepEqual(guards.snapshot(REPO),before);
    if(action==='preflight'){await pool.end();pool=null;return {status:'UNIFIED_BUILD_AND_EXISTING_DATABASE_PREFLIGHT_PASS',close:async()=>{}};}
    const {AuthRepository}=require('../persistence/auth-repository');
    const {createAuthService}=require('../auth/auth-service');
    const {createVerifier}=require('../auth/password-verifier');
    const auth=createAuthService({store:new AuthRepository(pool),dummyVerifier:await createVerifier(randomBytes(32).toString('base64url'))});
    app=await runtime.buildOriginalClinicRuntime({pool,auth,tls,assetsDirectory:paths.build,manifest:assets,expectedDatabase:existing});
    assert.deepEqual(sourceCheck(head),sources);assert.deepEqual(guards.snapshot(REPO),before);
    const address=await runtime.listenOriginalClinicRuntime(app,'ROBY_ORIGINAL_CLINIC_HTTPS_LISTEN');
    let closing;
    const close=()=>closing??=(async()=>{try{await app.close();}finally{await pool.end();}assert.deepEqual(guards.snapshot(REPO),before);})();
    return {status:'UNIFIED_ORIGINAL_CLINIC_HTTPS_STARTED_NOT_BROWSER_PROOF',address,close};
  } catch(error){if(app)await app.close().catch(()=>{});if(pool)await pool.end().catch(()=>{});throw error;}
  finally { assert.deepEqual(guards.snapshot(REPO),before,'Protected source/worktree changed'); }
}
if(require.main===module){
  Promise.resolve().then(()=>execute(parseArgs(process.argv.slice(2)))).then(result=>{
    console.log('ORIGINAL_CLINIC='+result.status);
    if(result.address){console.log('LISTENER_ADDRESS='+result.address);let closing=false;const stop=()=>{if(closing)return;closing=true;result.close().then(()=>{console.log('OWNED_LISTENER_AND_POOL_CLOSED=PASS');},()=>{console.error('OWNED_CLOSE=FAILED_INSPECT');process.exitCode=1;});};process.once('SIGINT',stop);process.once('SIGTERM',stop);}
    console.log('DATABASE_MIGRATION_CREDENTIAL_ROTATION_AND_TLS_CHANGES=NONE');
  }).catch(error=>{console.error('ORIGINAL_CLINIC=FAILED');console.error('ERROR_TYPE='+error.name);if(error instanceof assert.AssertionError)console.error('CHECK='+String(error.message).split('\n')[0]);else if(/^[A-Z0-9_]{1,20}$/.test(error.code??''))console.error('ERROR_CODE='+error.code);process.exitCode=1;});
}
module.exports={BRANCH,TOKEN,parseArgs,buildPaths,assetManifest,validateRecord,locateExistingKey};
