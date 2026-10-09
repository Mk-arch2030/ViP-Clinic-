'use strict';

const { scrypt, randomBytes, timingSafeEqual } = require('node:crypto');
const { AuthError } = require('./errors');
const PROFILE = Object.freeze({ N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
const PREFIX = 'vip-scrypt-v1';

function normalizePassword(value) {
  if (typeof value !== 'string' || value.length > 1024 ||
      Buffer.byteLength(value, 'utf8') > 1024 || /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(value)) {
    throw new AuthError(400);
  }
  const normalized = value.normalize('NFC');
  const length = Array.from(normalized).length;
  if (length < 15 || length > 128 || Buffer.byteLength(normalized, 'utf8') > 1024) throw new AuthError(400);
  return normalized;
}

function decode(value, bytes) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) throw new AuthError(503);
  const result = Buffer.from(value, 'base64url');
  if (result.length !== bytes || result.toString('base64url') !== value) throw new AuthError(503);
  return result;
}

function parseVerifier(value) {
  if (typeof value !== 'string' || value.length !== 80) throw new AuthError(503);
  const fields = value.split('$');
  if (fields.length !== 3 || fields[0] !== PREFIX) throw new AuthError(503);
  return { salt: decode(fields[1], 16), key: decode(fields[2], 32) };
}

// One process-wide derivation, at most eight waiting jobs; no caller-supplied cost.
function createDerivationQueue(derive, { maxWaiting = 8, waitMs = 5000 } = {}) {
  let active = false;
  const waiting = [];
  function start(job) {
    active = true;
    clearTimeout(job.timer);
    Promise.resolve().then(job.task).then(job.resolve, () => job.reject(new AuthError(503))).finally(() => {
      const next = waiting.shift();
      if (next) start(next); else active = false;
    });
  }
  return (password, salt) => new Promise((resolve, reject) => {
    const job = { resolve, reject, task: () => derive(password, salt) };
    if (!active) return start(job);
    if (waiting.length >= maxWaiting) return reject(new AuthError(503));
    job.timer = setTimeout(() => {
      const index = waiting.indexOf(job);
      if (index !== -1) waiting.splice(index, 1);
      reject(new AuthError(503));
    }, waitMs);
    waiting.push(job);
  });
}

const derive = createDerivationQueue((password, salt) => new Promise((resolve, reject) => {
  scrypt(password, salt, 32, PROFILE, (error, key) => error ? reject(error) : resolve(key));
}));

async function createVerifier(password) {
  const normalized = normalizePassword(password);
  const salt = randomBytes(16);
  const key = await derive(normalized, salt);
  return `${PREFIX}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

async function verifyPassword(password, verifier) {
  const normalized = normalizePassword(password);
  const { salt, key } = parseVerifier(verifier);
  const actual = await derive(normalized, salt);
  return timingSafeEqual(actual, key);
}

module.exports = { PROFILE, normalizePassword, parseVerifier, createVerifier, verifyPassword, createDerivationQueue };
