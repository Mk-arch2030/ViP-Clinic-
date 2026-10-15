'use strict';
// Shared API-injection assertions. SQL proof only when invoked with the real PG harness.
const assert=require('node:assert/strict');
const Fastify=require('fastify');
const {context,request}=require('./case-create-scenarios.cjs');
const {composeSecuredPatients}=require('../api/secured-patient-composition');
async function proveCaseCreateApi(h) {
 const c=await context(h),nurse=await context(h,'SYN/NURSE'),app=Fastify();
 await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:'https://vip.synthetic.invalid',enableCaseCreate:true});
 try {
  const headers={origin:'https://vip.synthetic.invalid','content-type':'application/json',cookie:'__Host-vip_session='+c.token,'x-csrf-token':c.csrf};
  const body=request();
  const created=await app.inject({method:'POST',url:'/clinical/cases',headers,payload:body});
  assert.equal(created.statusCode,200);
  const before=await h.caseCount(),receipts=await h.count(body.operationId);
  const snapshot=await h.clinicalSnapshot();
  for(const [patch,expected] of [
   [{cookie:''},401],
   [{cookie:'__Host-vip_session='+nurse.token,'x-csrf-token':nurse.csrf},403],
   [{'x-csrf-token':'bad'},403],
   [{origin:'https://evil.invalid'},403],
   [{'sec-fetch-site':'cross-site'},403]
  ]) {
   const deniedCreate=await app.inject({method:'POST',url:'/clinical/cases',headers:{...headers,...patch},payload:request()});
   assert.equal(deniedCreate.statusCode,expected);
   const denied=await app.inject({method:'POST',url:'/clinical/cases/receipt',headers:{...headers,...patch},payload:{operationId:body.operationId}});
   assert.equal(denied.statusCode,expected);
   assert.equal(denied.body.includes(created.json().result.caseId),false);
   assert.equal(denied.json().result,undefined);
  }
  assert.equal(await h.caseCount(),before);assert.equal(await h.count(body.operationId),receipts);
  assert.deepEqual(await h.clinicalSnapshot(),snapshot);
  const recovered=await app.inject({method:'POST',url:'/clinical/cases/receipt',headers,payload:{operationId:body.operationId}});
  assert.equal(recovered.statusCode,200);assert.deepEqual(recovered.json(),created.json());
  const replay=await app.inject({method:'POST',url:'/clinical/cases',headers,payload:body});
  assert.equal(replay.statusCode,200);assert.deepEqual(replay.json(),created.json());
  const conflict=await app.inject({method:'POST',url:'/clinical/cases',headers,payload:{...body,problemSummary:'Changed intent'}});
  assert.equal(conflict.statusCode,409);
  await h.auth.logout(c.token,c.csrf);
  const revoked=await app.inject({method:'POST',url:'/clinical/cases/receipt',headers,payload:{operationId:body.operationId}});
  assert.equal(revoked.statusCode,401);assert.equal(revoked.json().result,undefined);
  const fresh=await context(h);
  const restored=await app.inject({method:'POST',url:'/clinical/cases/receipt',headers:{...headers,cookie:'__Host-vip_session='+fresh.token,'x-csrf-token':fresh.csrf},payload:{operationId:body.operationId}});
  assert.equal(restored.statusCode,200);assert.deepEqual(restored.json(),created.json());
  assert.equal(await h.caseCount(),before);assert.equal(await h.count(body.operationId),receipts);
  assert.deepEqual(await h.clinicalSnapshot(),snapshot);
 }finally{await app.close();}
}
module.exports={proveCaseCreateApi};
