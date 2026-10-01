const test = require('node:test');
const assert = require('node:assert/strict');

const {
  retrieveExistingPatient,
} = require('../services/retrieve-existing-patient');

test('Retrieve Existing Patient delegates technical Patient identity retrieval to the authorized repository', async () => {
  const calls = [];
  const expectedPatient = {
    patient_id: '11111111-1111-4111-8111-111111111111',
    clinic_patient_number: 'CPN-7',
    name: 'Existing Patient',
    age: 40,
    profession: 'Doctor',
    phone: '01111111111',
    gender: 'Female',
  };

  const repository = {
    async findByTechnicalId(patientId) {
      calls.push(patientId);
      return expectedPatient;
    },
  };

  const patientId = expectedPatient.patient_id;

  const patient = await retrieveExistingPatient({
    patientId,
    repository,
  });

  assert.deepEqual(calls, [patientId]);
  assert.deepEqual(patient, expectedPatient);
});

test('Retrieve Existing Patient preserves a missing Patient result from the repository', async () => {
  const repository = {
    async findByTechnicalId(patientId) {
      assert.equal(
        patientId,
        '22222222-2222-4222-8222-222222222222',
      );
      return null;
    },
  };

  const patient = await retrieveExistingPatient({
    patientId: '22222222-2222-4222-8222-222222222222',
    repository,
  });

  assert.equal(patient, null);
});

console.log('RETRIEVE_EXISTING_PATIENT_SERVICE_TEST = PASS');
console.log('FAIL = 0');
