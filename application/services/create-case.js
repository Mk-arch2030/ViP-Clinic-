'use strict';
const { randomUUID } = require('node:crypto');
const { AuthError } = require('../../backend/auth/errors');
const { requireUuid, fingerprintIntent } = require('../../backend/persistence/clinical-foundation');
const { CaseCreateRepository } = require('../../backend/persistence/case-create-repository');
function requestShape(body, fields) {
  if (!body || Object.getPrototypeOf(body) !== Object.prototype ||
      Object.keys(body).length !== fields.length || fields.some(k => !Object.hasOwn(body,k))) throw new AuthError(400);
  try { requireUuid(body.operationId); } catch { throw new AuthError(400); }
}
function committed(receipt, actorId, operationId) {
  const r = receipt.committed_result;
  try {
    requireUuid(r.caseId); requireUuid(r.patientId);
    if (receipt.actor_id !== actorId || receipt.operation_id !== operationId ||
        receipt.operation_kind !== 'CASE_CREATE' || receipt.schema_version !== 1 ||
        receipt.case_id !== r.caseId || receipt.resulting_version !== 0 ||
        receipt.event_id !== null || receipt.visit_id !== null ||
        !/^[0-9a-f]{64}$/.test(receipt.meaning_fingerprint) ||
        r.lifecycle !== 'OPEN' || r.lifecycleVersion !== 0 ||
        typeof r.createdAt !== 'string' || new Date(r.createdAt).toISOString() !== r.createdAt) throw new Error();
  } catch { throw new AuthError(503); }
  return { status: 'COMMITTED', result: structuredClone(r) };
}
function createCaseService(auth) {
  return Object.freeze({
    create({ token, csrf }, body) {
      return auth.withAuthorized(token, 'CASE_CREATE', csrf, async ({ actor, client }) => {
        requestShape(body, ['operationId','patientId','problemSummary']);
        let fingerprint;
        try {
          if (typeof body.problemSummary !== 'string' || body.problemSummary.length > 4000 || body.problemSummary.includes('\u0000')) throw new Error();
          fingerprint = fingerprintIntent('CASE_CREATE', { patientId: body.patientId, problemSummary: body.problemSummary });
        } catch { throw new AuthError(400); }
        const actorId = actor.actorIdentityReference;
        const repo = new CaseCreateRepository(client);
        const receipt = await repo.receipt(actorId, body.operationId);
        if (receipt) {
          if (receipt.operation_kind !== 'CASE_CREATE' || receipt.meaning_fingerprint !== fingerprint) throw new AuthError(409);
          return committed(receipt, actorId, body.operationId);
        }
        if (!await repo.patient(body.patientId)) throw new AuthError(404);
        const row = await repo.create(randomUUID(), body.patientId, body.problemSummary, actorId);
        const result = { caseId: row.case_id, patientId: row.patient_id, lifecycle: 'OPEN', lifecycleVersion: 0,
          createdAt: new Date(row.created_at).toISOString() };
        await repo.saveReceipt(actorId, body.operationId, fingerprint, result);
        return { status: 'COMMITTED', result };
      });
    },
    recover({ token, csrf }, body) {
      return auth.withAuthorized(token, 'CASE_RECEIPT_READ', csrf, async ({ actor, client }) => {
        requestShape(body, ['operationId']);
        const actorId = actor.actorIdentityReference;
        const receipt = await new CaseCreateRepository(client).receipt(actorId, body.operationId);
        if (!receipt) return { status: 'UNKNOWN' };
        if (receipt.operation_kind !== 'CASE_CREATE') throw new AuthError(409);
        return committed(receipt, actorId, body.operationId);
      });
    }
  });
}
module.exports = { createCaseService };
