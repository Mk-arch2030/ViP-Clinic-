'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {authorize, resolveActor} = require('./authorization');
const doctor = resolveActor({actor_id:'doctor',actor_role:'DOCTOR',lifecycle_state:'ACTIVE'});
const nurse = resolveActor({actor_id:'nurse',actor_role:'NURSE',lifecycle_state:'ACTIVE'});
const context = (mode='FULL', capabilities=[]) => ({mode:'DOCTOR_NURSE',
  delegation:{nurse_id:'nurse',doctor_id:'doctor',mode,capabilities},
  grantor:{actor_id:'doctor',actor_role:'DOCTOR',lifecycle_state:'ACTIVE'}});
const denied = fn => assert.throws(fn, e => e.statusCode === 403);
test('Doctor VISIT_START requires an authorized clinic mode',()=>{
  for(const mode of ['DOCTOR_ONLY','DOCTOR_NURSE']) authorize(doctor,'VISIT_START',{mode});
  denied(()=>authorize(doctor,'VISIT_START',{mode:'unknown'}));
});
for(const mode of ['FULL','LIMITED']) {
 test(`${mode}: explicit VISIT_START required, CASE_CREATE still forbidden`,()=>{
  for(const grants of [[],['ARRIVAL'],['PATIENT_DATA_RECORDING'],['ARRIVAL','PATIENT_DATA_RECORDING','EXIT','DOCTOR_NOTIFICATION']])
   denied(()=>authorize(nurse,'VISIT_START',context(mode,grants)));
  authorize(nurse,'VISIT_START',context(mode,['VISIT_START']));
  denied(()=>authorize(nurse,'CASE_CREATE',context(mode,['VISIT_START'])));
 });
}
test('invalid, removed, mismatched or inactive delegation cannot authorize Visit recording',()=>{
 for(const mutate of [c=>c.mode='DOCTOR_ONLY',c=>c.delegation=null,
  c=>c.delegation.nurse_id='other',c=>c.delegation.doctor_id='other',
  c=>c.grantor.lifecycle_state='DEACTIVATED',c=>c.grantor.actor_role='NURSE',
  c=>c.delegation.capabilities.push('VISIT_START'),c=>c.delegation.capabilities.push('UNKNOWN'),
  c=>c.delegation.mode='invalid']) {
  const c=context('FULL',['VISIT_START']);mutate(c);denied(()=>authorize(nurse,'VISIT_START',c));
 }
});
test('legacy FULL retains its four original permissions',()=>{
 for(const op of ['ARRIVAL','PATIENT_DATA_RECORDING','EXIT','DOCTOR_NOTIFICATION']) authorize(nurse,op,context());
});
test('authenticated transaction rechecks explicit grant and session/CSRF on every call (memory store)',async()=>{
 const {makeHarness}=require('./test-harness.cjs');
 const {login,fail}=require('./test-service-contract.cjs');
 const h=makeHarness(); await h.mode('DOCTOR_NURSE');
 const {token}=await login(h,'SYN/NURSE');
 const {csrf}=await h.auth.current(token);
 let effects=0;
 const run=(t=token,c=csrf)=>h.auth.withAuthorized(t,'VISIT_START',c,async()=>{effects++;});
 await assert.rejects(run(),fail(403));
 await h.delegation({capabilities:['VISIT_START']});
 await run(); assert.equal(effects,1);
 await assert.rejects(run(token,'wrong'),fail(403));
 await assert.rejects(run(''),fail(401));
 await h.delegation({capabilities:[]});
 await assert.rejects(run(),fail(403));
 await h.delegation({capabilities:['VISIT_START']});
 h.advance(24*60*60*1000);
 await assert.rejects(run(),fail(401));
 assert.equal(effects,1);
});
