'use strict';
// Only the authenticated outer transaction owns commit/rollback.
class CaseCreateRepository {
  constructor(client) { this.client = client; }
  async receipt(actorId, operationId) {
    return (await this.client.query(`SELECT * FROM vip_clinical.operation_receipts
      WHERE actor_id=$1 AND operation_id=$2`, [actorId, operationId])).rows[0];
  }
  async patient(patientId) {
    return (await this.client.query('SELECT patient_id FROM public.patients WHERE patient_id=$1 FOR KEY SHARE', [patientId])).rows[0];
  }
  async create(caseId, patientId, problemSummary, actorId) {
    return (await this.client.query(`INSERT INTO vip_clinical.cases
      (case_id,patient_id,problem_summary,created_by,created_at,lifecycle,lifecycle_version)
      VALUES ($1,$2,$3,$4,clock_timestamp(),'OPEN',0)
      RETURNING case_id,patient_id,created_at`, [caseId, patientId, problemSummary, actorId])).rows[0];
  }
  async saveReceipt(actorId, operationId, fingerprint, result) {
    await this.client.query(`INSERT INTO vip_clinical.operation_receipts
      (actor_id,operation_id,operation_kind,schema_version,meaning_fingerprint,case_id,
       resulting_version,committed_result,recorded_at)
      VALUES ($1,$2,'CASE_CREATE',1,$3,$4,0,$5::jsonb,$6)`,
    [actorId, operationId, fingerprint, result.caseId, JSON.stringify(result), result.createdAt]);
  }
}
module.exports = { CaseCreateRepository };
