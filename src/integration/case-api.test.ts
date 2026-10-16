import test from 'node:test';
import assert from 'node:assert/strict';
import {createCaseApi,parseCaseOutcome} from './case-api';
import {createCaseJournal,CASE_MARKER} from './case-journal';
import {TEST_ORIGIN,ApiFailure} from './web-api-client';
const id='11111111-1111-4111-8111-111111111111',patient='55555555-5555-4555-8555-555555555555';
const intent={operationId:id,patientId:patient,problemSummary:'Synthetic complaint'};
const receipt={status:'COMMITTED',result:{caseId:id,patientId:patient,lifecycle:'OPEN',lifecycleVersion:0,createdAt:'2026-10-16T12:00:00.000Z'}};
function response(value:unknown,status=200){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});}
test('Case transport uses exact accepted payload, same-origin cookies and CSRF; recovery sends only operation ID',async()=>{
 const calls:any[]=[];const api=createCaseApi(TEST_ORIGIN,async(url,options)=>{calls.push([url,options]);return response(receipt);});
 assert.deepEqual(await api.create(intent,'A'.repeat(43)),receipt);await api.recover(id,'A'.repeat(43));
 assert.equal(calls[0][0],'/clinical/cases');assert.deepEqual(JSON.parse(calls[0][1].body),intent);
 assert.equal(calls[0][1].credentials,'same-origin');assert.equal(calls[0][1].redirect,'error');assert.equal(calls[0][1].headers['X-CSRF-Token'],'A'.repeat(43));
 assert.equal(calls[1][0],'/clinical/cases/receipt');assert.deepEqual(JSON.parse(calls[1][1].body),{operationId:id});
});
test('denial and conflict are distinct; server diagnostics never appear in errors',async()=>{
 for(const [status,kind] of [[401,'unauthorized'],[403,'forbidden'],[409,'conflict'],[503,'outcome-unknown']] as const){
  const api=createCaseApi(TEST_ORIGIN,async()=>response({privateDiagnostic:'DO_NOT_EXPOSE'},status));
  await assert.rejects(api.create(intent,'A'.repeat(43)),e=>e instanceof ApiFailure&&e.kind===kind&&!e.message.includes('DO_NOT_EXPOSE'));
 }
});
test('transport loss, malformed success and mismatched patient stay uncertain',async()=>{
 for(const fetcher of [async()=>{throw Error('lost');},async()=>response({status:'UNKNOWN'}),async()=>response({...receipt,result:{...receipt.result,patientId:id}})])
  await assert.rejects(createCaseApi(TEST_ORIGIN,fetcher).create(intent,'A'.repeat(43)),e=>e instanceof ApiFailure&&e.kind==='outcome-unknown');
 assert.throws(()=>parseCaseOutcome({...receipt,result:{...receipt.result,lifecycle:'COMPLETED'}}));
});
test('invalid intent or wrong origin never sends a request',async()=>{
 let sent=0;const fetcher=async()=>{sent++;return response(receipt);};
 for(const summary of ['',' ','x'.repeat(4001),'bad\0text'])await assert.rejects(createCaseApi(TEST_ORIGIN,fetcher).create({...intent,problemSummary:summary},'A'.repeat(43)));
 await assert.rejects(createCaseApi('https://evil.invalid',fetcher).create(intent,'A'.repeat(43)));assert.equal(sent,0);
});
function storage(){const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}} as Storage;}
function locks(){let tail=Promise.resolve();return {request:(_name:string,_options:unknown,work:()=>unknown)=>{const next=tail.then(work);tail=next.then(()=>{},()=>{});return next;}} as unknown as Pick<LockManager,'request'>;}
test('journal serializes tabs, preserves operation across reload and stores no clinical or actor data',async()=>{
 const s=storage(),l=locks();const a=createCaseJournal(()=>s,l,()=>id),b=createCaseJournal(()=>s,l,()=>patient);
 const results=await Promise.allSettled([a.reserve(),b.reserve()]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
 assert.deepEqual(JSON.parse(s.getItem(CASE_MARKER)!),{version:1,kind:'CASE_CREATE',operationId:id});
 assert.equal(createCaseJournal(()=>s,l).read(),id);await assert.rejects(b.releaseConfirmed(patient));
 await a.releaseConfirmed(id);assert.equal(a.read(),null);
});
test('unavailable locks, corrupt marker or storage failure prevents reservation',async()=>{
 const s=storage();await assert.rejects(createCaseJournal(()=>s,undefined).reserve());
 s.setItem(CASE_MARKER,'{}');assert.throws(()=>createCaseJournal(()=>s,locks()).read());
 await assert.rejects(createCaseJournal(()=>{throw Error('denied');},locks()).reserve());
});
