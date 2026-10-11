'use strict';

// Read-only evidence collection. No network, DB, listener, trust or source writes.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash, X509Certificate } = require('node:crypto');

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

function readRegular(filename) {
  const stat = fs.lstatSync(filename);
  assert.ok(stat.isFile() && !stat.isSymbolicLink(), 'Expected regular non-symlink file');
  return fs.readFileSync(filename);
}

function collectEvidence(buildDirectory, tlsDirectory) {
  assert.ok(path.isAbsolute(buildDirectory) && path.isAbsolute(tlsDirectory),
    'Absolute evidence paths required');
  assert.equal(fs.realpathSync(buildDirectory), buildDirectory, 'Build path not canonical');
  assert.equal(fs.realpathSync(tlsDirectory), tlsDirectory, 'TLS path not canonical');
  assert.ok(fs.lstatSync(buildDirectory).isDirectory() && !fs.lstatSync(buildDirectory).isSymbolicLink());
  assert.ok(fs.lstatSync(tlsDirectory).isDirectory() && !fs.lstatSync(tlsDirectory).isSymbolicLink());
  const assetsDirectory = path.join(buildDirectory, 'assets');
  assert.ok(fs.lstatSync(assetsDirectory).isDirectory() && !fs.lstatSync(assetsDirectory).isSymbolicLink());
  const rootEntries = fs.readdirSync(buildDirectory).sort();
  assert.deepEqual(rootEntries, ['assets', 'index.html'], 'Unexpected build root contents');
  const assets = fs.readdirSync(assetsDirectory).sort();
  assert.ok(assets.length >= 2 && assets.length <= 31, 'Unexpected asset count');
  const files = ['index.html', ...assets.map(name => 'assets/' + name)];
  const manifest = {};
  for (const name of files) {
    assert.ok(name === 'index.html' || /^assets\/[A-Za-z0-9_-][A-Za-z0-9._-]*\.(js|css)$/.test(name),
      'Unexpected asset name');
    manifest[name] = sha256(readRegular(path.join(buildDirectory, name)));
  }
  const html = readRegular(path.join(buildDirectory, 'index.html')).toString('utf8');
  assert.match(html, /<div id="root"><\/div>/, 'React root missing');
  const referenced = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+)"/g)].map(match => match[1]).sort();
  assert.deepEqual(referenced, assets.map(name => 'assets/' + name).sort(), 'HTML asset references mismatch');
  assert.ok(assets.some(name => name.endsWith('.js')) && assets.some(name => name.endsWith('.css')));
  const cert = new X509Certificate(readRegular(path.join(tlsDirectory, 'server.crt')));
  const ca = new X509Certificate(readRegular(path.join(tlsDirectory, 'ca.crt')));
  assert.equal(cert.checkIP('127.0.0.1'), '127.0.0.1', 'Loopback SAN required');
  assert.ok(ca.ca && !cert.ca && cert.checkIssued(ca) && cert.verify(ca.publicKey), 'CA chain invalid');
  assert.ok(Date.parse(ca.validTo) > Date.parse(cert.validTo), 'CA must outlive server certificate');
  return {
    buildManifest:manifest,
    tlsLeafFingerprint256:cert.fingerprint256,
    tlsLeafValidTo:cert.validTo,
    tlsCaValidTo:ca.validTo,
    tlsLeafSubject:cert.subject,
    verification:'READ_ONLY_EVIDENCE_NOT_RUNTIME_PROOF'
  };
}

if (require.main === module) {
  try {
    assert.equal(process.argv.length, 4, 'Usage: node stage6-original-evidence.cjs ABS_BUILD_DIR ABS_TLS_DIR');
    console.log(JSON.stringify(collectEvidence(process.argv[2], process.argv[3]), null, 2));
  } catch (error) {
    console.error('PREFLIGHT_EVIDENCE_FAILED:', error.message);
    process.exitCode = 1;
  }
}

module.exports = { collectEvidence };
