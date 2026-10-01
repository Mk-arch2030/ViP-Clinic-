const test = require('node:test');
const assert = require('node:assert/strict');

const {
  retrieveExistingPatientController,
} = require('./retrieve-existing-patient-controller');

test('Retrieve Existing Patient controller returns the retrieved Patient', async () => {
  const expectedPatient = {
    patient_id: '11111111-1111-4111-8111-111111111111',
    clinic_patient_number: 'CPN-7',
    name: 'Existing Patient',
    age: 40,
    profession: 'Doctor',
    phone: '01111111111',
    gender: 'Female',
  };

  const request = {
    params: {
      patientId: expectedPatient.patient_id,
    },
    server: {
      patientRepository: {
        async findByTechnicalId(patientId) {
          assert.equal(patientId, expectedPatient.patient_id);
          return expectedPatient;
        },
      },
    },
  };

  const response = {
    code(statusCode) {
      assert.equal(statusCode, 200);
      return this;
    },
    send(payload) {
      assert.deepEqual(payload, expectedPatient);
    },
  };

  await retrieveExistingPatientController(request, response);
});

test('Retrieve Existing Patient controller returns 404 when Patient does not exist', async () => {
  const request = {
    params: {
      patientId: '22222222-2222-4222-8222-222222222222',
    },
    server: {
      patientRepository: {
        async findByTechnicalId(patientId) {
          assert.equal(
            patientId,
            '22222222-2222-4222-8222-222222222222',
          );
          return null;
        },
      },
    },
  };

  const response = {
    code(statusCode) {
      assert.equal(statusCode, 404);
      return this;
    },
    send(payload) {
      assert.deepEqual(payload, { error: 'Patient not found' });
    },
  };

  await retrieveExistingPatientController(request, response);
});

console.log('RETRIEVE_EXISTING_PATIENT_CONTROLLER_TEST = PASS');
console.log('FAIL = 0');
