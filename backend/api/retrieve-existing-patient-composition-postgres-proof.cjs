'use strict';

// Test-only proof package. Importing this module never loads pg/Fastify or connects.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');

const FOUND = '55555555-5555-4555-8555-555555555555';
const MISSING = '77777777-7777-4777-8777-777777777777';
const PORT = 55439;
const DATABASE = 'roby_retrieve_proof_c';
const AUTHORIZATION = 'AUTHORIZED_ISOLATED_GET_ONLY';
const SOURCE_HASHES = {
  "package.json": "4984f15edc6794a6858278260f0b1c0a3b912687087267a79f23a5eae859dabe",
  "backend/package.json": "e78adbbbe5741f27e8d900be349911234c1ae45c20a3f2fa293e2c8e5abf3c31",
  "application/package.json": "e78adbbbe5741f27e8d900be349911234c1ae45c20a3f2fa293e2c8e5abf3c31",
  "domain/package.json": "e78adbbbe5741f27e8d900be349911234c1ae45c20a3f2fa293e2c8e5abf3c31",
  "backend/api/patient-registration-composition.js": "d55548a3150d289d46dbb67c9d773339e0694b269d8978955e2a7923ee89c207",
  "backend/api/controllers/register-new-patient-controller.js": "60e82f52c6041e767c6c04fe0b44b744cee06014c5421032c59a9e78c28432a8",
  "backend/api/controllers/retrieve-existing-patient-controller.js": "e002769ee267861ecf035f12deccb360f9ba4e183b49fa6346e7be44c35a8860",
  "application/services/register-new-patient.js": "f0c1a475e3ec5b4b873b1c4e8adca5c22c98343f47beec15fc6a0e50d6bf4c37",
  "application/services/retrieve-existing-patient.js": "852a9ff7d9ce7008ce49a442b51e480e0ff67e71cd73eaa6d97a586ddc92ed23",
  "domain/patient.js": "7f9e5a0a7f5334a928d3e5db384e4a0ea01a31cda5a7066409c8e5fc070aeffb",
  "backend/persistence/patient-repository.js": "21b79079fd6dd9350572946decfa780fb8279ae0a2be5ffdffc3e449fc16281c",
  "backend/config/postgres.js": "f617953662173197b872d7196680bc90ac7d83134111ae1a4d8f89917d9c8d47"
};
const PROTECTED = [
  'src/index.css',
  'ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md',
  'backend/api/routes/register-new-patient-route.js',
  'src/components/PatientIntake.tsx.pre-light-migration',
];
const RETRIEVAL_SQL = 'SELECT patient_id, clinic_patient_number, name, date_of_birth::text AS date_of_birth, profession, phone, gender FROM patients WHERE patient_id = $1';
const normalize = sql => String(sql).replace(/\s+/g, ' ').trim();
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

function assertInvocation(env, argv) {
  assert.equal(env.VIP_STAGE4_EXECUTION, AUTHORIZATION, 'Explicit isolated GET execution decision required');
  assert.deepEqual(argv.slice(0, 1), ['--expected-head'], 'Use --expected-head <verified package commit>');
  assert.equal(argv.length, 2, 'Unexpected arguments');
  assert.match(argv[1], /^[0-9a-f]{40}$/, 'Expected full commit SHA');
  return argv[1];
}

function assertQuery(sql, params) {
  assert.equal(normalize(sql), RETRIEVAL_SQL, 'Only the existing repository retrieval SELECT is allowed');
  assert.ok(Array.isArray(params) && params.length === 1 && [FOUND, MISSING].includes(params[0]),
    'Only approved synthetic retrieval identities are allowed');
}

function assertPidFile(lines, expected) {
  assert.match(lines[0], /^[1-9]\d*$/, 'Invalid postmaster PID');
  assert.equal(lines[1], expected.data, 'postmaster data directory mismatch');
  assert.match(lines[2], /^\d+$/, 'Invalid postmaster start time');
  assert.equal(lines[3], String(PORT), 'postmaster port mismatch');
  assert.equal(lines[4], expected.socket, 'postmaster socket directory mismatch');
  assert.equal(lines[7], 'ready', 'Isolated cluster is not ready');
}

