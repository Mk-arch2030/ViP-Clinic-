'use strict';
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { createCaseService } = require('../../application/services/create-case');
const { login, fail } = require('../auth/test-service-contract.cjs');
const SECOND_DOCTOR = '44444444-4444-4444-8444-444444444444';
const PATIENT = '55555555-5555-4555-8555-555555555555';
const request = () => ({ operationId: randomUUID(), patientId: PATIENT, problemSummary: 'Synthetic complaint' });
async function context(h, label) { const {token}=await login(h,label); return { token, csrf:(await h.auth.current(token)).csrf }; }
const scenarios = [
 ['atomic create, identical replay and receipt recovery preserve one result', async h => {
   const s=createCaseService(h.auth), c=await context(h), b=request();
   const r=await s.create(c,b); assert.equal(r.status,'COMMITTED'); assert.equal(r.result.lifecycle,'OPEN');
   assert.equal(r.result.lifecycleVersion,0); assert.equal(r.result.patientId,PATIENT);
   assert.deepEqual(await s.create(c,{...b}),r); assert.deepEqual(await s.recover(c,{operationId:b.operationId}),r);
   assert.equal(await h.count(b.operationId),1);
 }],
 ['changed intent conflicts and receipt lookup is actor-bound', async h => {
   const s=createCaseService(h.auth), c=await context(h), b=request(); await s.create(c,b);
   await assert.rejects(s.create(c,{...b,problemSummary:'Different meaning'}),fail(409));
   assert.equal(await h.count(b.operationId),1);
   const other=await context(h,'SYN/SECOND');
   assert.deepEqual(await s.recover(other,{operationId:b.operationId}),{status:'UNKNOWN'});
 }],
 ['missing patient denies without partial Case or receipt', async h => {
   const s=createCaseService(h.auth), c=await context(h), b={...request(),patientId:randomUUID()};
   await assert.rejects(s.create(c,b),fail(404)); assert.equal(await h.count(b.operationId),0);
 }],
 ['Nurse, missing session and wrong CSRF cannot create or recover', async h => {
   const s=createCaseService(h.auth), c=await context(h), nurse=await context(h,'SYN/NURSE'), b=request();
   for (const [ctx,code] of [[nurse,403],[{},401],[{...c,csrf:'wrong'},403]]) {
     await assert.rejects(s.create(ctx,b),fail(code));
     await assert.rejects(s.recover(ctx,{operationId:b.operationId}),fail(code));
   }
   assert.equal(await h.count(b.operationId),0);
 }],
 ['revoked and expired sessions cannot replay committed receipts', async h => {
   const s=createCaseService(h.auth), c=await context(h), b=request(); await s.create(c,b);
   await h.auth.logout(c.token,c.csrf);
   await assert.rejects(s.create(c,b),fail(401)); await assert.rejects(s.recover(c,{operationId:b.operationId}),fail(401));
   const next=await context(h); assert.equal((await s.recover(next,{operationId:b.operationId})).status,'COMMITTED'); h.advance(900001);
   await assert.rejects(s.recover(next,{operationId:b.operationId}),fail(401));
 }],
 ['strict payload rejects authority injection and malformed intent', async h => {
   const s=createCaseService(h.auth), c=await context(h), b=request();
   for (const bad of [{...b,actorId:randomUUID()},{...b,problemSummary:' '},{...b,problemSummary:'x'.repeat(4001)},
     {...b,problemSummary:'bad\u0000text'},{...b,operationId:'bad'},{...b,patientId:'bad'}]) await assert.rejects(s.create(c,bad),fail(400));
   await assert.rejects(s.recover(c,{operationId:b.operationId,patientId:PATIENT}),fail(400));
 }],
 ['concurrent identical and conflicting requests preserve exactly one effect', async h => {
   const s=createCaseService(h.auth), c=await context(h), b=request();
   const results=await Promise.all(Array.from({length:8},()=>s.create(c,b)));
   for (const r of results) assert.deepEqual(r,results[0]); assert.equal(await h.count(b.operationId),1);
   const other=request(); const race=await Promise.allSettled([s.create(c,other),s.create(c,{...other,problemSummary:'Other'})]);
   assert.equal(race.filter(r=>r.status==='fulfilled').length,1);
   assert.equal(race.find(r=>r.status==='rejected').reason.statusCode,409); assert.equal(await h.count(other.operationId),1);
 }],
 ['receipt insertion failure rolls back Case; same intent can then succeed', async h => {
   const s=createCaseService(h.auth), c=await context(h), b=request(); const before=await h.caseCount();
   h.failReceipt(); await assert.rejects(s.create(c,b),fail(503));
   assert.equal(await h.caseCount(),before); assert.equal(await h.count(b.operationId),0);
   assert.equal((await s.recover(c,{operationId:b.operationId})).status,'UNKNOWN');
   await s.create(c,b); assert.equal(await h.count(b.operationId),1);
 }],
 ['lost acknowledgement after durable COMMIT recovers original result without retry duplication', async h => {
   const s=createCaseService(h.auth), c=await context(h), b=request();
   h.loseAck(); await assert.rejects(s.create(c,b),fail(503));
   assert.equal(await h.count(b.operationId),1);
   const recovered=await s.recover(c,{operationId:b.operationId}); assert.equal(recovered.status,'COMMITTED');
   assert.deepEqual(await s.create(c,b),recovered); assert.equal(await h.count(b.operationId),1);
 }],
 ['unknown receipt does not create a resource or certify rollback', async h => {
   const s=createCaseService(h.auth), c=await context(h), before=await h.caseCount();
   assert.deepEqual(await s.recover(c,{operationId:randomUUID()}),{status:'UNKNOWN'}); assert.equal(await h.caseCount(),before);
 }]
];
module.exports={scenarios,context,request,PATIENT,SECOND_DOCTOR};
