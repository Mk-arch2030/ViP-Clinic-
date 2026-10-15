'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Fastify=require('fastify');
const {makeHarness}=require('../auth/test-harness.cjs');
const {scenarios,context,request,PATIENT,SECOND_DOCTOR}=require('./case-create-scenarios.cjs');
const {composeSecuredPatients}=require('../api/secured-patient-composition');
function harness() {
 const h=makeHarness();
 h.store.state.actors.push({actor_id:SECOND_DOCTOR,actor_role:'DOCTOR',lifecycle_state:'ACTIVE'});
 h.store.state.credentials.push({...h.store.state.credentials[0],actor_id:SECOND_DOCTOR,login_label:'SYN/SECOND'});
 h.store.state.cases=[];h.store.state.receipts=[];
 let fail=false,lose=false;
 h.store.client={query:async(sql,v)=>{
  const s=h.store.state;
  if(sql.includes('SELECT * FROM vip_clinical.operation_receipts')) return {rows:s.receipts.filter(r=>r.actor_id===v[0]&&r.operation_id===v[1])};
  if(sql.includes('SELECT patient_id FROM public.patients')) return {rows:v[0]===PATIENT?[{patient_id:PATIENT}]:[]};
  if(sql.includes('INSERT INTO vip_clinical.cases')) {const r={case_id:v[0],patient_id:v[1],created_at:new Date()};s.cases.push(r);return {rows:[r]};}
  if(sql.includes('INSERT INTO vip_clinical.operation_receipts')) {
   if(fail){fail=false;throw Error('Synthetic receipt failure');}
   s.receipts.push({actor_id:v[0],operation_id:v[1],operation_kind:'CASE_CREATE',schema_version:1,meaning_fingerprint:v[2],case_id:v[3],resulting_version:0,committed_result:JSON.parse(v[4]),event_id:null,visit_id:null});return {rows:[]};
  }
  throw Error('Unexpected SQL: '+sql);
 }};
 const transaction=h.store.transaction.bind(h.store);
 h.store.transaction=async work=>{const r=await transaction(work);if(lose){lose=false;throw Error('Synthetic lost acknowledgement');}return r;};
 return {...h,count:async id=>h.store.state.receipts.filter(r=>r.operation_id===id).length,caseCount:async()=>h.store.state.cases.length,
 clinicalSnapshot:async()=>structuredClone({cases:h.store.state.cases,receipts:h.store.state.receipts}),
 failReceipt:()=>{fail=true;},loseAck:()=>{lose=true;}};
}
for(const [name,run] of scenarios) test('MEMORY MODEL (not PostgreSQL): '+name,()=>run(harness()));
test('API opt-in, origin, media type, session, CSRF and bounded results',async()=>{
 const h=harness(),c=await context(h),app=Fastify();
 await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:'https://vip.synthetic.invalid',enableCaseCreate:true});
 try {
 const headers={origin:'https://vip.synthetic.invalid','content-type':'application/json',cookie:'__Host-vip_session='+c.token,'x-csrf-token':c.csrf};
 const body=request();
 for(const [patch,expected] of [[{origin:'https://evil.invalid'},403],[{'sec-fetch-site':'cross-site'},403],[{'content-type':'text/plain'},415],[{'x-csrf-token':'bad'},403],[{cookie:''},401]]) {
 const r=await app.inject({method:'POST',url:'/clinical/cases',headers:{...headers,...patch},payload:JSON.stringify(body)});assert.equal(r.statusCode,expected);
 }
 const r=await app.inject({method:'POST',url:'/clinical/cases',headers,payload:body});assert.equal(r.statusCode,200);assert.equal(r.headers['cache-control'],'no-store');
 const recovered=await app.inject({method:'POST',url:'/clinical/cases/receipt',headers,payload:{operationId:body.operationId}});assert.deepEqual(recovered.json(),r.json());
 }finally{await app.close();}
 const closed=Fastify();await composeSecuredPatients(closed,{auth:h.auth,trustedOrigin:'https://vip.synthetic.invalid'});
 assert.equal((await closed.inject({method:'POST',url:'/clinical/cases',payload:request()})).statusCode,404);await closed.close();
});

test('shared API proof: denied create/recovery, replay, conflict and reauthentication',()=>
 require('./case-create-api-proof.cjs').proveCaseCreateApi(harness()));

test('PostgreSQL proof runner refuses absent or invalid explicit authorization before database access',()=>{
 const {preflight}=require('./postgres-case-create-proof.cjs');
 for(const args of [[],['WRONG','0'.repeat(40)],['ROBY_C2_NEW_DISPOSABLE','short']]) assert.throws(()=>preflight(args));
});
