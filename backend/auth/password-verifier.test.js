const test = require('node:test');
const assert = require('node:assert/strict');
const { createVerifier, verifyPassword, normalizePassword, parseVerifier, createDerivationQueue, PROFILE } = require('./password-verifier');
const denied = status => error => error.statusCode === status;

test('password bounds and Unicode are checked before expensive work', () => {
  for (const value of [null, 12, '', 'too short', 'a'.repeat(129), '\ud800'.repeat(15), '\udc00'.repeat(15)]) assert.throws(() => normalizePassword(value), denied(400));
  assert.equal(normalizePassword('  long synthetic password  '), '  long synthetic password  ');
  assert.equal(normalizePassword('cafe\u0301 synthetic password'), 'café synthetic password');
});

test('unknown formats, parameters and noncanonical encodings reject before derivation', () => {
  for (const value of [null, '', 'x'.repeat(10000), 'scrypt$1$2', 'vip-scrypt-v2$' + 'a'.repeat(22) + '$' + 'a'.repeat(43),
    'vip-scrypt-v1$' + 'a'.repeat(22) + '$' + 'a'.repeat(43)]) assert.throws(() => parseVerifier(value), denied(503));
  assert.equal(Object.isFrozen(PROFILE), true);
});

test('queue serializes work and rejects overflow without running rejected jobs', async () => {
  const releases = [];
  let calls = 0;
  const queue = createDerivationQueue(() => { calls++; return new Promise(resolve => releases.push(resolve)); }, { maxWaiting: 1 });
  const first = queue('one', 'salt');
  await new Promise(resolve => setImmediate(resolve));
  const second = queue('two', 'salt');
  await assert.rejects(queue('overflow', 'salt'), denied(503));
  assert.equal(calls, 1);
  releases.shift()('first');
  assert.equal(await first, 'first');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 2);
  releases.shift()('second');
  assert.equal(await second, 'second');
});

test('queue timeout removes a waiting job; failed derivation does not poison the queue', async () => {
  let finish;
  const queue = createDerivationQueue(() => new Promise(resolve => { finish = resolve; }), { waitMs: 10 });
  const active = queue('one', 'salt');
  await new Promise(resolve => setImmediate(resolve));
  await assert.rejects(queue('wait', 'salt'), denied(503));
  finish('done');
  await active;
  const failing = createDerivationQueue(async () => { throw new Error('sensitive error'); });
  await assert.rejects(failing('one', 'salt'), error => error.statusCode === 503 && !error.message.includes('sensitive'));
  await assert.rejects(failing('two', 'salt'), denied(503));
});

test('real approved scrypt cost rejects a wrong password and preserves NFC and whitespace semantics', async () => {
  const password = 'café synthetic password';
  const verifier = await createVerifier(password);
  assert.equal(verifier.length, 80);
  assert.equal(verifier.includes(password), false);
  assert.equal(await verifyPassword('wrong synthetic password', verifier), false);
  assert.equal(await verifyPassword('cafe\u0301 synthetic password', verifier), true);
  assert.equal(await verifyPassword(' café synthetic password', verifier), false);
  assert.notEqual(await createVerifier(password), verifier);
});
