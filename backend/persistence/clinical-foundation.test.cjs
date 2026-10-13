'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fingerprintIntent, validateLifecycleHistory, reconcileReceipt } = require('./clinical-foundation');
const { ClinicalReadRepository } = require('./clinical-read-repository');
const { policyDate } = require('../../domain/case-policy-b.cjs');
const id = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const created = '2026-01-01T08:00:00.000Z';
function fact(version, at) {
  const complete = version % 2 === 1;
  return { event_id: id(version + 10), case_id: id(1), doctor_id: id(2),
    event_type: complete ? 'COMPLETED' : 'REOPENED', occurred_at: at,
    policy_timezone: 'Africa/Cairo', policy_date: policyDate(at), policy_version: 'POLICY_B_V2',
    from_lifecycle: complete ? 'OPEN' : 'COMPLETED', to_lifecycle: complete ? 'COMPLETED' : 'OPEN',
    resulting_version: version, previous_version: version === 1 ? null : version - 1,
    completion_event_id: complete ? null : id(version + 9),
    same_complaint_confirmed: complete ? null : true, operation_id: id(version + 100), meaning_fingerprint: 'a'.repeat(64) };
}
function current(facts) {
  return { case_id: id(1), created_at: created, lifecycle: facts.at(-1)?.to_lifecycle ?? 'OPEN',
    lifecycle_version: facts.length, latest_event_id: facts.at(-1)?.event_id ?? null };
}
test('zero-Visit administrative Case has OPEN lifecycle and no fabricated encounter', () => {
  assert.deepEqual(validateLifecycleHistory(current([]), []), {
    lifecycle: 'OPEN', version: 0, completionEventId: null, completedAt: null });
});
test('repeated cycles preserve all seals and choose latest unmatched completion', () => {
  const facts = [fact(1, created), fact(2, created), fact(3, '2026-09-01T08:00:00.000Z')];
  const before = structuredClone(facts);
  assert.equal(validateLifecycleHistory(current(facts), facts).completionEventId, id(13));
  assert.deepEqual(facts, before);
});
for (const [day, eligible] of [[0,true],[89,true],[90,true],[91,false]]) {
  test(`persisted reopening episode Day ${day}: ${eligible ? 'valid' : 'denied'}`, () => {
    const facts = [fact(1, created), fact(2, new Date(Date.parse(created) + day * 86400000).toISOString())];
    if (eligible) assert.equal(validateLifecycleHistory(current(facts), facts).lifecycle, 'OPEN');
    else assert.throws(() => validateLifecycleHistory(current(facts), facts), /Invalid reopening/);
  });
}
for (const [label, mutate] of [
  ['missing seal', f => f.shift()],
  ['wrong Case', f => { f[1].case_id = id(8); }],
  ['wrong episode', f => { f[1].completion_event_id = id(99); }],
  ['missing Doctor', f => { f[0].doctor_id = null; }],
  ['missing timestamp', f => { f[0].occurred_at = null; }],
  ['wrong Cairo date', f => { f[0].policy_date = '2025-12-31'; }],
  ['missing confirmation', f => { f[1].same_complaint_confirmed = false; }],
  ['reused operation', f => { f[1].operation_id = f[0].operation_id; }],
  ['reversed chronology', f => { f[1].occurred_at = '2025-12-31T08:00:00.000Z'; }],
  ['broken version', f => { f[1].previous_version = null; }],
]) test(`contradictory evidence fails closed: ${label}`, () => {
  const facts = [fact(1, created), fact(2, created)];
  const row = current(facts);
  mutate(facts);
  assert.throws(() => validateLifecycleHistory(row, facts));
});
test('older convenient episode cannot be reused after second completion', () => {
  const facts = [fact(1, created), fact(2, created), fact(3, created), fact(4, created)];
  facts[3].completion_event_id = facts[0].event_id;
  assert.throws(() => validateLifecycleHistory(current(facts), facts));
});
test('current lifecycle must agree with intact seals', () => {
  const facts = [fact(1, created)];
  assert.throws(() => validateLifecycleHistory({ ...current(facts), lifecycle: 'OPEN' }, facts));
});
test('canonical intent ignores property order but never changed clinical meaning', () => {
  const a = fingerprintIntent('CASE_CREATE', { patientId: id(1), problemSummary: 'Problem A' });
  assert.equal(a, fingerprintIntent('CASE_CREATE', { problemSummary: 'Problem A', patientId: id(1) }));
  assert.notEqual(a, fingerprintIntent('CASE_CREATE', { patientId: id(1), problemSummary: 'Problem B' }));
  assert.throws(() => fingerprintIntent('CASE_CREATE', { patientId: id(1), problemSummary: 'A', actor: id(2) }));
  assert.throws(() => fingerprintIntent('CASE_COMPLETE', {}));
});
test('reopen meaning binds ownership, lifecycle precondition and explicit confirmation', () => {
  const request = { patientId: id(1), caseId: id(2), expectedVersion: 1, sameComplaintConfirmed: true };
  const hash = fingerprintIntent('CASE_REOPEN', request);
  assert.notEqual(hash, fingerprintIntent('CASE_REOPEN', { ...request, expectedVersion: 3 }));
  assert.throws(() => fingerprintIntent('CASE_REOPEN', { ...request, sameComplaintConfirmed: false }));
  assert.throws(() => fingerprintIntent('CASE_REOPEN', { ...request, expectedVersion: NaN }));
});
test('durable replay returns original outcome; receipt absence remains UNKNOWN', () => {
  const meaning = { actorId: id(1), operationId: id(2), operationKind: 'CASE_CREATE', fingerprint: 'a'.repeat(64) };
  const receipt = { actor_id: id(1), operation_id: id(2), operation_kind: 'CASE_CREATE',
    schema_version: 1, meaning_fingerprint: meaning.fingerprint, committed_result: { caseId: id(3), version: 0 } };
  assert.equal(reconcileReceipt(null, meaning).status, 'UNKNOWN');
  const replay = reconcileReceipt(receipt, meaning);
  replay.result.version = 99;
  assert.equal(receipt.committed_result.version, 0);
  assert.equal(reconcileReceipt(receipt, meaning).result.version, 0);
  for (const changed of [{ actorId: id(8) }, { operationId: id(8) }, { fingerprint: 'b'.repeat(64) }, { operationKind: 'CASE_REOPEN' }]) {
    assert.throws(() => reconcileReceipt(receipt, { ...meaning, ...changed }), /conflict/);
  }
});
test('read adapter binds ownership and stable chronology without opening or committing a transaction', async () => {
  const calls = [];
  const repo = new ClinicalReadRepository({ query: async (sql, values) => {
    calls.push({ sql, values }); return { rows: [{ created_at: new Date(created) }] };
  } });
  assert.equal((await repo.casesForPatient(id(1)))[0].created_at, created);
  await repo.visitsForPatient(id(1));
  await repo.factsForCase(id(1), id(2));
  await repo.receiptForActor(id(2), id(3));
  assert.match(calls[1].sql, /c.patient_id=\$1 ORDER BY v.recorded_at, v.visit_id/);
  assert.deepEqual(calls[2].values, [id(1), id(2)]);
  assert.match(calls[3].sql, /actor_id=\$1 AND operation_id=\$2/);
  assert.ok(calls.every(call => /^SELECT/.test(call.sql)));
  await assert.rejects(repo.casesForPatient("'; DROP TABLE patients; --"));
  assert.equal(calls.length, 4);
});
