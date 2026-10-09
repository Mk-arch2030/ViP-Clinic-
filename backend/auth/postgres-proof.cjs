'use strict';

// Explicit Termux-only entry. Importing this file opens no driver, pool or server.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const guards = require('./postgres-proof-guards.cjs');
const PATIENT = '55555555-5555-4555-8555-555555555555';
const MISSING = '66666666-6666-4666-8666-666666666666';

async function identity(client, expected, database) {
  const row = (await client.query(`SELECT current_database() AS database,
    current_setting('data_directory') AS data_directory,
    current_setting('unix_socket_directories') AS socket_directories,
    current_setting('port') AS port,current_setting('listen_addresses') AS listen_addresses,
    current_setting('search_path') AS search_path,current_setting('server_version_num') AS version,
    inet_server_addr()::text AS address,(pg_control_system()).system_identifier::text AS system_identifier`)).rows[0];
  return guards.validateIdentity(row, expected, database);
}

function connectionOptions(expected, database) {
  // Ignore PGHOST, PGPORT, PGDATABASE and PGOPTIONS environment defaults.
  return { host: expected.socket, port: expected.port, database, user: require('node:os').userInfo().username, password: '',
    options: '-c search_path=pg_catalog,public -c statement_timeout=10000 -c lock_timeout=5000',
    connectionTimeoutMillis: 5000, max: 6, ssl: false };
}

async function patientBaseline(client) {
  return {
    rows: (await client.query('SELECT * FROM public.patients ORDER BY patient_id')).rows,
    sequence: (await client.query('SELECT last_value::text,is_called FROM public.clinic_patient_number_seq')).rows,
    schema: (await client.query(`SELECT table_schema,table_name,column_name,data_type,is_nullable,column_default
      FROM information_schema.columns WHERE table_schema IN ('public','vip_auth') ORDER BY table_schema,table_name,ordinal_position`)).rows
  };
}

async function prepare(repo, expected, head) {
  const { Client } = require('pg');
  const admin = new Client(connectionOptions(expected, 'postgres'));
  await admin.connect();
  let systemId;
  try {
    systemId = await identity(admin, expected, 'postgres');
    assert.equal((await admin.query('SELECT 1 FROM pg_database WHERE datname=$1', [guards.DATABASE])).rows.length, 0,
      'Auth database already exists: refuse overwrite, reset or drop');
    await admin.query('CREATE DATABASE roby_auth_proof_stage5');
  } finally { await admin.end(); }
  const client = new Client(connectionOptions(expected, guards.DATABASE));
  await client.connect();
  try {
    assert.equal(await identity(client, expected, guards.DATABASE), systemId);
    await client.query('BEGIN');
    await client.query(fs.readFileSync(path.join(repo,'backend/persistence/schema.sql'), 'utf8'));
    await client.query(fs.readFileSync(path.join(repo,'backend/persistence/auth-schema.sql'), 'utf8'));
    await client.query(`CREATE TABLE vip_auth.proof_manifest (
      singleton BOOLEAN PRIMARY KEY CHECK (singleton),head TEXT NOT NULL,system_identifier TEXT NOT NULL)`);
    await client.query('INSERT INTO vip_auth.proof_manifest VALUES (true,$1,$2)', [head,systemId]);
    const { DOCTOR,NURSE,disabled } = require('./test-service-contract.cjs');
    await client.query(`INSERT INTO public.actors(actor_id,actor_role,lifecycle_state) VALUES
      ($1,'DOCTOR','ACTIVE'),($2,'NURSE','ACTIVE'),($3,'DOCTOR','DEACTIVATED')`, [DOCTOR,NURSE,disabled]);
    await client.query(`INSERT INTO public.patients(patient_id,clinic_patient_number,name,date_of_birth,profession,phone,gender)
      VALUES ($1,'CPN-9001','Independent Stage 5 Synthetic Patient','1990-02-01','Tester','00000000000','Male')`, [PATIENT]);
    await client.query('COMMIT');
  } catch (error) { try { await client.query('ROLLBACK'); } catch {} throw error; }
  finally { await client.end(); }
  console.log('NEW_AUTH_DATABASE_PREPARED=PASS');
  console.log('STAGE4_DATABASE_AND_HISTORICAL_CLUSTER=NOT_CONNECTED');
  console.log('AUTH_RUNTIME_PROOF=NOT_EXECUTED');
}

