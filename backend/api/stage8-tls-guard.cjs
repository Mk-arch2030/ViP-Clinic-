'use strict';

// Stage 8 acceptance-only TLS identity guard.
// Does not modify historical Stage 6 certificates or runtime.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const tls = require('node:tls');
const { X509Certificate } = crypto;

const EXPECTED_FINGERPRINT =
  '83:F9:F4:8A:A8:4E:7C:A4:53:31:AB:12:BC:51:80:B9:' +
  'FC:CA:E1:3D:28:8F:81:3C:FC:FA:AA:5E:7B:C2:A7:69';

function verifyStage8Tls(directory) {
  assert.equal(typeof directory, 'string');
  assert.ok(path.isAbsolute(directory));

  const info = fs.lstatSync(directory);
  assert.ok(info.isDirectory());
  assert.ok(!info.isSymbolicLink());
  assert.equal(fs.realpathSync(directory), directory);

  // Owner-only acceptance TLS directory.
  assert.equal(info.uid, process.getuid());
  assert.equal(info.mode & 0o777, 0o700);

  function read(name) {
    const filename = path.join(directory, name);
    const stat = fs.lstatSync(filename);

    assert.ok(stat.isFile());
    assert.ok(!stat.isSymbolicLink());
    assert.equal(fs.realpathSync(filename), filename);

    assert.equal(stat.uid, process.getuid());

    if (name === 'server.key.pem') {
      assert.equal(stat.mode & 0o777, 0o600);
    } else {
      assert.equal(stat.mode & 0o022, 0);
    }

    return fs.readFileSync(filename);
  }

  const cert = read('server.cert.pem');
  const key = read('server.key.pem');
  const ca = read('ca.cert.pem');

  const server = new X509Certificate(cert);
  const authority = new X509Certificate(ca);

  assert.equal(server.fingerprint256, EXPECTED_FINGERPRINT);
  assert.equal(server.ca, false);
  assert.equal(authority.ca, true);

  assert.equal(server.checkIP('127.0.0.1'), '127.0.0.1');
  assert.ok(server.verify(authority.publicKey));

  const now = Date.now();
  assert.ok(Date.parse(server.validFrom) <= now);
  assert.ok(Date.parse(server.validTo) > now);
  assert.ok(Date.parse(authority.validFrom) <= now);
  assert.ok(Date.parse(authority.validTo) > now);

  const privateKey = crypto.createPrivateKey(key);
  const derivedPublic = crypto.createPublicKey(privateKey)
    .export({ type: 'spki', format: 'der' });
  const certificatePublic = server.publicKey
    .export({ type: 'spki', format: 'der' });

  assert.ok(crypto.timingSafeEqual(
    derivedPublic,
    certificatePublic
  ));

  const context = tls.createSecureContext({
    key,
    cert,
    ca,
    minVersion: 'TLSv1.2'
  });

  assert.ok(context.context);

  return Object.freeze({
    key,
    cert,
    ca,
    minVersion: 'TLSv1.2'
  });
}

module.exports = {
  EXPECTED_FINGERPRINT,
  verifyStage8Tls
};
