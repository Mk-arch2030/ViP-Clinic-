import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createWebApi, TEST_ORIGIN } from '../../../src/integration/web-api-client';
import { ConnectedPatientSession } from '../../../src/integration/connected-patient-session';
const require=createRequire(import.meta.url);
const {loadDataset}=require('../dataset.cjs');
const {makeHarness}=require('../../auth/test-harness.cjs');
const {login}=require('../../auth/test-service-contract.cjs');
const {composeSecuredPatients}=require('../../api/secured-patient-composition');
const Fastify=require('fastify');
const inputs=loadDataset().extension.patients.slice(0,2).map((p:any)=>({name:p.name,dateOfBirth:p.dateOfBirth,profession:p.profession,phone:p.phone,gender:p.gender,pastHistory:p.pastHistory}));
async function harness(){
 const h=makeHarness();const patients:any[]=[],markers=new Set<string>(),history:any[]=[];let allocations=0;
 h.store.client={async query(sql:string,p:any[]=[]){
  if(sql.includes('nextval'))return {rows:[{clinic_patient_number:'CPN-'+(++allocations)}]};
  if(sql.includes('INSERT INTO patients')){const row=Object.fromEntries(['patient_id','clinic_patient_number','name','date_of_birth','profession','phone','gender'].map((key,i)=>[key,p[i]]));patients.push(row);return {rows:[row]};}
  if(sql.includes('INSERT INTO patient_intakes'))markers.add(p[0]);
  if(sql.includes('INSERT INTO past_history_items'))history.push({patient_id:p[1],category:p[2],position:p[3],content:p[4]});
  if(sql.includes('FROM patients'))return {rows:patients.filter(row=>row.patient_id===p[0])};
  if(sql.includes('FROM patient_intakes'))return {rows:markers.has(p[0])?[{patient_id:p[0]}]:[]};
  if(sql.includes('FROM past_history_items'))return {rows:history.filter(row=>row.patient_id===p[0])};
  return {rows:[]};
 }};
 const app=Fastify();await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:TEST_ORIGIN});
 const signed=await login(h),session=await h.auth.current(signed.token);
 const headers={origin:TEST_ORIGIN,'content-type':'application/json',cookie:'__Host-vip_session='+signed.token,'x-csrf-token':session.csrf};
 const fetcher=(async(url:unknown,options:RequestInit={})=>{const r=await app.inject({method:options.method??'GET',url:String(url),headers:{...headers,...options.headers},payload:options.body});return new Response(r.statusCode===204?null:r.body,{status:r.statusCode,headers:r.headers});}) as typeof fetch;
 return {h,app,headers,session,patients,api:createWebApi({origin:TEST_ORIGIN,fetcher}),fetcher,allocations:()=>allocations};
}
test('HTTP injection with actual extension inputs (fake SQL client, not PostgreSQL proof): same-name patients retain distinct server identity and all supported history',async t=>{
 const f=await harness();t.after(()=>f.app.close());
 const a=await f.api.register(inputs[0],f.session.csrf),b=await f.api.register(inputs[1],f.session.csrf);
 assert.equal(a.name,b.name);assert.notEqual(a.patientId,b.patientId);assert.notEqual(a.clinicPatientNumber,b.clinicPatientNumber);assert.equal(a.profession,'');
 assert.deepEqual(a.pastHistory,inputs[0].pastHistory);assert.deepEqual(b.pastHistory,inputs[1].pastHistory);
 const fresh=createWebApi({origin:TEST_ORIGIN,fetcher:f.fetcher});assert.deepEqual(await fresh.retrieveIntake!(a.patientId),a);assert.deepEqual(await fresh.retrieveIntake!(b.patientId),b);
 assert.equal(f.allocations(),2);assert.equal(f.app.server.listening,false);
});
test('HTTP injection with extension inputs: missing identity, CSRF, Nurse, expiry and logout deny without fixture creation',async t=>{
 const f=await harness();t.after(()=>f.app.close());
 assert.equal((await f.app.inject({method:'POST',url:'/patients/intake',headers:{origin:TEST_ORIGIN,'content-type':'application/json'},payload:inputs[0]})).statusCode,401);
 assert.equal((await f.app.inject({method:'POST',url:'/patients/intake',headers:{...f.headers,'x-csrf-token':'invalid'},payload:inputs[0]})).statusCode,403);
 const nurse=await login(f.h,'SYN/NURSE');const current=await f.h.auth.current(nurse.token);
 assert.equal((await f.app.inject({method:'POST',url:'/patients/intake',headers:{...f.headers,cookie:'__Host-vip_session='+nurse.token,'x-csrf-token':current.csrf},payload:inputs[0]})).statusCode,403);
 const signed=await login(f.h);const csrf=(await f.h.auth.current(signed.token)).csrf;await f.h.auth.logout(signed.token,csrf);
 assert.equal((await f.app.inject({url:'/patients/55555555-5555-4555-8555-555555555555/intake',headers:{cookie:'__Host-vip_session='+signed.token}})).statusCode,401);
 f.h.advance(16*60*1000);await assert.rejects(f.api.register(inputs[0],f.session.csrf));assert.equal(f.patients.length,0);assert.equal(f.allocations(),0);
});
test('actual extension registration payload with lost POST reply uses existing mutation latch and never repeats',async()=>{
 let writes=0;const session={actorIdentityReference:'55555555-5555-4555-8555-555555555555',role:'Doctor',lifecycle:'ACTIVE',csrf:'A'.repeat(43)};
 const api=createWebApi({origin:TEST_ORIGIN,fetcher:(async(url:unknown)=>{if(String(url)==='/auth/session')return new Response(JSON.stringify(session),{headers:{'content-type':'application/json'}});writes++;throw Error('Synthetic committed response lost');}) as typeof fetch});
 const model=new ConnectedPatientSession(api);await model.refresh();await model.register(inputs[0]);await model.refresh();await model.register(inputs[0]);assert.equal(writes,1);assert.equal(model.getSnapshot().session.registrationUnconfirmed,true);model.dispose();
});
