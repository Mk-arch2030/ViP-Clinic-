'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  MANIFEST, TOKEN, devicePaths, startDevice
} = require('./stage6-outer-doctor-device-adapter.cjs');
const { verifyExactBuildInventory } = require('./stage6-outer-doctor-device-adapter.cjs');

test('outer doctor gate uses reviewed Vite build manifest', () => {
  assert.deepEqual(MANIFEST, {
    'index.html': '5d4afdd937647808bc9237d1528a956e1bac9407ba681d288daa34f7fd732d4d',
    'assets/index-CqPJO-CD.js': 'd6dc91b56e1b329fb106f98e31025f28b1c9ff03e4db740fa95d5489a46f58c1',
    'assets/index-S6K4ltaM.css': '15714371df315030275e2028849b896bd984abf5175ef07c779cb484c825f861'
  });
  assert.equal(TOKEN, 'ROBY_OUTER_DOCTOR_GATE_PREFLIGHT');
});

test('outer gate build path is independent from original build', () => {
  const home = path.join(os.tmpdir(), 'roby-path-proof');
  const paths = devicePaths(home);
  assert.equal(paths.buildDirectory, path.join(home, 'vip-shared-session-step105-build-review'));
  assert.notEqual(paths.buildDirectory, path.join(home, 'vip-clinic-original-stage6-build'));
  assert.equal(paths.socketDirectory, path.join(home, 'vip-intake-proof-stage6-isolated/socket'));
});

test('wrong owner token fails before filesystem and database access', async () => {
  await assert.rejects(
    startDevice({ token: 'WRONG', serverKeyFile: '/missing/key', listen: true }),
    /Outer doctor gate owner token required/
  );
});

test('missing owner token fails closed', async () => {
  await assert.rejects(
    startDevice({ serverKeyFile: '/missing/key' }),
    /Outer doctor gate owner token required/
  );
});

test('implicit listen is forbidden and explicit boolean is required', async () => {
  await assert.rejects(
    startDevice({ token: TOKEN, serverKeyFile: '/missing/key', listen: 'yes' }),
    { name: 'AssertionError' }
  );
});

test('asset verifier rejects modified or unexpected build files', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'roby-gate-assets-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'assets'));
  // Hermetic bytes exercise the real verifier; no owner device build is required.
  const content = { 'index.html': '<html><div id="root"></div></html>', 'assets/test.js': 'export default 1;', 'assets/test.css': 'body{}' };
  const manifest = Object.fromEntries(Object.entries(content).map(([name, value]) => {
    fs.writeFileSync(path.join(dir, name), value);
    return [name, require('node:crypto').createHash('sha256').update(value).digest('hex')];
  }));
  assert.equal(verifyExactBuildInventory(dir, manifest).size, 3);
  const js = path.join(dir, 'assets/test.js');
  fs.appendFileSync(js, '\n// unauthorized change\n');
  assert.throws(() => verifyExactBuildInventory(dir, manifest), /Asset bytes differ/);
  fs.writeFileSync(js, content['assets/test.js']);
  fs.writeFileSync(path.join(dir, 'assets/extra.js'), 'unexpected');
  assert.throws(() => verifyExactBuildInventory(dir, manifest), /Unexpected|extra|manifest|file/i);
});
