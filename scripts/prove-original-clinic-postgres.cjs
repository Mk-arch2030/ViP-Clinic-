'use strict';
// Explicit new synthetic database only. Never accepts the owner's proof DB name.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {randomBytes}=require('node:crypto');
async function prove(args=process.argv.slice(2)){
 assert.equal(args.length,4,'Token /absolute/socket /absolute/data user required');
 const [token,socket,data,user]=args;
 assert.equal(token,'ROBY_ORIGINAL_CLINIC_SYNTHETIC_DB_PROOF');
 for(const dir of [socket,data]){assert.ok(path.isAbsolute(dir));assert.equal(fs.realpathSync(dir),dir);}
 assert.notEqual(data,path.resolve(process.env.HOME??'/','vip-intake-proof-stage6-isolated/data'));
 assert.notEqual(data,path.resolve(process.env.HOME??'/','vip-retrieve-proof-isolated/data'));
 const {Pool}=require('pg');
 const pool=new Pool({host:socket,port:55449,database:'roby_original_unification_proof',user,password:'',max:4,
  options:'-c search_path=pg_catalog,public -c statement_timeout=10000 -c lock_timeout=5000',connectionTimeoutMillis:5000});
 let app;
 try{
  const client=await pool.connect();
  try{
   const identity=(await client.query("SELECT current_database() AS database,current_setting('data_directory') AS data,current_setting('unix_socket_directories') AS socket,current_setting('listen_addresses') AS tcp,current_setting('port') AS port")).rows[0];
   assert.deepEqual(identity,{database:'roby_original_unification_proof',data,socket,tcp:'',port:'55449'});
   const existing=(await client.query("SELECT count(*)::int AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname IN ('public','vip_auth')")).rows[0];
   assert.equal(existing.count,0,'New empty synthetic database required; never reset an existing DB');
   await client.query(fs.readFileSync(path.join(__dirname,'../backend/persistence/schema.sql'),'utf8'));
   await client.query(fs.readFileSync(path.join(__dirname,'../backend/persistence/auth-schema.sql'),'utf8'));
   await client.query(fs.readFileSync(path.join(__dirname,'../backend/persistence/migrations/001-patient-intake.sql'),'utf8'));
  }finally{client.release();}
  const {createVerifier}=require('../backend/auth/password-verifier');
  const {createAuthService}=require('../backend/auth/auth-service');
  const {AuthRepository}=require('../backend/persistence/auth-repository');
  const doctor='11111111-1111-4111-8111-111111111111',nurse='22222222-2222-4222-8222-222222222222';
  const key=randomBytes(24).toString('base64url');
  const verifier=await createVerifier(key);
  for(const [id,role,label]of [[doctor,'DOCTOR','SYN/UNIFY/DOCTOR'],[nurse,'NURSE','SYN/UNIFY/NURSE']]){
   await pool.query('INSERT INTO public.actors(actor_id,actor_role) VALUES ($1,$2)',[id,role]);
   await pool.query('INSERT INTO vip_auth.credentials(actor_id,login_label,verifier,version,enabled) VALUES ($1,$2,$3,1,true)',[id,label,verifier]);
  }
  await pool.query("INSERT INTO vip_auth.operating_mode VALUES (true,'DOCTOR_ONLY')");
  const auth=createAuthService({store:new AuthRepository(pool),dummyVerifier:await createVerifier(randomBytes(24).toString('base64url'))});
  app=require('fastify')({logger:false});
  await require('../backend/api/secured-patient-composition').composeSecuredPatients(app,{auth,trustedOrigin:'https://127.0.0.1:3443'});
  await app.ready();assert.equal(app.server.listening,false);
  const login=await auth.login({loginLabel:'SYN/UNIFY/DOCTOR',password:key,source:'synthetic-proof'});
  const current=await auth.current(login.token);
  const headers={origin:'https://127.0.0.1:3443','content-type':'application/json',cookie:'__Host-vip_session='+login.token,'x-csrf-token':current.csrf};
  const {createWebApi,TEST_ORIGIN}=require('../src/integration/web-api-client.ts');
  const fetcher=async(url,options={})=>{
   const response=await app.inject({method:options.method??'GET',url:String(url),headers:{...headers,...options.headers},payload:options.body});
   return new Response(response.statusCode===204?null:response.body,{status:response.statusCode,headers:response.headers});
  };
  const api=createWebApi({origin:TEST_ORIGIN,fetcher});
  const history={chronicIllnesses:['Synthetic hypertension','Synthetic diabetes'],knownAllergies:['Synthetic allergy'],surgicalHistory:['Synthetic surgery'],familyHistory:['Synthetic family'],lifestyleNotes:'Synthetic lifestyle — عربي'};
  const input={name:'SYN Unification Patient A',dateOfBirth:'1990-02-01',profession:'',phone:'0000',gender:'Male',pastHistory:history};
  const patient=await api.register(input,current.csrf);
  assert.deepEqual(patient.pastHistory,history);assert.equal(patient.profession,'');assert.match(patient.patientId,/^[0-9a-f-]{36}$/);assert.equal(patient.clinicPatientNumber,'CPN-1');
  assert.deepEqual((await api.retrieveIntake(patient.patientId)),patient);
  const search=await api.search('cpn',patient.clinicPatientNumber);assert.equal(search.patients[0].patientId,patient.patientId);
  const fresh=createWebApi({origin:TEST_ORIGIN,fetcher});assert.deepEqual(await fresh.retrieveIntake(patient.patientId),patient);
  const {ConnectedPatientSession}=require('../src/integration/connected-patient-session.ts');
  const {createProtectedClinicBoundary}=require('../src/integration/clinic-boundary.ts');
  const model=new ConnectedPatientSession(fresh);await model.refresh();const boundary=createProtectedClinicBoundary(model);
  await boundary.search('SYN Unification');assert.equal((await boundary.retrieve(patient.patientId)).patientId,patient.patientId);
  assert.deepEqual(boundary.getState().patients.find(p=>p.patientId===patient.patientId).pastHistory,history);
  model.dispose();
  console.log('REAL_POSTGRES_INTAKE_HISTORY_CPN_UUID_SEARCH_FRESH_CLIENT_AND_ORIGINAL_BOUNDARY=PASS');
  const counts=async()=> (await pool.query('SELECT (SELECT count(*)::int FROM patients) AS patients,(SELECT count(*)::int FROM patient_intakes) AS intakes,(SELECT count(*)::int FROM past_history_items) AS history')).rows[0];
  const before=await counts();
  await pool.query("CREATE FUNCTION public.unify_reject_history() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Synthetic rollback'; END $$");
  await pool.query('CREATE TRIGGER unify_reject_history BEFORE INSERT ON public.past_history_items FOR EACH ROW EXECUTE FUNCTION public.unify_reject_history()');
  await assert.rejects(api.register({...input,name:'SYN Rollback'},current.csrf));assert.deepEqual(await counts(),before);
  await pool.query('DROP TRIGGER unify_reject_history ON public.past_history_items');await pool.query('DROP FUNCTION public.unify_reject_history()');
  console.log('REAL_POSTGRES_HISTORY_FAILURE_ROLLS_BACK_PATIENT_AND_MARKER=PASS');
  const concurrent=await Promise.all([api.register({...input,name:'SYN Concurrent A'},current.csrf),api.register({...input,name:'SYN Concurrent B'},current.csrf)]);
  assert.equal(new Set(concurrent.map(p=>p.patientId)).size,2);assert.equal(new Set(concurrent.map(p=>p.clinicPatientNumber)).size,2);
  console.log('REAL_POSTGRES_CONCURRENT_DISTINCT_UUID_AND_CPN=PASS');
  const nurseLogin=await auth.login({loginLabel:'SYN/UNIFY/NURSE',password:key,source:'synthetic-nurse'});
  const nurseSession=await auth.current(nurseLogin.token);
  const denied=await app.inject({method:'POST',url:'/patients/intake',headers:{...headers,cookie:'__Host-vip_session='+nurseLogin.token,'x-csrf-token':nurseSession.csrf},payload:input});assert.equal(denied.statusCode,403);
  assert.equal((await app.inject({url:'/patients/'+patient.patientId+'/intake'})).statusCode,401);
  console.log('REAL_POSTGRES_NURSE_AND_UNAUTHENTICATED_DENIAL=PASS');
  let attempts=0;
  const uncertain=new ConnectedPatientSession(createWebApi({origin:TEST_ORIGIN,fetcher:async(url,options)=>{if(String(url)==='/patients/intake'){attempts++;await fetcher(url,options);throw new Error('Synthetic lost response');}return fetcher(url,options);}}));
  await uncertain.refresh();const unconfirmed=createProtectedClinicBoundary(uncertain);await unconfirmed.registerPatient({...input,name:'SYN Lost Response'});await uncertain.refresh();await unconfirmed.registerPatient({...input,name:'SYN Lost Response'});
  assert.equal(attempts,1);assert.equal((await pool.query("SELECT count(*)::int AS count FROM patients WHERE name='SYN Lost Response'")).rows[0].count,1);uncertain.dispose();
  console.log('REAL_COMMIT_LOST_RESPONSE_BLOCKS_DUPLICATE_RETRY=PASS');
  await api.logout(current.csrf);assert.equal((await app.inject({url:'/patients/'+patient.patientId+'/intake',headers})).statusCode,401);
  const readback=await pool.query('SELECT patient_id FROM patients WHERE patient_id=$1',[patient.patientId]);assert.equal(readback.rows.length,1);
  console.log('LOGOUT_DENIES_OLD_SESSION_AND_PRESERVES_PATIENT=PASS');
  console.log('INTEGRATION_PROOF=PASS_REAL_POSTGRES_18_HTTP_INJECTION_NOT_BROWSER_OR_DEVICE_PROOF');
 }finally{if(app)await app.close();await pool.end();}
}
if(require.main===module)prove().catch(error=>{console.error('INTEGRATION_PROOF=FAIL');console.error('ERROR_TYPE='+error.name);if(error instanceof assert.AssertionError)console.error('CHECK='+String(error.message).split('\n')[0]);else if(error.code)console.error('ERROR_CODE='+error.code);process.exitCode=1;});
module.exports={prove};
