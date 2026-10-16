'use strict';
// Explicit execution only. Never invoked by application startup or test:all.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {execFileSync}=require('node:child_process');
const {randomBytes}=require('node:crypto');
const guards=require('../auth/postgres-proof-guards.cjs');
const {scenarios,PATIENT,SECOND_DOCTOR}=require('./case-create-scenarios.cjs');
const {DOCTOR,NURSE,password}=require('../auth/test-service-contract.cjs');
let phase='SOURCE_AND_CLUSTER_PREFLIGHT';
function preflight(args) {
 assert.equal(args.length,2,'Required: ROBY_C2_NEW_DISPOSABLE full_expected_HEAD');
 assert.equal(args[0],'ROBY_C2_NEW_DISPOSABLE');assert.match(args[1],/^[0-9a-f]{40}$/);
 const repo=path.resolve(__dirname,'../..');
 const git=(...a)=>execFileSync('git',['-C',repo,...a],{encoding:'utf8',env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}}).trim();
 assert.equal(git('rev-parse','HEAD'),args[1]);assert.equal(git('status','--porcelain'),'', 'Clean isolated source required');
 assert.match(git('branch','--show-current'),/^work\/(?:astra-)?stage7-doctor-case-create(?:-[a-z0-9-]+)?$/);
 assert.ok(['https://github.com/Mk-arch2030/ViP-Clinic-.git','git@github.com:Mk-arch2030/ViP-Clinic-.git'].includes(git('remote','get-url','origin')));
 git('merge-base','--is-ancestor','25fc7ab800a9073152ea50c9447e3561462e6ce2','HEAD');
 assert.notEqual(fs.realpathSync(repo),path.join(os.homedir(),'ViP-Clinic-'),'Use a separate verification checkout');
 const root=path.join(os.homedir(),'roby-stage7-pg-c1');
 const expected={root,data:path.join(root,'data'),socket:path.join(root,'socket'),port:55437};
 guards.preflightCluster(expected);
 return {repo,git,expected,head:args[1]};
}
async function run(args) {
 const {repo,git,expected,head}=preflight(args);
 const {Client,Pool}=require('pg');
 const database='roby_stage7_c2_'+randomBytes(10).toString('hex');
 const options=db=>({host:expected.socket,port:expected.port,database:db,user:os.userInfo().username,password:async()=>'',ssl:false,
  options:'-c search_path=pg_catalog,public -c statement_timeout=10000 -c lock_timeout=5000',connectionTimeoutMillis:5000,max:12});
 async function identity(c,db) {
 const row=(await c.query(`SELECT current_database() AS database,current_setting('data_directory') AS data_directory,
 current_setting('unix_socket_directories') AS socket_directories,current_setting('port') AS port,
 current_setting('listen_addresses') AS listen_addresses,current_setting('search_path') AS search_path,
 current_setting('server_version_num') AS version,inet_server_addr()::text AS address,
 (pg_control_system()).system_identifier::text AS system_identifier`)).rows[0];
 return guards.validateIdentity(row,expected,db);
 }
 phase='ISOLATED_CLUSTER_IDENTITY';
 const admin=new Client(options('postgres'));let systemId;
 await admin.connect();
 try {
 systemId=await identity(admin,'postgres');
 assert.equal((await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[database])).rows.length,0);
 // Identifier is internally generated lowercase hex only, never caller-controlled.
 phase='NEW_DISPOSABLE_DATABASE_CREATION';
 await admin.query(`CREATE DATABASE ${database} TEMPLATE template0`);
 }finally{await admin.end();}
 console.log('NEW_DISPOSABLE_DATABASE='+database);console.log('SOURCE_HEAD='+head);console.log('SYSTEM_IDENTIFIER='+systemId);
 phase='NEW_DISPOSABLE_SCHEMA';
 const pool=new Pool(options(database));let receiptFailure=false,ackLoss=false;
 try {
 const c=await pool.connect();
 try {
 assert.equal(await identity(c,database),systemId);
 assert.equal((await c.query("SELECT count(*)::int AS n FROM pg_class WHERE relnamespace='public'::regnamespace")).rows[0].n,0);
 await c.query('SET search_path=public');
 await c.query(fs.readFileSync(path.join(repo,'backend/persistence/schema.sql'),'utf8'));
 await c.query(fs.readFileSync(path.join(repo,'backend/persistence/auth-schema.sql'),'utf8'));
 const up=fs.readFileSync(path.join(repo,'backend/persistence/migrations/002-case-visit-foundation.sql'),'utf8');
 const down=fs.readFileSync(path.join(repo,'backend/persistence/migrations/002-case-visit-foundation.down.sql'),'utf8');
 await c.query(up);await c.query(down);await c.query(up);console.log('EMPTY_ROLLBACK_AND_REAPPLY=PASS');
 await c.query(`INSERT INTO public.actors(actor_id,actor_role) VALUES ($1,'DOCTOR'),($2,'NURSE'),($3,'DOCTOR')`,[DOCTOR,NURSE,SECOND_DOCTOR]);
 await c.query(`INSERT INTO public.patients(patient_id,clinic_patient_number,name,profession,phone,gender)
 VALUES ($1,'CPN-SYNTHETIC-C2','Synthetic C2 Patient','Synthetic','000','Male')`,[PATIENT]);
 const {createVerifier}=require('../auth/password-verifier');
 const verifier=await createVerifier(password);
 for(const [id,label] of [[DOCTOR,'SYN/DOCTOR'],[NURSE,'SYN/NURSE'],[SECOND_DOCTOR,'SYN/SECOND']]) await c.query(`INSERT INTO vip_auth.credentials
 (actor_id,login_label,verifier,version,enabled) VALUES ($1,$2,$3,1,true)`,[id,label,verifier]);
 await c.query("INSERT INTO vip_auth.operating_mode VALUES (true,'DOCTOR_NURSE')");
 }finally{c.release();}
 async function preserved() {
 const out={};for(const table of ['public.patients','public.clinic_days','vip_clinical.visits','vip_clinical.lifecycle_facts'])
 out[table]=(await pool.query(`SELECT * FROM ${table}`)).rows;
 out.cpn=(await pool.query('SELECT last_value::text,is_called FROM public.clinic_patient_number_seq')).rows;
 return out;
 }
 const before=await preserved();
 const wrappedPool={connect:async()=>{const client=await pool.connect();return {
 query:async(sql,values)=>{
  if(receiptFailure&&sql.includes('INSERT INTO vip_clinical.operation_receipts')) {receiptFailure=false;await client.query('SELECT 1/0');}
  const r=await client.query(sql,values);
  if(ackLoss&&sql==='COMMIT'){ackLoss=false;throw Error('Synthetic transport failure after actual COMMIT');}
  return r;
 },release:()=>client.release()};}};
 const {AuthRepository}=require('../persistence/auth-repository');
 const {createAuthService}=require('../auth/auth-service');
 const {dummy}=require('../auth/test-harness.cjs');
 let now=Date.now();
 const auth=createAuthService({store:new AuthRepository(wrappedPool),dummyVerifier:dummy,clock:()=>now});
 const h={auth,advance:ms=>{now+=ms;},failReceipt:()=>{receiptFailure=true;},loseAck:()=>{ackLoss=true;},
 clinicalSnapshot:async()=>({cases:(await pool.query('SELECT * FROM vip_clinical.cases ORDER BY case_id')).rows,receipts:(await pool.query('SELECT * FROM vip_clinical.operation_receipts ORDER BY actor_id,operation_id')).rows}),
 count:async id=>(await pool.query('SELECT count(*)::int AS n FROM vip_clinical.operation_receipts WHERE operation_id=$1',[id])).rows[0].n,
 caseCount:async()=>(await pool.query('SELECT count(*)::int AS n FROM vip_clinical.cases')).rows[0].n};
 let passed=0;
 for(const [name,scenario] of scenarios){phase='CASE_CREATE_SCENARIO';console.log('PG_SCENARIO_BEGIN='+name);await scenario(h);passed++;console.log('PG_SCENARIO_PASS='+name);}
 // Actual API -> auth -> shared PostgreSQL transaction, not a browser claim.
 phase='API_REAL_PG';
 await require('./case-create-api-proof.cjs').proveCaseCreateApi(h);
 console.log('API_TO_REAL_PG=PASS');
 assert.deepEqual(await preserved(),before);console.log('NO_VISIT_DAY_CPN_HISTORY_EFFECT=PASS');
 phase='CONSTRAINTS_AND_ROLLBACK';
 const c2=await pool.connect();
 try {
 for(const sql of ['UPDATE vip_clinical.operation_receipts SET schema_version=1','DELETE FROM vip_clinical.operation_receipts','TRUNCATE vip_clinical.operation_receipts','UPDATE vip_clinical.lifecycle_facts SET policy_version=policy_version']) {
 await c2.query('BEGIN');await assert.rejects(c2.query(sql),e=>e.code==='55000');await c2.query('ROLLBACK');
 }
 await c2.query('BEGIN');await assert.rejects(c2.query(`INSERT INTO vip_clinical.cases(case_id,patient_id,created_by,problem_summary,created_at)
 VALUES ('77777777-7777-4777-8777-777777777777','99999999-9999-4999-8999-999999999999',$1,'Synthetic',clock_timestamp())`,[DOCTOR]),e=>e.code==='23503');await c2.query('ROLLBACK');
 const count=await h.caseCount();
 await assert.rejects(c2.query(fs.readFileSync(path.join(repo,'backend/persistence/migrations/002-case-visit-foundation.down.sql'),'utf8')),
 e=>e.code==='P0001' && e.message==='Refusing to remove nonempty clinical foundation');
 await c2.query('ROLLBACK');assert.equal(await h.caseCount(),count);
 }finally{c2.release();}
 assert.equal(git('status','--porcelain'),'');console.log('PG_SCENARIOS='+passed);console.log('REAL_PG_CASE_CREATE=PASS');
 console.log('RETAINED_DATABASE='+database);console.log('BROWSER_PROOF=NOT_RUN');
 }finally{await pool.end();}
}
if(require.main===module) run(process.argv.slice(2)).catch(error=>{console.error('FAILED_PHASE='+phase);console.error('ERROR_TYPE='+String(error.code || error.name).replace(/[^A-Za-z0-9_]/g,''));console.error('REAL_PG_CASE_CREATE=FAIL_OR_BLOCKED; no automatic cleanup; only a database named by NEW_DISPOSABLE_DATABASE may have been created');process.exitCode=1;});
module.exports={preflight,run};
