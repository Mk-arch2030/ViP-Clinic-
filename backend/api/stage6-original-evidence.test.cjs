'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { collectEvidence } = require('./stage6-original-evidence.cjs');

test('preflight refuses missing and noncanonical evidence paths without side effects', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'roby-evidence-'));
  t.after(() => fs.rmSync(dir, { recursive:true, force:true }));
  const build = path.join(dir, 'build');
  fs.mkdirSync(build);
  fs.mkdirSync(path.join(build, 'assets'));
  fs.writeFileSync(path.join(build, 'index.html'), '<div id="root"></div>');
  const cert = path.join(dir, 'cert.pem');
  const ca = path.join(dir, 'ca.pem');
  assert.throws(() => collectEvidence('relative', cert, ca), /Absolute evidence paths/);
  assert.throws(() => collectEvidence(build, cert, ca), /Unexpected asset count/);
  fs.writeFileSync(path.join(build, 'assets', 'index-test.js'), 'test');
  fs.writeFileSync(path.join(build, 'assets', 'index-test.css'), 'body{}');
  fs.writeFileSync(path.join(build, 'unexpected.txt'), 'not reviewed');
  assert.throws(() => collectEvidence(build, cert, ca), /Unexpected build root contents/);
  fs.unlinkSync(path.join(build, 'unexpected.txt'));
  assert.throws(() => collectEvidence(build, cert, ca), /HTML asset references mismatch/);
});
