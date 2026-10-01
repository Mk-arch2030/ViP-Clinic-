const test = require('node:test');
const assert = require('node:assert/strict');

const {
  PatientRepository,
} = require('./patient-repository');

test('PatientRepository creates a patient through PostgreSQL INSERT and returns the persisted row', async () => {
  const calls = [];

  const fakeClient = {
    async query(sql, params) {
      calls.push({ sql, params });

      return {
        rows: [{
          patient_id: params[0],
          clinic_patient_number: params[1],
          name: params[2],
          date_of_birth: params[3],
          profession: params[4],
          phone: params[5],
          gender: params[6],
        }],
      };
    },
  };

  const repository = new PatientRepository(fakeClient);

  const patient = await repository.createPatient({
    clinicPatientNumber: 'CPN-1',
    name: 'Test Patient',
    dateOfBirth: '1990-02-01',
    profession: 'Engineer',
    phone: '01000000000',
    gender: 'Male',
  });

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /INSERT INTO patients/i);
  assert.match(calls[0].sql, /RETURNING/i);

  assert.match(calls[0].params[0], /^[0-9a-f-]{36}$/i);
  assert.equal(calls[0].params[1], 'CPN-1');
  assert.equal(calls[0].params[2], 'Test Patient');
  assert.equal(calls[0].params[3], '1990-02-01');
  assert.equal(calls[0].params[4], 'Engineer');
  assert.equal(calls[0].params[5], '01000000000');
  assert.equal(calls[0].params[6], 'Male');

  assert.equal(patient.clinic_patient_number, 'CPN-1');
  assert.equal(patient.name, 'Test Patient');
});

test('PatientRepository retrieves a patient by technical patient identity', async () => {
  const calls = [];

  const fakeClient = {
    async query(sql, params) {
      calls.push({ sql, params });

      return {
        rows: [{
          patient_id: params[0],
          clinic_patient_number: 'CPN-7',
          name: 'Existing Patient',
          dateOfBirth: '1990-02-01',
          profession: 'Doctor',
          phone: '01111111111',
          gender: 'Female',
        }],
      };
    },
  };

  const repository = new PatientRepository(fakeClient);

  const patientId = '11111111-1111-4111-8111-111111111111';

  const patient = await repository.findByTechnicalId(patientId);

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /FROM patients/i);
  assert.match(calls[0].sql, /WHERE patient_id = \$1/i);
  assert.deepEqual(calls[0].params, [patientId]);

  assert.equal(patient.patient_id, patientId);
  assert.equal(patient.clinic_patient_number, 'CPN-7');
});

console.log('PATIENT_REPOSITORY_UNIT_TEST = PASS');
console.log('FAIL = 0');