function assertDatabaseIdentity(row, expected) {
  assert.equal(row.database, DATABASE);
  assert.equal(row.data, expected.data);
  assert.equal(row.port, String(PORT));
  assert.equal(row.socket, expected.socket);
  assert.equal(row.listen, '', 'TCP must remain disabled');
  assert.equal(row.read_only, 'on', 'Session must be read-only');
  assert.equal(row.search_path, 'public');
  assert.equal(Math.floor(Number(row.version) / 10000), 18);
  assert.equal(row.system_identifier, expected.systemIdentifier);
  assert.equal(Number(row.started), Number(expected.started));
}

function assertFixture(snapshot) {
  assert.equal(snapshot.patients.length, 1, 'Expected exactly one synthetic patient');
  assert.equal(snapshot.patients[0].patient_id, FOUND);
  assert.equal(snapshot.patients[0].clinic_patient_number, 'CPN-9001');
  assert.equal(snapshot.patients[0].date_of_birth, '1990-02-01');
  assert.equal(String(snapshot.sequence.last_value), '1');
  assert.equal(snapshot.sequence.is_called, false);
}

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], {
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }, encoding: 'utf8',
  });
}

function worktreeSnapshot(root) {
  return {
    head: git(root, ['rev-parse', 'HEAD']).trim(),
    index: digest(git(root, ['diff', '--cached', '--binary', '--no-ext-diff'])),
    indexEntries: digest(git(root, ['ls-files', '--stage', '-z'])),
    protected: PROTECTED.map(name => {
      const file = path.join(root, name);
      return {
        name,
        // Missing protected files are recorded, never created.
        bytes: fs.existsSync(file) ? digest(fs.readFileSync(file)) : null,
        status: git(root, ['status', '--porcelain=v1', '--untracked-files=all', '--', name]),
      };
    }),
  };
}

function sourcePreflight(root, expectedHead) {
  assert.equal(git(root, ['rev-parse', '--show-toplevel']).trim(), root);
  assert.equal(git(root, ['branch', '--show-current']).trim(), 'main');
  assert.equal(git(root, ['rev-parse', 'HEAD']).trim(), expectedHead, 'Checkout does not match verified package');
  for (const [name, hash] of Object.entries(SOURCE_HASHES)) {
    assert.equal(digest(fs.readFileSync(path.join(root, name))), hash, 'Source baseline changed: ' + name);
  }
  const name = 'backend/api/retrieve-existing-patient-composition-postgres-proof.cjs';
  assert.equal(fs.readFileSync(path.join(root, name), 'utf8'), git(root, ['show', 'HEAD:' + name]),
    'Proof runner must match its committed bytes');
}

function clusterPreflight(home) {
  const canonicalHome = fs.realpathSync(home);
  const base = path.join(canonicalHome, 'vip-retrieve-proof-isolated');
  const expected = { data: path.join(base, 'data'), socket: path.join(base, 'socket') };
  for (const directory of [base, expected.data, expected.socket]) {
    assert.equal(fs.realpathSync(directory), directory, 'Cluster path must not redirect through a symlink');
  }
  const pidFile = path.join(expected.data, 'postmaster.pid');
  assert.equal(fs.realpathSync(pidFile), pidFile);
  const pidBytes = fs.readFileSync(pidFile, 'utf8');
  const lines = pidBytes.trimEnd().split('\n').map(s => s.trim());
  assertPidFile(lines, expected);
  process.kill(Number(lines[0]), 0); // Existence/permission check only; signal zero.
  const command = fs.readFileSync('/proc/' + lines[0] + '/cmdline', 'utf8').split('\0').filter(Boolean);
  const dataArg = command.indexOf('-D');
  assert.ok(dataArg >= 0 && command[dataArg + 1] === expected.data,
    'Running postmaster command must name the isolated data directory');
  const socketFile = path.join(expected.socket, '.s.PGSQL.' + PORT);
  assert.equal(fs.realpathSync(socketFile), socketFile);
  assert.ok(fs.lstatSync(socketFile).isSocket(), 'Expected an isolated Unix socket');
  const control = execFileSync('pg_controldata', [expected.data], {
    env: { ...process.env, LC_ALL: 'C' }, encoding: 'utf8',
  });
  const identifier = control.match(/^Database system identifier:\s+(\d+)\s*$/m);
  assert.ok(identifier, 'Could not establish local cluster system identifier');
  assert.equal(fs.readFileSync(pidFile, 'utf8'), pidBytes, 'Cluster changed during preflight');
  return { ...expected, systemIdentifier: identifier[1], started: lines[2], pidFile, pidBytes };
}

