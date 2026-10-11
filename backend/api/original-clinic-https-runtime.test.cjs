'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const {
  verifyTls, verifyOriginalAssets, verifyIsolatedDatabase,
  buildOriginalClinicRuntime, listenOriginalClinicRuntime,
  DATABASE, SYSTEM_ID
} = require('./original-clinic-https-runtime.cjs');

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const temp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'roby-original-https-'));
const remove = directory => fs.rmSync(directory, { recursive:true, force:true });

function assetFixture(directory) {
  fs.mkdirSync(path.join(directory, 'assets'));
  const contents = {
    'index.html': '<!doctype html><html><body><div id="root"></div><script type="module" src="/assets/index-test.js"></script></body></html>',
    'assets/index-test.js': 'console.log("original clinic fixture");',
    'assets/index-test.css': 'body { margin: 0; }'
  };
  for (const [name, value] of Object.entries(contents)) fs.writeFileSync(path.join(directory, name), value);
  return Object.fromEntries(Object.entries(contents).map(([name, value]) => [name, hash(Buffer.from(value))]));
}

function fakePool(directory, socket, overrides = {}) {
  const state = {
    database:DATABASE, data_directory:directory, sockets:socket,
    port:'55441', addresses:'', server_address:null, system_id:SYSTEM_ID,
    ...overrides
  };
  let released = 0, reads = 0, commits = 0, rollbacks = 0;
  const client = {
    async query(sql) {
      if (sql === 'BEGIN READ ONLY') { reads++; return { rows:[] }; }
      if (sql === 'COMMIT') { commits++; return { rows:[] }; }
      if (sql === 'ROLLBACK') { rollbacks++; return { rows:[] }; }
      if (sql.includes('pg_control_system()')) return { rows:[state] };
      if (sql.includes('FROM vip_auth.credentials')) return { rows:[{
        actor_id:'11111111-1111-4111-8111-111111111111',
        login_label:'DR/MK_ROBY', enabled:true, actor_role:'DOCTOR', lifecycle_state:'ACTIVE'
      }] };
      if (sql.includes('to_regclass')) return { rows:[{ intake:true, history:true, sessions:true }] };
      throw new Error('Unexpected query in isolated fake');
    },
    release() { released++; }
  };
  return { connect:async () => client, stats:() => ({ released, reads, commits, rollbacks }) };
}

test('original build accepts reviewed bytes and rejects modified JS, missing index and unexpected assets', t => {
  const directory = temp();
  t.after(() => remove(directory));
  const manifest = assetFixture(directory);
  assert.equal(verifyOriginalAssets(directory, manifest).size, 3);
  fs.appendFileSync(path.join(directory, 'assets/index-test.js'), 'tampered');
  assert.throws(() => verifyOriginalAssets(directory, manifest), /Asset bytes differ/);
  fs.writeFileSync(path.join(directory, 'assets/index-test.js'), 'console.log("original clinic fixture");');
  const noIndex = { ...manifest };
  delete noIndex['index.html'];
  assert.throws(() => verifyOriginalAssets(directory, noIndex), /index.html required/);
  assert.throws(() => verifyOriginalAssets(directory, { ...manifest, '../secret.js':'0'.repeat(64) }), /Unexpected asset path/);
});

test('original build rejects symlinked assets', t => {
  const directory = temp();
  t.after(() => remove(directory));
  const manifest = assetFixture(directory);
  const filename = path.join(directory, 'assets/index-test.js');
  const other = path.join(directory, 'source.js');
  fs.renameSync(filename, other);
  fs.symlinkSync(other, filename);
  assert.throws(() => verifyOriginalAssets(directory, manifest), /non-symlink/);
});

test('wrong isolated database identity fails closed and rolls back read-only transaction', async t => {
  const directory = temp();
  t.after(() => remove(directory));
  const socket = path.join(directory, 'socket');
  fs.mkdirSync(socket);
  const expected = { dataDirectory:directory, socketDirectory:socket };
  for (const wrong of [
    { database:'roby_web_proof_stage6' }, { system_id:'7694773229923891271' },
    { port:'55439' }, { addresses:'127.0.0.1' }, { server_address:'127.0.0.1' },
    { sockets:'/wrong/socket' }
  ]) {
    const pool = fakePool(directory, socket, wrong);
    await assert.rejects(verifyIsolatedDatabase(pool, expected), assert.AssertionError);
    assert.deepEqual(pool.stats(), { released:1, reads:1, commits:0, rollbacks:1 });
  }
  const pool = fakePool(directory, socket);
  assert.deepEqual(await verifyIsolatedDatabase(pool, expected), {
    database:DATABASE, systemId:SYSTEM_ID, loginLabel:'DR/MK_ROBY'
  });
  assert.deepEqual(pool.stats(), { released:1, reads:1, commits:1, rollbacks:0 });
});

test('unreviewed TLS leaf is rejected before any listener', t => {
  const directory = temp();
  t.after(() => remove(directory));
  const key = path.join(directory, 'key.pem');
  const cert = path.join(directory, 'cert.pem');
  try {
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1',
      '-subj', '/CN=localhost', '-keyout', key, '-out', cert], { stdio:'pipe', timeout:15000 });
  } catch (error) {
    t.skip('openssl executable unavailable for ephemeral TLS negative fixture');
    return;
  }
  assert.throws(() => verifyTls({
    ca:fs.readFileSync(cert), cert:fs.readFileSync(cert), key:fs.readFileSync(key)
  }), /Unreviewed TLS leaf/);
});

test('runtime does not silently build without explicit TLS, and listen requires opt-in token', async () => {
  await assert.rejects(buildOriginalClinicRuntime({
    auth:{ login() {}, withAuthorized() {} }, tls:{}, manifest:{}, assetsDirectory:'/not-a-build'
  }), /Explicit TLS V2/);
  await assert.rejects(listenOriginalClinicRuntime({ listen() { throw Error('must not listen'); } }, 'wrong'),
    /ROBY_ORIGINAL_CLINIC_HTTPS_LISTEN/);
});
