'use strict';
const { randomUUID } = require('node:crypto');
const { PatientRepository } = require('./patient-repository');
const LISTS = ['chronicIllnesses', 'knownAllergies', 'surgicalHistory', 'familyHistory'];
class PatientIntakeRepository {
  constructor(client) { this.client = client; }
  async create(patientId, history) {
    await this.client.query('INSERT INTO patient_intakes (patient_id) VALUES ($1)', [patientId]);
    for (const category of [...LISTS, 'lifestyleNotes']) {
      const values = category === 'lifestyleNotes' ? (history[category] ? [history[category]] : []) : history[category];
      for (const [position, content] of values.entries()) {
        await this.client.query(`INSERT INTO past_history_items (item_id, patient_id, category, position, content)
          VALUES ($1, $2, $3, $4, $5)`, [randomUUID(), patientId, category, position, content]);
      }
    }
  }
  async find(patientId) {
    const patient = await new PatientRepository(this.client).findByTechnicalId(patientId);
    if (!patient) return null;
    const marker = await this.client.query('SELECT patient_id FROM patient_intakes WHERE patient_id = $1', [patientId]);
    if (!marker.rows.length) return { ...patient, pastHistory: null };
    const result = await this.client.query('SELECT category, position, content FROM past_history_items WHERE patient_id = $1 ORDER BY category, position', [patientId]);
    const pastHistory = { chronicIllnesses: [], knownAllergies: [], surgicalHistory: [], familyHistory: [], lifestyleNotes: '' };
    for (const row of result.rows) {
      if (row.category === 'lifestyleNotes') pastHistory.lifestyleNotes = row.content;
      else if (LISTS.includes(row.category)) pastHistory[row.category].push(row.content);
      else throw new Error('Invalid stored history category');
    }
    return { ...patient, pastHistory };
  }
}
module.exports = { PatientIntakeRepository, LISTS };
