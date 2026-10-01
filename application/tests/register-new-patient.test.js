const test = require('node:test');
const assert = require('node:assert/strict');

const {
  registerNewPatient,
} = require('../services/register-new-patient');

test('REGISTER NEW PATIENT performs bounded transactional registration', async () => {
  const calls = [];

  const client = {
    async query(sql) {
      calls.push(sql);

      if (sql.includes('BEGIN')) return { rows: [] };
      if (sql.includes('COMMIT')) return { rows: [] };
      if (sql.includes('ROLLBACK')) return { rows: [] };

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
      return 'CPN-2';
    },

    async createPatient(patient, transactionClient) {
      assert.equal(transactionClient, client);
      calls.push('CREATE_PATIENT');

      assert.equal(patient.clinicPatientNumber, 'CPN-2');
      assert.equal(patient.name, 'Test Patient');
    },
  };

  const patient = await registerNewPatient({
    name: 'Test Patient',
    dateOfBirth: '1996-01-01',
    profession: 'Engineer',
    phone: '01000000000',
    gender: 'Male',
    repository,
    pool,
  });

  assert.equal(patient.clinicPatientNumber, 'CPN-2');
  assert.equal(patient.name, 'Test Patient');

  assert.deepEqual(calls, [
    'CONNECT',
    'BEGIN',
    'ALLOCATE_CPN',
    'CREATE_PATIENT',
    'COMMIT',
    'RELEASE',
  ]);
});

test('REGISTER NEW PATIENT rolls back when persistence fails', async () => {
  const calls = [];

  const client = {
    async query(sql) {
      calls.push(sql);

      if (sql.includes('BEGIN')) return { rows: [] };
      if (sql.includes('ROLLBACK')) return { rows: [] };

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
    async allocateClinicPatientNumber() {
      calls.push('ALLOCATE_CPN');
      return 'CPN-3';
    },

    async createPatient() {
      calls.push('CREATE_PATIENT');
      throw new Error('PERSISTENCE_FAILURE');
    },
  };

  await assert.rejects(
    () =>
      registerNewPatient({
        name: 'Rollback Patient',
        dateOfBirth: '1995-01-01',
        profession: 'Engineer',
        phone: '01000000001',
        gender: 'Male',
        repository,
        pool,
      }),
    /PERSISTENCE_FAILURE/,
  );

  assert.deepEqual(calls, [
    'CONNECT',
    'BEGIN',
    'ALLOCATE_CPN',
    'CREATE_PATIENT',
    'ROLLBACK',
    'RELEASE',
  ]);
});

console.log('REGISTER_NEW_PATIENT_TRANSACTION_TEST = PASS');
console.log('FAIL = 0');
