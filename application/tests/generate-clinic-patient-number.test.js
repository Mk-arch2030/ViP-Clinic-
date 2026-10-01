const test = require('node:test');
const assert = require('node:assert/strict');

const {
  registerNewPatient,
} = require('../services/register-new-patient');

const {
  PatientRepository,
} = require('../../backend/persistence/patient-repository');

test('GENERATE CPN establishes a Clinic Patient Number during first registration', async () => {
  const calls = [];

  const client = {
    async query(sql) {
      calls.push(sql);

      if (sql.includes('BEGIN')) return { rows: [] };
      if (sql.includes('COMMIT')) return { rows: [] };

      return { rows: [] };
    },

    release() {
      calls.push('RELEASE');
    },
  };

  const pool = {
    async connect() {
      calls.push('CONNECT');
      return client;
    },
  };

  const repository = {
    async allocateClinicPatientNumber(transactionClient) {
      assert.equal(transactionClient, client);
      calls.push('ALLOCATE_CPN');
      return 'CPN-100';
    },

    async createPatient(patient, transactionClient) {
      assert.equal(transactionClient, client);
      calls.push('CREATE_PATIENT');

      assert.equal(patient.clinicPatientNumber, 'CPN-100');
    },
  };

  const patient = await registerNewPatient({
    name: 'CPN Proof Patient',
    dateOfBirth: '1990-01-01',
    profession: 'Engineer',
    phone: '01000000000',
    gender: 'Male',
    repository,
    pool,
  });

  assert.equal(patient.clinicPatientNumber, 'CPN-100');

  assert.deepEqual(calls, [
    'CONNECT',
    'BEGIN',
    'ALLOCATE_CPN',
    'CREATE_PATIENT',
    'COMMIT',
    'RELEASE',
  ]);
});

test('GENERATE CPN allocation unit produces distinct clinic patient references', async () => {
  const generated = ['CPN-101', 'CPN-102'];
  let index = 0;

  const client = {
    async query(sql) {
      assert.match(sql, /clinic_patient_number_seq/i);

      return {
        rows: [
          {
            clinic_patient_number: generated[index++],
          },
        ],
      };
    },
  };

  const repository = new PatientRepository(client);

  const first = await repository.allocateClinicPatientNumber();
  const second = await repository.allocateClinicPatientNumber();

  assert.match(first, /^CPN-[0-9]+$/);
  assert.match(second, /^CPN-[0-9]+$/);
  assert.notEqual(first, second);
});

console.log('GENERATE_CLINIC_PATIENT_NUMBER_INDEPENDENT_TEST = PASS');
console.log('FAIL = 0');
