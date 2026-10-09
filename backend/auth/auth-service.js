'use strict';

const { randomBytes, createHash, timingSafeEqual } = require('node:crypto');
const { AuthError } = require('./errors');
const { normalizePassword, parseVerifier, verifyPassword } = require('./password-verifier');
const { resolveActor, authorize } = require('./authorization');
const IDLE_MS = 15 * 60 * 1000;
const ABSOLUTE_MS = 8 * 60 * 60 * 1000;

function label(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9/_-]{3,64}$/.test(value)) throw new AuthError(400);
  return value.toUpperCase();
}
const digest = value => createHash('sha256').update(value).digest('hex');
function tokenDigest(token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token) ||
      Buffer.from(token, 'base64url').toString('base64url') !== token) throw new AuthError(401);
  return digest(token);
}
function checkCsrf(actual, expected) {
  if (typeof actual !== 'string' || typeof expected !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(actual) ||
      actual.length !== expected.length || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) throw new AuthError(403);
}

function createAuthService({ store, dummyVerifier, verify = verifyPassword, clock = Date.now }) {
  if (!store?.transaction || typeof verify !== 'function') throw new AuthError(503);
  parseVerifier(dummyVerifier);
  async function transaction(work) {
    try { return await store.transaction(work); }
    catch (error) { if (error instanceof AuthError) throw error; throw new AuthError(503); }
  }
  async function validate(tx, token, now) {
    const session = await tx.session(tokenDigest(token));
    if (!session || session.revoked_at !== null || now >= session.idle_deadline || now >= session.absolute_deadline ||
        ![session.issued_at, session.last_seen_at, session.idle_deadline, session.absolute_deadline].every(Number.isSafeInteger) ||
        session.last_seen_at < session.issued_at || session.idle_deadline > session.absolute_deadline ||
        now < session.last_seen_at || !Number.isSafeInteger(session.credential_version) || session.credential_version < 1) throw new AuthError(401);
    const row = await tx.actor(session.actor_id);
    const actor = resolveActor(row);
    const credential = await tx.credentialByActor(session.actor_id);
    if (!credential || credential.enabled !== true || credential.version !== session.credential_version) throw new AuthError(401);
    return { session, actor };
  }
  return Object.freeze({
    async login({ loginLabel, password, source, priorToken }) {
      const canonical = label(loginLabel);
      normalizePassword(password);
      if (typeof source !== 'string' || !source || source.length > 128) throw new AuthError(400);
      const candidate = await transaction(async tx => {
        const now = clock();
        // Reservations count attempts, including concurrent attempts, before crypto work.
        await tx.reserveAttempt('SOURCE:' + digest(source), 20, now);
        await tx.reserveAttempt('LABEL:' + digest(canonical), 5, now);
        return tx.credentialByLabel(canonical);
      });
      let matched;
      try { matched = await verify(password, candidate?.verifier ?? dummyVerifier); }
      catch (error) { if (error instanceof AuthError) throw error; throw new AuthError(503); }
      if (!matched || !candidate) throw new AuthError(401);
      return transaction(async tx => {
        const now = clock();
        const current = await tx.credentialByActor(candidate.actor_id);
        const actor = resolveActor(await tx.actor(candidate.actor_id));
        if (!current || current.enabled !== true || current.version !== candidate.version || current.verifier !== candidate.verifier) throw new AuthError(401);
        if (priorToken !== undefined) {
          const old = await validate(tx, priorToken, now);
          if (old.actor.actorIdentityReference !== actor.actorIdentityReference) throw new AuthError(401);
          await tx.revokeSession(old.session.digest, now);
        }
        const live = await tx.liveSessions(candidate.actor_id, now);
        while (live.length >= 3) await tx.revokeSession(live.shift().digest, now);
        const token = randomBytes(32).toString('base64url');
        const csrf = randomBytes(32).toString('base64url');
        const session = { digest: tokenDigest(token), actor_id: candidate.actor_id, credential_version: current.version,
          csrf, issued_at: now, last_seen_at: now, idle_deadline: now + IDLE_MS, absolute_deadline: now + ABSOLUTE_MS, revoked_at: null };
        await tx.insertSession(session);
        await tx.clearAttempt('LABEL:' + digest(canonical));
        return { token, expires: session.absolute_deadline };
      });
    },
    async current(token) {
      return transaction(async tx => {
        const now = clock();
        const { session, actor } = await validate(tx, token, now);
        await tx.touchSession(session.digest, now, Math.min(now + IDLE_MS, session.absolute_deadline));
        return { actorIdentityReference: actor.actorIdentityReference, role: actor.role, lifecycle: actor.lifecycle, csrf: session.csrf };
      });
    },
    async logout(token, csrf) {
      return transaction(async tx => {
        const { session } = await validate(tx, token, clock());
        checkCsrf(csrf, session.csrf);
        await tx.revokeSession(session.digest, clock());
      });
    },
    async withAuthorized(token, operation, csrf, work) {
      return transaction(async tx => {
        const now = clock();
        const { session, actor } = await validate(tx, token, now);
        if (operation !== 'PATIENT_RETRIEVE') checkCsrf(csrf, session.csrf);
        authorize(actor, operation, await tx.authorization(actor.actorIdentityReference));
        // Work uses tx.client; auth and business writes commit or roll back together.
        const result = await work({ actor, client: tx.client });
        await tx.touchSession(session.digest, now, Math.min(now + IDLE_MS, session.absolute_deadline));
        return result;
      });
    }
  });
}

module.exports = { createAuthService, tokenDigest, label, checkCsrf, IDLE_MS, ABSOLUTE_MS };
