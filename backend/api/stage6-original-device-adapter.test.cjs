'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const {
  MANIFEST, devicePaths, startDevice
} = require('./stage6-original-device-adapter.cjs');

test('device adapter has reviewed original clinic manifest, not integration harness', () => {
  assert.deepEqual(Object.keys(MANIFEST).sort(), [
    'assets/index-2N0Bm-oO.js','assets/index-5HTzZxPU.css','index.html'
  ]);
  assert.ok(!Object.keys(MANIFEST).some(name => name.includes('integration')));
});

test('device paths are isolated and do not point at historical cluster', () => {
  const home = path.join(os.tmpdir(), 'roby-stage6-device-fixture');
  const p = devicePaths(home);
  assert.equal(p.dataDirectory, path.join(home, 'vip-intake-proof-stage6-isolated/data'));
  assert.equal(p.socketDirectory, path.join(home, 'vip-intake-proof-stage6-isolated/socket'));
  assert.equal(p.buildDirectory, path.join(home, 'vip-clinic-original-stage6-build'));
  assert.ok(!JSON.stringify(p).includes('vip-retrieve-proof-isolated'));
});

test('device adapter refuses missing owner token before any TLS, database or listener', async () => {
  await assert.rejects(
    startDevice({ token:'wrong', serverKeyFile:'/not/a/key', listen:true }),
    error => error instanceof assert.AssertionError &&
      error.expected === 'ROBY_ORIGINAL_CLINIC_DEVICE_PREFLIGHT'
  );
});

test('device adapter rejects implicit listen mode before touching device inputs', async () => {
  await assert.rejects(
    startDevice({ token:'ROBY_ORIGINAL_CLINIC_DEVICE_PREFLIGHT',
      serverKeyFile:'/not/a/key', listen:'yes' }),
    error => error instanceof assert.AssertionError
  );
});
