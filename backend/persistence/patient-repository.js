const { randomUUID } = require('node:crypto');
const { calculateAge } = require('../../domain/patient');

class PatientRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async allocateClinicPatientNumber(client = this.pool) {
    const result = await client.query(
      `SELECT 'CPN-' || nextval('clinic_patient_number_seq')::text AS clinic_patient_number`,
    );

    return result.rows[0].clinic_patient_number;
  }

  async createPatient(patient, client = this.pool) {
    const technicalPatientId = randomUUID();

    const result = await client.query(
      `INSERT INTO patients (
         patient_id,
         clinic_patient_number,
         name,
         date_of_birth,
         profession,
         phone,
         gender
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
         patient_id,
         clinic_patient_number,
         name,
         date_of_birth::text AS date_of_birth,
         profession,
         phone,
         gender`,
      [
        technicalPatientId,
        patient.clinicPatientNumber,
        patient.name,
        patient.dateOfBirth,
        patient.profession,
        patient.phone,
        patient.gender,
      ],
    );

    const row = result.rows[0];

    return {
      ...row,
      age: calculateAge(row.date_of_birth),
    };
  }

  async findByTechnicalId(patientId, client = this.pool) {
    const result = await client.query(
      `SELECT
         patient_id,
         clinic_patient_number,
         name,
         date_of_birth::text AS date_of_birth,
         profession,
         phone,
         gender
       FROM patients
       WHERE patient_id = $1`,
      [patientId],
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      ...row,
      age: row.date_of_birth
        ? calculateAge(row.date_of_birth)
        : null,
    };
  }
}

module.exports = { PatientRepository };
