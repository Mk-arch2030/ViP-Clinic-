import test from 'node:test';
import assert from 'node:assert/strict';
import React,{act} from 'react';
import {JSDOM} from 'jsdom';
import {CaseCreatePanel} from './CaseCreatePanel';
import {ConnectedPatientSession} from '../integration/connected-patient-session';
import {TEST_ORIGIN,type WebApi} from '../integration/web-api-client';
import {CASE_MARKER} from '../integration/case-journal';
const dom=new JSDOM('<div id="root"></div>',{url:TEST_ORIGIN});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis.navigator,'locks',{configurable:true,value:{request:async(_n:unknown,_o:unknown,f:()=>unknown)=>f()}});
const {createRoot}=await import('react-dom/client');
const patient={patientId:'55555555-5555-4555-8555-555555555555',clinicPatientNumber:'CPN-7',name:'Synthetic',dateOfBirth:null,profession:'',phone:'000',gender:'Male' as const,pastHistory:null,registeredAt:null};
const result={caseId:'11111111-1111-4111-8111-111111111111',patientId:patient.patientId,lifecycle:'OPEN',lifecycleVersion:0,createdAt:'2026-10-16T12:00:00.000Z'};
async function mount(role:'Doctor'|'Nurse'='Doctor'){
 const api={session:async()=>({actorIdentityReference:result.caseId,role,lifecycle:'ACTIVE',csrf:'A'.repeat(43)}),logout:async()=>{}} as unknown as WebApi;
 const model=new ConnectedPatientSession(api);await model.refresh();const root=createRoot(document.getElementById('root')!);
 await act(async()=>root.render(<CaseCreatePanel patient={patient} model={model} language="en"/>));
 return {model,close:async()=>{await act(async()=>root.unmount());model.dispose();}};
}
async function click(text:string){const b=[...document.querySelectorAll('button')].find(b=>b.textContent===text);assert.ok(b);await act(async()=>b.click());}
async function fill(){await act(async()=>{const t=document.querySelector('textarea')!;Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value')!.set!.call(t,'Synthetic complaint');t.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});}
test('DOM only: repeated click makes one create; remount recovers durable result through API without another create',async()=>{
 dom.window.localStorage.clear();const previous=globalThis.fetch;let creates=0,recovers=0;let finish!:(v:Response)=>void;
 globalThis.fetch=async url=>{if(url==='/clinical/cases'){creates++;return new Promise<Response>(resolve=>{finish=resolve;});}recovers++;return new Response(JSON.stringify({status:'COMMITTED',result}),{headers:{'Content-Type':'application/json'}});};
 let h=await mount();try{
  await fill();await click('Create Case only');assert.equal(creates,1);
  assert.ok(dom.window.localStorage.getItem(CASE_MARKER));
  await click('Recover operation receipt');assert.equal(recovers,0);
  await act(async()=>finish(new Response(JSON.stringify({status:'COMMITTED',result}),{headers:{'Content-Type':'application/json'}})));
  assert.ok(document.body.textContent!.includes(result.caseId));
  await h.close();h=await mount();assert.ok(!document.body.textContent!.includes(result.caseId));
  await click('Recover operation receipt');assert.equal(recovers,1);assert.equal(creates,1);assert.ok(document.body.textContent!.includes(result.caseId));
 }finally{await h.close();globalThis.fetch=previous;}
});
test('DOM only: lost response retains original request identity; Nurse cannot create or recover',async()=>{
 dom.window.localStorage.clear();const previous=globalThis.fetch;const bodies:string[]=[];
 globalThis.fetch=async(_url,options)=>{bodies.push(String(options?.body));throw Error('lost acknowledgement');};
 let h=await mount();try{await fill();await click('Create Case only');await click('Replay identical retained request');assert.equal(bodies.length,2);assert.equal(bodies[0],bodies[1]);
  await h.close();h=await mount('Nurse');await click('Recover operation receipt');assert.equal(bodies.length,2);assert.ok(!document.body.textContent!.includes(result.caseId));
 }finally{await h.close();globalThis.fetch=previous;}
});
