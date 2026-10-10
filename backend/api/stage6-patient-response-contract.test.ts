import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createWebApi, TEST_ORIGIN, ApiFailure } from '../../src/integration/web-api-client';
const require = createRequire(import.meta.url);
const Fastify = require('fastify');
const { composeSecuredPatients } = require('./secured-patient-composition');
const { makeHarness } = require('../auth/test-harness.cjs');
const { login, password } = require('../auth/test-service-contract.cjs');
const input = { name:'Stage6 Response Synthetic',dateOfBirth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male' as const };
async function setup(role = 'SYN/DOCTOR') {
  const h = makeHarness();
  const calls: { sql:string; values:unknown[] }[] = [];
  let inserted: Record<string,unknown> | undefined;
  let failInsert = false;
  h.store.client = { async query(sql:string,values:unknown[] = []) {
    calls.push({sql,values});
    if (sql.includes('nextval')) return {rows:[{clinic_patient_number:'CPN-1'}]};
    if (sql.includes('INSERT INTO patients')) {
      if (failInsert) throw new Error('private infrastructure diagnostic');
      inserted = {patient_id:values[0],clinic_patient_number:values[1],name:values[2],date_of_birth:values[3],profession:values[4],phone:values[5],gender:values[6]};
      return {rows:[{...inserted,internal_secret:'must never escape'}]};
    }
    if (sql.includes('FROM patients')) return {rows: inserted && values[0] === inserted.patient_id ? [{...inserted}] : []};
    return {rows:[]};
  }};
  const app=Fastify({logger:false});
  await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:TEST_ORIGIN});
  const {token}=await login(h,role);
  const {csrf}=await h.auth.current(token);
  const fetcher: typeof fetch = async (url,init) => {
    const headers=Object.fromEntries(new Headers(init?.headers));
    headers.origin=TEST_ORIGIN; headers.cookie='__Host-vip_session='+token;
    const r=await app.inject({method:init?.method ?? 'GET',url:String(url),headers,...(init?.body ? {payload:String(init.body)} : {})});
    return new Response(r.statusCode===204?null:r.body,{status:r.statusCode,headers:{'content-type':r.headers['content-type']??'application/json'}});
  };
  return {store:h.store,app,calls,csrf,api:createWebApi({origin:TEST_ORIGIN,fetcher}),inserted:()=>inserted,failInsert:()=>{failInsert=true;}};
}

test('actual secured POST response survives the actual Web adapter and UUID GET with one allocation/INSERT',async()=>{
 const h=await setup();
 try{
  const patient=await h.api.register(input,h.csrf);
  assert.equal(patient.patientId,h.inserted()!.patient_id);
  assert.equal(patient.clinicPatientNumber,'CPN-1');
  assert.equal(patient.name,input.name);
  assert.equal(patient.dateOfBirth,input.dateOfBirth);
  assert.equal(Object.hasOwn(patient,'internal_secret'),false);
  const retrieved=await h.api.retrieve(patient.patientId);
  assert.deepEqual(retrieved,patient);
  assert.equal(h.calls.filter(c=>c.sql.includes('nextval')).length,1);
  assert.equal(h.calls.filter(c=>c.sql.includes('INSERT INTO patients')).length,1);
  assert.equal(h.app.server.listening,false);
 }finally{await h.app.close();}
});

test('valid Nurse and wrong CSRF deny before allocation through the real adapter',async()=>{
 for(const role of ['SYN/NURSE','SYN/DOCTOR']){
  const h=await setup(role);
  try{
   await assert.rejects(h.api.register(input,role==='SYN/DOCTOR'?'A'.repeat(43):h.csrf),(e:unknown)=>e instanceof ApiFailure && e.kind==='forbidden');
   assert.equal(h.calls.length,0);
  }finally{await h.app.close();}
 }
});

test('business insertion failure returns generic failure and rolls back savepoint without a success DTO',async()=>{
 const h=await setup();
 try{
  h.failInsert();
  await assert.rejects(h.api.register(input,h.csrf),(e:unknown)=>e instanceof ApiFailure && e.kind==='unavailable' && !e.message.includes('private'));
  assert.ok(h.calls.some(c=>c.sql==='ROLLBACK TO SAVEPOINT vip_patient_registration'));
  assert.equal(h.inserted(),undefined);
 }finally{await h.app.close();}
});

test('outer transaction failure after INSERT/savepoint success cannot return HTTP 201',async()=>{
 const h=await setup();
 try{
  const original=h.store.transaction.bind(h.store);
  h.store.transaction=(work: (tx:unknown)=>Promise<unknown>)=>original(async(tx:unknown)=>{
   await work(tx); throw new Error('private COMMIT failure');
  });
  await assert.rejects(h.api.register(input,h.csrf),(e:unknown)=>e instanceof ApiFailure && e.status===503 && e.kind==='unavailable');
  assert.ok(h.calls.some(c=>c.sql==='RELEASE SAVEPOINT vip_patient_registration'));
  // Fake client records an INSERT, but this is not a real PostgreSQL rollback proof.
  assert.equal(h.calls.filter(c=>c.sql.includes('INSERT INTO patients')).length,1);
 }finally{await h.app.close();}
});
