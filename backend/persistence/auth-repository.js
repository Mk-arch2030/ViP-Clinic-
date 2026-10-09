'use strict';

const { AuthError } = require('../auth/errors');
const LOCK_ID = 76551005;

function sessionRow(row) {
  if (!row) return null;
  return { ...row, issued_at: Number(row.issued_at), last_seen_at: Number(row.last_seen_at),
    idle_deadline: Number(row.idle_deadline), absolute_deadline: Number(row.absolute_deadline),
    revoked_at: row.revoked_at === null ? null : Number(row.revoked_at) };
}

class AuthRepository {
  constructor(pool) {
    if (!pool?.connect) throw new AuthError(503);
    this.pool = pool;
    this.pending = 0;
  }
  async transaction(work) {
    if (this.pending >= 64) throw new AuthError(503);
    this.pending++;
    let client;
    try {
      client = await this.pool.connect();
      await client.query('BEGIN');
      await client.query("SET LOCAL search_path = pg_catalog, public");
      await client.query("SET LOCAL lock_timeout = '5s'");
      await client.query("SET LOCAL statement_timeout = '10s'");
      await client.query("SET LOCAL idle_in_transaction_session_timeout = '15s'");
      // Conservative first implementation: serialize auth decisions across processes.
      await client.query('SELECT pg_advisory_xact_lock($1)', [LOCK_ID]);
      const tx = this.context(client);
      const result = await work(tx);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      if (client) try { await client.query('ROLLBACK'); } catch {}
      if (error instanceof AuthError) throw error;
      throw new AuthError(503);
    } finally {
      client?.release();
      this.pending--;
    }
  }
  context(client) {
    const one = async (sql, values) => (await client.query(sql, values)).rows[0] ?? null;
    return {
      client,
      actor: id => one('SELECT actor_id, actor_role, lifecycle_state FROM public.actors WHERE actor_id=$1 FOR SHARE', [id]),
      credentialByLabel: label => one('SELECT * FROM vip_auth.credentials WHERE login_label=$1 FOR SHARE', [label]),
      credentialByActor: id => one('SELECT * FROM vip_auth.credentials WHERE actor_id=$1 FOR SHARE', [id]),
      session: async digest => sessionRow(await one('SELECT * FROM vip_auth.sessions WHERE digest=$1 FOR UPDATE', [digest])),
      liveSessions: async (id, now) => (await client.query(`SELECT * FROM vip_auth.sessions WHERE actor_id=$1
        AND revoked_at IS NULL AND idle_deadline>$2 AND absolute_deadline>$2 ORDER BY issued_at,digest FOR UPDATE`, [id, now])).rows.map(sessionRow),
      insertSession: s => client.query(`INSERT INTO vip_auth.sessions
        (digest,actor_id,credential_version,csrf,issued_at,last_seen_at,idle_deadline,absolute_deadline,revoked_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [s.digest,s.actor_id,s.credential_version,s.csrf,s.issued_at,s.last_seen_at,s.idle_deadline,s.absolute_deadline,s.revoked_at]),
      revokeSession: (digest, now) => client.query('UPDATE vip_auth.sessions SET revoked_at=$2 WHERE digest=$1 AND revoked_at IS NULL', [digest, now]),
      touchSession: (digest, now, deadline) => client.query('UPDATE vip_auth.sessions SET last_seen_at=$2,idle_deadline=$3 WHERE digest=$1', [digest, now, deadline]),
      authorization: async id => {
        const state = await one('SELECT mode FROM vip_auth.operating_mode WHERE singleton=true FOR SHARE', []);
        const delegation = await one('SELECT * FROM vip_auth.delegations WHERE nurse_id=$1 FOR SHARE', [id]);
        const grantor = delegation ? await one('SELECT * FROM public.actors WHERE actor_id=$1 FOR SHARE', [delegation.doctor_id]) : null;
        return { mode: state?.mode, delegation, grantor };
      },
      reserveAttempt: async (key, limit, now) => {
        await client.query('DELETE FROM vip_auth.login_attempts WHERE expires_at<=$1', [now]);
        const counter = await one('SELECT * FROM vip_auth.login_attempts WHERE key=$1 FOR UPDATE', [key]);
        if (counter?.count >= limit) throw new AuthError(429);
        if (!counter) {
          const size = await one('SELECT count(*)::integer AS count FROM vip_auth.login_attempts', []);
          if (size.count >= 5000) throw new AuthError(503);
          await client.query('INSERT INTO vip_auth.login_attempts VALUES ($1,1,$2)', [key, now + 15 * 60 * 1000]);
        } else await client.query('UPDATE vip_auth.login_attempts SET count=count+1 WHERE key=$1', [key]);
      },
      clearAttempt: key => client.query('DELETE FROM vip_auth.login_attempts WHERE key=$1', [key])
    };
  }
  // Internal controlled provisioning primitive; no public reset/enrollment route.
  // Caller authorization/recovery remains a separate real-enrollment gate.
  async replaceCredential(actorId, verifier, now = Date.now()) {
    require('../auth/password-verifier').parseVerifier(verifier);
    return this.transaction(async tx => {
      const row = await tx.credentialByActor(actorId);
      if (!row) throw new AuthError(401);
      await tx.client.query('UPDATE vip_auth.credentials SET verifier=$2,version=version+1,updated_at=CURRENT_TIMESTAMP WHERE actor_id=$1', [actorId, verifier]);
      await tx.client.query('UPDATE vip_auth.sessions SET revoked_at=$2 WHERE actor_id=$1 AND revoked_at IS NULL', [actorId, now]);
    });
  }
}

module.exports = { AuthRepository, LOCK_ID, sessionRow };