async function databaseIdentity(pool, expected) {
  const { rows } = await pool.query(
    "SELECT current_database() AS database, current_setting('data_directory') AS data, " +
    "current_setting('port') AS port, current_setting('unix_socket_directories') AS socket, " +
    "current_setting('listen_addresses') AS listen, current_setting('default_transaction_read_only') AS read_only, " +
    "current_setting('search_path') AS search_path, current_setting('server_version_num') AS version, " +
    "system_identifier::text AS system_identifier, " +
    "floor(extract(epoch FROM pg_postmaster_start_time()))::bigint::text AS started FROM pg_control_system()");
  assertDatabaseIdentity(rows[0], expected);
}

async function snapshot(pool) {
  const patients = (await pool.query(
    'SELECT patient_id, clinic_patient_number, name, date_of_birth::text AS date_of_birth, profession, phone, gender FROM public.patients ORDER BY patient_id'
  )).rows;
  const sequence = (await pool.query('SELECT last_value::text, is_called FROM public.clinic_patient_number_seq')).rows[0];
  const columns = (await pool.query(
    "SELECT c.relname, c.relkind, a.attnum, a.attname, format_type(a.atttypid,a.atttypmod) AS type, a.attnotnull, " +
    "pg_get_expr(d.adbin,d.adrelid) AS default_expression FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace " +
    "JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum " +
    "WHERE n.nspname='public' AND a.attnum>0 AND NOT a.attisdropped ORDER BY c.relname,a.attnum")).rows;
  const constraints = (await pool.query(
    "SELECT c.relname,k.conname,pg_get_constraintdef(k.oid) AS definition FROM pg_constraint k " +
    "JOIN pg_class c ON c.oid=k.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace " +
    "WHERE n.nspname='public' ORDER BY c.relname,k.conname")).rows;
  const indexes = (await pool.query(
    "SELECT tablename,indexname,indexdef FROM pg_indexes WHERE schemaname='public' ORDER BY tablename,indexname")).rows;
  const sequences = (await pool.query(
    "SELECT sequencename,data_type,start_value::text,min_value::text,max_value::text,increment_by::text,cycle,cache_size::text " +
    "FROM pg_sequences WHERE schemaname='public' ORDER BY sequencename")).rows;
  return { patients, sequence, columns, constraints, indexes, sequences };
}

