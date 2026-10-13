'use strict';

const { requireUuid } = require('./clinical-foundation');
function normalize(row) {
  if (!row) return row;
  return Object.fromEntries(Object.entries(row).map(([key, value]) =>
    [key, value instanceof Date ? value.toISOString() : value]));
}

// Internal read boundary only. No pool fallback, transaction ownership, API or
// authorization shortcut. Caller passes its authenticated transaction client.
class ClinicalReadRepository {
  constructor(client) {
    if (!client || typeof client.query !== 'function') throw new Error('Transaction client required');
    this.client = client;
  }
  async casesForPatient(patientId) {
    requireUuid(patientId);
    return (await this.client.query(`SELECT case_id, patient_id, problem_summary,
      created_by, created_at, lifecycle, lifecycle_version, latest_event_id
      FROM vip_clinical.cases WHERE patient_id=$1 ORDER BY created_at, case_id`, [patientId])).rows.map(normalize);
  }
  async visitsForPatient(patientId) {
    requireUuid(patientId);
    return (await this.client.query(`SELECT v.* FROM vip_clinical.visits v
      JOIN vip_clinical.cases c ON c.case_id=v.case_id
      WHERE c.patient_id=$1 ORDER BY v.recorded_at, v.visit_id`, [patientId])).rows.map(normalize);
  }
  async factsForCase(patientId, caseId) {
    requireUuid(patientId);
    requireUuid(caseId);
    return (await this.client.query(`SELECT f.*, f.policy_date::text AS policy_date FROM vip_clinical.lifecycle_facts f
      JOIN vip_clinical.cases c ON c.case_id=f.case_id
      WHERE c.patient_id=$1 AND c.case_id=$2 ORDER BY f.resulting_version, f.event_id`, [patientId, caseId])).rows.map(normalize);
  }
  async receiptForActor(actorId, operationId) {
    requireUuid(actorId);
    requireUuid(operationId);
    return (await this.client.query(`SELECT * FROM vip_clinical.operation_receipts
      WHERE actor_id=$1 AND operation_id=$2`, [actorId, operationId])).rows[0] ?? null;
  }
}

module.exports = { ClinicalReadRepository };
