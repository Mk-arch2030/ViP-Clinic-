const test = require('node:test');
const assert = require('node:assert/strict');
const { AuthRepository } = require('./auth-repository');
const { AuthError } = require('../auth/errors');

function pool({ failCommit = false, failLock = false } = {}) {
  const queries = [];
  let released = 0;
  const client = { async query(sql, values) {
    queries.push({ sql, values });
    if ((failCommit && sql === 'COMMIT') || (failLock && sql.includes('pg_advisory'))) throw new Error('private postgres failure');
    return { rows: [] };
  }, release() { released++; } };
  return { pool: { connect: async () => client }, queries, released: () => released };
}

test('SQL transaction installs bounded timeouts and cross-process lock before executing work', async () => {
  const p = pool();
  const repository = new AuthRepository(p.pool);
  await repository.transaction(async tx => {
    assert.equal(p.queries.at(-1).sql, 'SELECT pg_advisory_xact_lock($1)');
    await tx.actor('synthetic-actor');
  });
  assert.equal(p.queries[0].sql, 'BEGIN');
  assert.equal(p.queries.at(-1).sql, 'COMMIT');
  assert.match(p.queries.find(q => q.sql.includes('FROM public.actors')).sql, /FOR SHARE/);
  assert.equal(p.released(), 1);
  assert.equal(repository.pending, 0);
});

test('work, lock and commit failures roll back and release exactly once', async () => {
  for (const options of [{}, { failCommit: true }, { failLock: true }]) {
    const p = pool(options);
    const repository = new AuthRepository(p.pool);
    await assert.rejects(repository.transaction(async () => { if (!options.failCommit && !options.failLock) throw new Error('secret work failure'); }),
      error => error.statusCode === 503 && !error.message.includes('secret'));
    assert.equal(p.queries.at(-1).sql, 'ROLLBACK');
    assert.equal(p.released(), 1);
    assert.equal(repository.pending, 0);
  }
});

test('explicit auth denial retains its generic boundary and rolls back', async () => {
  const p = pool();
  await assert.rejects(new AuthRepository(p.pool).transaction(async () => { throw new AuthError(401); }), error => error.statusCode === 401);
  assert.equal(p.queries.at(-1).sql, 'ROLLBACK');
});

test('transaction capacity rejects before acquiring another pool client', async () => {
  const p = pool();
  const repository = new AuthRepository(p.pool);
  repository.pending = 64;
  await assert.rejects(repository.transaction(async () => assert.fail()), error => error.statusCode === 503);
  assert.equal(p.queries.length, 0);
});