async function run() {
  const expectedHead = assertInvocation(process.env, process.argv.slice(2));
  const root = fs.realpathSync(path.join(__dirname, '../..'));
  sourcePreflight(root, expectedHead);
  const workBefore = worktreeSnapshot(root);
  assert.equal(git(root, ['diff', '--cached', '--name-only']).trim(), '', 'Index must be empty');
  const cluster = clusterPreflight(os.homedir());
  console.log('SOURCE_AND_CLUSTER_PREFLIGHT=PASS');
  // All target settings are explicit. DATABASE_URL and PGHOST/PGPORT/PGDATABASE are not used.
  const { Pool } = require('pg');
  const Fastify = require('fastify');
  const { composePatientRegistration } = require('./patient-registration-composition');
  const { calculateAge } = require('../../domain/patient');
  const pool = new Pool({
    host: cluster.socket, port: PORT, database: DATABASE, user: os.userInfo().username,
    password: '', ssl: false, max: 1, connectionTimeoutMillis: 5000,
    options: '-c default_transaction_read_only=on -c search_path=public -c statement_timeout=5000',
    application_name: 'vip_stage4_isolated_get_composition_proof',
  });
  let app;
  let success = false;
  let failure;
  try {
    await databaseIdentity(pool, cluster);
    console.log('DATABASE_IDENTITY=PASS');
    const before = await snapshot(pool);
    assertFixture(before);
    assert.ok(!before.patients.some(p => p.patient_id === MISSING));
    console.log('BASELINE=VERIFIED');
    const queries = [];
    const guardedPool = {
      query: async (sql, params) => {
        assertQuery(sql, params);
        queries.push(params[0]);
        return pool.query(sql, params);
      },
      connect() { throw new Error('POST/transaction connection is forbidden in GET proof'); },
      end() { throw new Error('Caller-owned pool must not be closed by composition'); },
    };
    app = Fastify();
    app.listen = async () => { throw new Error('Network listener is forbidden'); };
    await composePatientRegistration(app, { pool: guardedPool, enableRetrieveExistingPatient: true });
    await app.ready();
    assert.equal(app.server.listening, false);
    assert.deepEqual(queries, [], 'Composition must not query the database');
    assert.equal(app.hasRoute({ method: 'POST', url: '/patients' }), true);
    assert.equal(app.hasRoute({ method: 'GET', url: '/patients/:patientId' }), true);
    console.log('POST_ROUTE_PRESENT_NOT_INVOKED=VERIFIED');
    const forbidden = () => { throw new Error('Patient/CPN mutation is forbidden'); };
    app.patientRepository.createPatient = forbidden;
    app.patientRepository.allocateClinicPatientNumber = forbidden;
    const ageBefore = new Date();
    const found = await app.inject({ method: 'GET', url: '/patients/' + FOUND });
    const ageAfter = new Date();
    assert.equal(found.statusCode, 200);
    const { age, ...persisted } = found.json();
    assert.deepEqual(persisted, before.patients[0]);
    assert.ok([calculateAge('1990-02-01', ageBefore), calculateAge('1990-02-01', ageAfter)].includes(age));
    console.log('HTTP_FOUND_200=PASS');
    const missing = await app.inject({ method: 'GET', url: '/patients/' + MISSING });
    assert.equal(missing.statusCode, 404);
    assert.deepEqual(missing.json(), { error: 'Patient not found' });
    console.log('HTTP_MISSING_404=PASS');
    assert.deepEqual(queries, [FOUND, MISSING]);
    assert.equal(app.server.listening, false);
    await app.close();
    app = null;
    await databaseIdentity(pool, cluster);
    assert.deepEqual(await snapshot(pool), before, 'Compared database state changed');
    assert.equal(fs.readFileSync(cluster.pidFile, 'utf8'), cluster.pidBytes, 'Cluster identity changed');
    console.log('POST_GET_COMPARED_DATA_SEQUENCE_AND_SCHEMA_PRESERVATION=PASS');
    console.log('NETWORK_LISTENER=NOT_STARTED');
    success = true;
  } catch (error) {
    failure = error;
  } finally {
    try { if (app) await app.close(); } catch (error) { failure ||= error; }
    try { await pool.end(); } catch (error) { failure ||= error; }
    try { assert.deepEqual(worktreeSnapshot(root), workBefore, 'Protected worktree/index/HEAD changed'); }
    catch (error) { failure ||= error; }
  }
  if (failure) throw failure;
  assert.equal(success, true);
  console.log('PROTECTED_BYTES_AND_STATUS=UNCHANGED');
  console.log('INDEX=UNCHANGED');
  console.log('HEAD=UNCHANGED');
  console.log('REAL_POSTGRESQL_COMPOSITION_PROOF=PASS_FOR_TESTED_ISOLATED_PATHS');
  console.log('PRODUCTION_GET_ENABLEMENT=NOT_GRANTED');
  console.log('CLINICAL_AUTHORITY=NOT_GRANTED');
  console.log('DECISION_E_CLEANUP=NOT_AUTHORIZED');
}

module.exports = { assertInvocation, assertQuery, assertPidFile, assertDatabaseIdentity, assertFixture };
if (require.main === module) {
  run().catch(error => {
    console.error('REAL_POSTGRESQL_COMPOSITION_PROOF=FAIL_OR_BLOCKED');
    console.error(error.message);
    process.exitCode = 1;
  });
}
