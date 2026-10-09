'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  assertInvocation, assertQuery, assertPidFile, assertDatabaseIdentity, assertFixture,
} = require('./retrieve-existing-patient-composition-postgres-proof.cjs');

const id = '55555555-5555-4555-8555-555555555555';
const sql = 'SELECT patient_id, clinic_patient_number, name, date_of_birth::text AS date_of_birth, profession, phone, gender FROM patients WHERE patient_id = $1';
const expected = {
  data: '/synthetic-home/vip-retrieve-proof-isolated/data',
  socket: '/synthetic-home/vip-retrieve-proof-isolated/socket',
  systemIdentifier: '1234567890', started: '1800000000',
};
const identity = () => ({
  database: 'roby_retrieve_proof_c', data: expected.data, port: '55439',
  socket: expected.socket, listen: '', read_only: 'on', search_path: 'public',
  version: '180000', system_identifier: expected.systemIdentifier, started: expected.started,
});
const fixture = () => ({
  patients: [{ patient_id: id, clinic_patient_number: 'CPN-9001', date_of_birth: '1990-02-01' }],
  sequence: { last_value: '1', is_called: false },
});

test('import exposes guards without loading a database or HTTP driver', () => {
  assert.ok(!Object.keys(require.cache).some(p => /node_modules[\\/](pg|fastify)[\\/]/.test(p)));
});
test('explicit execution token and full expected HEAD are required', () => {
  assert.throws(() => assertInvocation({}, ['--expected-head', 'a'.repeat(40)]));
  assert.throws(() => assertInvocation({ VIP_STAGE4_EXECUTION: 'AUTHORIZED_ISOLATED_GET_ONLY' }, ['--expected-head', 'short']));
  assert.equal(assertInvocation({ VIP_STAGE4_EXECUTION: 'AUTHORIZED_ISOLATED_GET_ONLY' }, ['--expected-head', 'a'.repeat(40)]), 'a'.repeat(40));
});
test('unexpected invocation arguments are rejected', () => {
  assert.throws(() => assertInvocation({ VIP_STAGE4_EXECUTION: 'AUTHORIZED_ISOLATED_GET_ONLY' }, ['--expected-head', 'a'.repeat(40), '--database', 'other']));
});
test('existing retrieval SELECT permits only the two synthetic identities', () => {
  assert.doesNotThrow(() => assertQuery(sql, [id]));
  assert.doesNotThrow(() => assertQuery(sql.replace(/ /g, '\n'), ['77777777-7777-4777-8777-777777777777']));
  assert.throws(() => assertQuery(sql, ['real-patient']));
  assert.throws(() => assertQuery(sql, [id, id]));
});
test('SQL mutation, sequence allocation, multi-statements and other SELECTs are rejected', () => {
  for (const query of ['DELETE FROM patients', "SELECT nextval('clinic_patient_number_seq')",
    sql + '; DELETE FROM patients', 'SELECT * FROM patients', 'BEGIN', sql + ' -- hidden']) {
    assert.throws(() => assertQuery(query, [id]));
  }
});
test('matching ready isolated postmaster metadata is accepted', () => {
  assert.doesNotThrow(() => assertPidFile(['123', expected.data, expected.started, '55439', expected.socket, '', '', 'ready'], expected));
});
test('historical path, wrong port/socket and non-ready postmaster are rejected', () => {
  const valid = ['123', expected.data, expected.started, '55439', expected.socket, '', '', 'ready'];
  for (const [index, value] of [[1, '/protected/var/lib/postgresql'], [3, '5432'], [4, '/tmp'], [7, 'starting']]) {
    const changed = [...valid]; changed[index] = value;
    assert.throws(() => assertPidFile(changed, expected));
  }
});
test('matching isolated PostgreSQL 18 identity is accepted', () => {
  assert.doesNotThrow(() => assertDatabaseIdentity(identity(), expected));
});
test('database, data directory, socket, port and cluster identity mismatch are rejected', () => {
  for (const [key, value] of Object.entries({
    database: 'vip_clinic', data: '/protected/var/lib/postgresql', socket: '/tmp',
    port: '5432', system_identifier: '999', started: '1800000010',
  })) {
    assert.throws(() => assertDatabaseIdentity({ ...identity(), [key]: value }, expected));
  }
});
test('TCP exposure, writable session, wrong search path or server version are rejected', () => {
  for (const [key, value] of Object.entries({ listen: 'localhost', read_only: 'off', search_path: '"$user", public', version: '170000' })) {
    assert.throws(() => assertDatabaseIdentity({ ...identity(), [key]: value }, expected));
  }
});
test('exact synthetic fixture and untouched sequence baseline are accepted', () => {
  assert.doesNotThrow(() => assertFixture(fixture()));
});
test('extra patients, altered identity/CPN/DOB or consumed sequence reject the baseline', () => {
  const extra = fixture(); extra.patients.push({ ...extra.patients[0] });
  assert.throws(() => assertFixture(extra));
  for (const [key, value] of Object.entries({ patient_id: 'other', clinic_patient_number: 'CPN-1001', date_of_birth: '2000-01-01' })) {
    const changed = fixture(); changed.patients[0][key] = value;
    assert.throws(() => assertFixture(changed));
  }
  for (const sequence of [{ last_value: '2', is_called: false }, { last_value: '1', is_called: true }]) {
    assert.throws(() => assertFixture({ ...fixture(), sequence }));
  }
});