async function prove(repo, expected, head) {
  const { Pool } = require('pg');
  const { AuthRepository, sessionRow } = require('../persistence/auth-repository');
  const { createAuthService } = require('./auth-service');
  const { createVerifier, verifyPassword } = require('./password-verifier');
  const { cases, DOCTOR,NURSE,disabled,password,login } = require('./test-service-contract.cjs');
  const Fastify = require('fastify');
  const { composeSecuredPatients } = require('../api/secured-patient-composition');
  const pool = new Pool(connectionOptions(expected, guards.DATABASE));
  let app;
  try {
    const client = await pool.connect();
    let baseline;
    try {
      const systemId = await identity(client, expected, guards.DATABASE);
      const manifest = (await client.query('SELECT * FROM vip_auth.proof_manifest')).rows;
      assert.deepEqual(manifest, [{ singleton: true, head, system_identifier: systemId }]);
      baseline = await patientBaseline(client);
      assert.equal(baseline.rows.length, 1, 'Fresh synthetic baseline required');
      assert.equal(baseline.rows[0].patient_id, PATIENT);
      assert.equal(baseline.rows[0].clinic_patient_number, 'CPN-9001');
      assert.deepEqual(baseline.sequence, [{ last_value: '1', is_called: false }]);
      assert.equal((await client.query('SELECT count(*)::integer AS count FROM public.actors')).rows[0].count, 3);
      assert.equal((await client.query('SELECT count(*)::integer AS count FROM vip_auth.credentials')).rows[0].count, 0,
        'Prior auth execution found: no automatic re-run/reset');
    } finally { client.release(); }
    console.log('DATABASE_IDENTITY_AND_FRESH_BASELINE=PASS');
    // Synthetic plaintexts exist only in process memory; no passwords/verifiers printed.
    const verifier = await createVerifier(password);
    const dummyVerifier = await createVerifier(randomBytes(32).toString('base64url'));
    const store = new AuthRepository(pool);
    async function harness() {
      let now = Date.now();
      // Each case owns only this newly created proof database's synthetic auth state.
      await store.transaction(async tx => {
        await tx.client.query('TRUNCATE vip_auth.sessions,vip_auth.credentials,vip_auth.delegations,vip_auth.operating_mode,vip_auth.login_attempts');
        await tx.client.query(`UPDATE public.actors SET actor_role=CASE WHEN actor_id=$1 THEN 'NURSE' ELSE 'DOCTOR' END,
          lifecycle_state=CASE WHEN actor_id=$2 THEN 'DEACTIVATED' ELSE 'ACTIVE' END`, [NURSE,disabled]);
        for (const [id,label] of [[DOCTOR,'SYN/DOCTOR'],[NURSE,'SYN/NURSE'],[disabled,'SYN/DISABLED']]) {
          await tx.client.query('INSERT INTO vip_auth.credentials(actor_id,login_label,verifier,version,enabled) VALUES ($1,$2,$3,1,true)', [id,label,verifier]);
        }
        await tx.client.query("INSERT INTO vip_auth.operating_mode VALUES (true,'DOCTOR_NURSE')");
        await tx.client.query("INSERT INTO vip_auth.delegations VALUES ($1,$2,'FULL',ARRAY[]::text[],1)", [NURSE,DOCTOR]);
      });
      const auth = createAuthService({ store, dummyVerifier, verify: verifyPassword, clock: () => now });
      return { auth, advance: ms => { now += ms; },
        actor: (id,patch) => store.transaction(async tx => {
          assert.ok(Object.keys(patch).every(k => ['actor_role','lifecycle_state'].includes(k)));
          await tx.client.query('UPDATE public.actors SET actor_role=COALESCE($2,actor_role),lifecycle_state=COALESCE($3,lifecycle_state) WHERE actor_id=$1', [id,patch.actor_role ?? null,patch.lifecycle_state ?? null]);
        }),
        readActor: id => store.transaction(tx => tx.actor(id)),
        credential: (id,patch) => store.transaction(async tx => {
          await tx.client.query('UPDATE vip_auth.credentials SET version=COALESCE($2,version),enabled=COALESCE($3,enabled) WHERE actor_id=$1', [id,patch.version ?? null,patch.enabled ?? null]);
        }),
        delegation: patch => store.transaction(async tx => { await tx.client.query('UPDATE vip_auth.delegations SET mode=$1,capabilities=$2,version=version+1 WHERE nurse_id=$3', [patch.mode,patch.capabilities,NURSE]); }),
        mode: mode => store.transaction(async tx => { await tx.client.query('UPDATE vip_auth.operating_mode SET mode=$1 WHERE singleton=true', [mode]); }),
        sessions: () => store.transaction(async tx => (await tx.client.query('SELECT * FROM vip_auth.sessions ORDER BY issued_at,digest')).rows.map(sessionRow))
      };
    }
    for (let i = 0; i < cases.length; i++) {
      await cases[i][1](await harness());
      console.log(`REAL_PG_AUTH_CASE_${String(i+1).padStart(2,'0')}=PASS`);
    }
    // Independent pool/repository instances share SQL locks, not a JS mutex.
    const h = await harness();
    const otherStore = new AuthRepository(pool);
    const otherAuth = createAuthService({ store: otherStore,dummyVerifier });
    const tokens = await Promise.all([login(h),otherAuth.login({ loginLabel:'SYN/DOCTOR',password,source:'synthetic-other' }),login(h),login(h)]);
    assert.equal((await h.sessions()).filter(s => s.revoked_at === null).length, 3);
    assert.equal(tokens.length, 4);
    console.log('INDEPENDENT_REPOSITORY_CONCURRENT_SESSION_CAP=PASS');
    const replacement = await createVerifier(randomBytes(32).toString('base64url'));
    await store.replaceCredential(DOCTOR,replacement);
    const replaced = await pool.query('SELECT version FROM vip_auth.credentials WHERE actor_id=$1',[DOCTOR]);
    assert.equal(replaced.rows[0].version,2);
    assert.equal((await h.sessions()).filter(s => s.revoked_at === null).length,0);
    await assert.rejects(login(h),error => error.statusCode === 401);
    console.log('ATOMIC_CREDENTIAL_REPLACEMENT_AND_SESSION_REVOCATION=PASS');
    const transport = await harness();
    app = Fastify({ logger:false,trustProxy:false });
    const origin = 'https://vip.synthetic.invalid';
    await composeSecuredPatients(app, { auth:transport.auth,trustedOrigin:origin });
    await app.ready();
    const request = args => app.inject(args);
    assert.equal((await request({ method:'GET',url:'/patients/'+PATIENT,headers:{ 'x-actor-role':'Doctor' } })).statusCode,401);
    const wrong = await request({ method:'POST',url:'/auth/login',headers:{origin},payload:{loginLabel:'SYN/DOCTOR',password:'wrong synthetic password'} });
    assert.equal(wrong.statusCode,401);
    const signed = await request({ method:'POST',url:'/auth/login',headers:{origin},payload:{loginLabel:'SYN/DOCTOR',password} });
    assert.equal(signed.statusCode,200);
    const cookie = signed.headers['set-cookie'].split(';')[0];
    const session = await request({ method:'GET',url:'/auth/session',headers:{cookie} });
    assert.equal(session.statusCode,200);
    assert.equal(session.json().actorIdentityReference,DOCTOR);
    assert.equal((await request({ method:'GET',url:'/patients/'+PATIENT,headers:{cookie} })).statusCode,200);
    assert.equal((await request({ method:'GET',url:'/patients/'+MISSING,headers:{cookie} })).statusCode,404);
    const body = { name:'Stage 5 Synthetic Registration',dateOfBirth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male' };
    assert.equal((await request({ method:'POST',url:'/patients',headers:{cookie,origin},payload:body })).statusCode,403);
    const nurse = await request({ method:'POST',url:'/auth/login',headers:{origin},payload:{loginLabel:'SYN/NURSE',password} });
    assert.equal(nurse.statusCode,200);
    assert.equal((await request({ method:'GET',url:'/patients/'+PATIENT,headers:{cookie:nurse.headers['set-cookie'].split(';')[0]} })).statusCode,403);
    await transport.actor(DOCTOR,{lifecycle_state:'DEACTIVATED'});
    assert.equal((await request({ method:'GET',url:'/patients/'+PATIENT,headers:{cookie} })).statusCode,401);
    await transport.actor(DOCTOR,{lifecycle_state:'ACTIVE'}); // Test fixture restoration only; no product reactivation API.
    const compared = await pool.connect();
    try { assert.deepEqual(await patientBaseline(compared),baseline); } finally { compared.release(); }
    console.log('DENIAL_AND_GET_PATIENT_SEQUENCE_SCHEMA_PRESERVATION=PASS');
    console.log('REAL_PG_FASTIFY_IDENTITY_CSRF_DEACTIVATION_AND_200_404=PASS');
    // Prove rollback across auth + business data before the successful registration.
    const markerId = '77777777-7777-4777-8777-777777777777';
    const rawToken = cookie.slice('__Host-vip_session='.length);
    const csrf = session.json().csrf;
    await assert.rejects(transport.auth.withAuthorized(rawToken,'PATIENT_REGISTER',csrf,async ({client}) => {
      await client.query(`INSERT INTO public.patients(patient_id,clinic_patient_number,name,profession,phone,gender)
        VALUES ($1,'CPN-ROLLBACK','Rollback Fixture','Tester','00000000000','Male')`,[markerId]);
      throw new Error('synthetic failure');
    }),error => error.statusCode === 503);
    assert.equal((await pool.query('SELECT 1 FROM public.patients WHERE patient_id=$1',[markerId])).rows.length,0);
    console.log('AUTH_AND_BUSINESS_TRANSACTION_ROLLBACK=PASS');
    const created = await request({ method:'POST',url:'/patients',headers:{cookie,origin,'x-csrf-token':csrf},payload:body });
    assert.equal(created.statusCode,201);
    assert.equal((await pool.query('SELECT count(*)::integer AS count FROM public.patients')).rows[0].count,2);
    assert.deepEqual((await pool.query('SELECT last_value::text,is_called FROM public.clinic_patient_number_seq')).rows,[{last_value:'1',is_called:true}]);
    console.log('AUTHORIZED_DOCTOR_POST_PERSISTENCE=PASS');
    console.log('EXPECTED_POST_EFFECT=ONE_NEW_SYNTHETIC_PATIENT_AND_ONE_CPN_ALLOCATION');
    const logout = await request({ method:'POST',url:'/auth/logout',headers:{cookie,origin,'x-csrf-token':csrf},payload:{} });
    assert.equal(logout.statusCode,204);
    assert.equal((await request({ method:'GET',url:'/patients/'+PATIENT,headers:{cookie} })).statusCode,401);
    assert.equal(app.server.listening,false);
    console.log('LOGOUT_REUSE_DENIAL=PASS');
    console.log('NETWORK_LISTENER=NOT_STARTED');
  } finally { if (app) await app.close(); await pool.end(); }
}

async function main(args) {
  const {mode,head} = guards.parseArgs(args);
  const repo = path.resolve(__dirname,'../..');
  guards.preflightSource(repo,head);
  const before = guards.snapshot(repo);
  const expected = guards.clusterPaths(process.env.HOME,process.env.PREFIX || '/data/data/com.termux/files/usr');
  const pid = guards.preflightCluster(expected);
  const metadataHash = guards.hash(fs.readFileSync(path.join(expected.data,'postmaster.pid')));
  let succeeded = false;
  try {
    if (mode === 'prepare') await prepare(repo,expected,head); else await prove(repo,expected,head);
    succeeded = true;
  } finally {
    assert.equal(guards.preflightCluster(expected),pid,'Postmaster identity changed during proof');
    assert.equal(guards.hash(fs.readFileSync(path.join(expected.data,'postmaster.pid'))),metadataHash,'Postmaster metadata changed during proof');
    assert.deepEqual(guards.snapshot(repo),before,'Repository/protected state changed during proof');
    console.log('PROTECTED_BYTES_STATUS_INDEX_AND_HEAD=UNCHANGED');
    console.log('CLUSTER_STOP_DROP_AND_CLEANUP=NOT_EXECUTED');
    console.log('PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE=NOT_GRANTED');
  }
  if (succeeded && mode === 'prove') console.log('REAL_POSTGRESQL_AUTH_PROOF=PASS_FOR_TESTED_ISOLATED_PATHS');
}

if (require.main === module) main(process.argv.slice(2)).catch(() => {
  console.error('STAGE5_AUTH_COMMAND=FAILED — proof not established; inspect bounded state before retry');
  process.exitCode = 1;
});

module.exports = { main, connectionOptions, identity };
