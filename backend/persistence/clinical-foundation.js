'use strict';

const { createHash } = require('node:crypto');
const { policyDate, reopeningCalendarWindow } = require('../../domain/case-policy-b.cjs');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
function requireUuid(value) {
  if (typeof value !== 'string' || !UUID.test(value)) throw new Error('Invalid technical identity');
  return value;
}
function requireVersion(value) {
  if (!Number.isSafeInteger(value) || value < 0 || value > 2147483647) throw new Error('Invalid lifecycle version');
  return value;
}

// Bounded, versioned canonical meaning; no client actor, timestamp or role accepted.
// These primitives grant no authority and execute no clinical commands.
function fingerprintIntent(kind, request) {
  const fields = {
    CASE_CREATE: ['patientId', 'problemSummary'],
    CASE_REOPEN: ['patientId', 'caseId', 'expectedVersion', 'sameComplaintConfirmed'],
  }[kind];
  if (!fields || !request || Object.getPrototypeOf(request) !== Object.prototype ||
      Object.keys(request).length !== fields.length || fields.some(key => !Object.hasOwn(request, key))) {
    throw new Error('Invalid clinical intent');
  }
  requireUuid(request.patientId);
  if (kind === 'CASE_CREATE') {
    if (typeof request.problemSummary !== 'string' || !request.problemSummary.trim()) throw new Error('Clinical problem required');
  } else {
    requireUuid(request.caseId);
    requireVersion(request.expectedVersion);
    if (request.sameComplaintConfirmed !== true) throw new Error('Doctor confirmation required');
  }
  return createHash('sha256').update(JSON.stringify([
    'VIP_CLINICAL_INTENT_V1', 'POLICY_B_V2', kind, fields.map(key => [key, request[key]])
  ])).digest('hex');
}

// Validate persisted evidence read through the trusted transaction. The caller
// must independently authenticate, authorize, lock, and obtain fresh server time.
// This is structural integrity validation, NOT proof that a supplied actor is a Doctor.
function validateLifecycleHistory(caseRow, facts) {
  requireUuid(caseRow.case_id);
  requireVersion(caseRow.lifecycle_version);
  if (!Array.isArray(facts) || facts.length !== caseRow.lifecycle_version) throw new Error('Incomplete lifecycle history');
  let state = 'OPEN';
  let previousAt = caseRow.created_at;
  policyDate(previousAt);
  let completion = null;
  let latest = null;
  const identities = new Set();
  const operations = new Set();
  for (let i = 0; i < facts.length; i++) {
    const fact = facts[i];
    requireUuid(fact.event_id);
    requireUuid(fact.doctor_id);
    requireUuid(fact.operation_id);
    const operationKey = `${fact.doctor_id}:${fact.operation_id}`;
    if (identities.has(fact.event_id) || operations.has(operationKey) || fact.case_id !== caseRow.case_id ||
        fact.resulting_version !== i + 1 || fact.previous_version !== (i === 0 ? null : i) ||
        fact.policy_version !== 'POLICY_B_V2' || fact.policy_timezone !== 'Africa/Cairo' ||
        fact.policy_date !== policyDate(fact.occurred_at) || Date.parse(fact.occurred_at) < Date.parse(previousAt) ||
        !/^[0-9a-f]{64}$/.test(fact.meaning_fingerprint) || fact.from_lifecycle !== state) {
      throw new Error('Contradictory lifecycle history');
    }
    if (state === 'OPEN') {
      if (fact.event_type !== 'COMPLETED' || fact.to_lifecycle !== 'COMPLETED' ||
          fact.completion_event_id !== null || fact.same_complaint_confirmed !== null) throw new Error('Invalid completion fact');
      completion = fact;
      state = 'COMPLETED';
    } else {
      if (fact.event_type !== 'REOPENED' || fact.to_lifecycle !== 'OPEN' || !completion ||
          fact.completion_event_id !== completion.event_id || fact.same_complaint_confirmed !== true ||
          !reopeningCalendarWindow(completion.occurred_at, fact.occurred_at).eligible) throw new Error('Invalid reopening fact');
      completion = null;
      state = 'OPEN';
    }
    identities.add(fact.event_id);
    operations.add(operationKey);
    previousAt = fact.occurred_at;
    latest = fact.event_id;
  }
  if (caseRow.lifecycle !== state || caseRow.latest_event_id !== latest) throw new Error('Case and history disagree');
  return Object.freeze({ lifecycle: state, version: facts.length,
    completionEventId: completion?.event_id ?? null, completedAt: completion?.occurred_at ?? null });
}

function reconcileReceipt(receipt, { actorId, operationId, operationKind, fingerprint }) {
  requireUuid(actorId);
  requireUuid(operationId);
  // Absence is UNKNOWN, never a rollback certificate or a new-operation instruction.
  if (!receipt) return Object.freeze({ status: 'UNKNOWN' });
  if (receipt.actor_id !== actorId || receipt.operation_id !== operationId ||
      receipt.operation_kind !== operationKind || receipt.schema_version !== 1 ||
      receipt.meaning_fingerprint !== fingerprint) throw new Error('Operation identity conflict');
  return Object.freeze({ status: 'COMMITTED', result: structuredClone(receipt.committed_result) });
}

module.exports = { requireUuid, fingerprintIntent, validateLifecycleHistory, reconcileReceipt };
