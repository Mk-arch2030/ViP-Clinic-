import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConnectedPatientSession } from '../integration/connected-patient-session';
import { DoctorSessionProvider } from '../integration/doctor-session-context';
import { createProtectedClinicBoundary, searchInput } from '../integration/clinic-boundary';
import { ClinicApplication } from '../ClinicApplication';
import { PatientDossier } from './PatientDossier';
import { ApiFailure, type WebApi, TEST_ORIGIN } from '../integration/web-api-client';
const id='55555555-5555-4555-8555-555555555555';
const other='66666666-6666-4666-8666-666666666666';
const history={chronicIllnesses:['Synthetic chronic'],knownAllergies:['Synthetic allergy'],surgicalHistory:['Synthetic surgery'],familyHistory:['Synthetic family'],lifestyleNotes:'Synthetic lifestyle'};
const patient={patientId:id,clinicPatientNumber:'CPN-7',name:'Synthetic Patient',dateOfBirth:'1990-02-01',profession:'',phone:'0000',gender:'Male' as const,age:36,pastHistory:history};
const session={actorIdentityReference:other,role:'Doctor' as const,lifecycle:'ACTIVE' as const,csrf:'A'.repeat(43)};
function api(overrides:Partial<WebApi>={}):WebApi {return {session:async()=>session,login:async()=>{},logout:async()=>{},retrieve:async()=>patient,retrieveIntake:async()=>patient,search:async()=>({patients:[patient],hasMore:false}),register:async()=>patient,...overrides};}
async function model(overrides:Partial<WebApi>={}) {const m=new ConnectedPatientSession(api(overrides));await m.refresh();return m;}
test('one original registration surface, all original navigation, no internal login or demo records',async()=>{
 const m=await model();const b=createProtectedClinicBoundary(m);
 const html=renderToStaticMarkup(<ClinicApplication boundary={b}/>);
 assert.equal((html.match(/type="date"/g)??[]).length,1);
 assert.ok(html.includes('Cholecystectomy'));assert.ok(html.includes('Penicillin'));assert.ok(html.includes('Engineer'));
 assert.ok(!html.includes('Server patients'));assert.ok(!html.includes('مرضى الخادم'));assert.ok(!html.includes('type="password"'));assert.ok(!html.includes('CPN-1001'));
 for(const text of ['سجل اليوم والزيارات','استقبال وتسجيل المرضى','دليل المرضى الشامل'])assert.ok(html.includes(text));
 assert.equal(b.getCurrentClinicDay(),null);assert.deepEqual(b.getState().patients,[]);m.dispose();
});
test('server lookup preserves identity and history, returns no wrong patient or invented registration date',async()=>{
 let requested='';const m=await model({retrieveIntake:async value=>{requested=value;return patient;}});const b=createProtectedClinicBoundary(m);
 await b.search!('CPN-7');const p=await b.retrieve!(id);
 assert.equal(requested,id);assert.deepEqual(p?.pastHistory,history);assert.equal(p?.registeredAt,null);assert.equal(b.getState().retrievedPatientId,id);
 assert.equal(await b.retrieve!(other),null);m.dispose();
 assert.deepEqual(searchInput('7'),['cpn','7']);assert.deepEqual(searchInput('Synthetic Patient'),['name','Synthetic Patient']);
});
test('missing, denied and unavailable retrieval clears authoritative data without local fallback',async()=>{
 for(const [status,kind] of [[404,'not-found'],[403,'forbidden'],[401,'unauthorized'],[503,'unavailable']] as const){
  let fail=false;const m=await model({retrieveIntake:async()=>{if(fail)throw new ApiFailure(status,kind);return patient;}});const b=createProtectedClinicBoundary(m);
  assert.ok(await b.retrieve!(id));fail=true;assert.equal(await b.retrieve!(id),null);assert.deepEqual(b.getState().patients,[]);m.dispose();
 }
});
test('Nurse cannot register or retrieve; unsupported clinical mutations cannot claim local success',async()=>{
 let calls=0;const m=await model({session:async()=>({...session,role:'Nurse'}),register:async()=>{calls++;return patient;},retrieveIntake:async()=>{calls++;return patient;}});
 const b=createProtectedClinicBoundary(m);assert.equal(b.blocked(),true);assert.equal(await b.retrieve!(id),null);
 assert.equal(await b.registerPatient({...patient,dateOfBirth:patient.dateOfBirth}),null);assert.equal(calls,0);
 for(const action of [()=>b.resetToSeed(),()=>b.setActorRole('Doctor'),()=>b.openNewClinicDay('Doctor'),()=>b.closeClinicDay('Doctor'),()=>b.recordArrivalAndVisit({}),()=>b.updateEncounter('x',{},'Doctor'),()=>b.authorizePrescription('x','Doctor'),()=>b.recordVisitExit('x','Doctor'),()=>b.completeCase('x','Doctor')])assert.throws(action,/not connected/);
 m.dispose();
});
test('unknown registration outcome blocks retry after refresh and clears exposed patient state',async()=>{
 let calls=0;const m=await model({register:async()=>{calls++;throw new ApiFailure(0,'unavailable');}});const b=createProtectedClinicBoundary(m);
 const input={name:'Synthetic',dateOfBirth:'1990-02-01',profession:'',phone:'0000',gender:'Male' as const,pastHistory:history};
 assert.equal(await b.registerPatient(input),null);await m.refresh();assert.equal(await b.registerPatient(input),null);assert.equal(calls,1);assert.deepEqual(b.getState().patients,[]);m.dispose();
});
test('dossier distinguishes uncaptured history from known empty fields and unavailable clinical counts',()=>{
 const props={cases:[],visits:[],actorRole:'Doctor' as const,language:'en' as const,onOpenConsultation:()=>{},onCompleteCase:()=>{},onStartNewVisitForCase:()=>{},onPrintPrescription:()=>{}};
 const unknown=renderToStaticMarkup(<PatientDossier {...props} clinicalUnavailable patient={{...patient,pastHistory:null,registeredAt:null,dateOfBirth:null}}/>);
 assert.ok(unknown.includes('Past history was not captured'));assert.ok(!unknown.includes('No known allergies'));assert.ok(unknown.includes('Not recorded'));
 const known=renderToStaticMarkup(<PatientDossier {...props} clinicalUnavailable patient={{...patient,registeredAt:null}}/>);
 for(const value of Object.values(history).flat())assert.ok(known.includes(value));
});
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:TEST_ORIGIN});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
const {createRoot}=await import('react-dom/client');
async function mount(m:ConnectedPatientSession){
 const root=createRoot(document.getElementById('root')!);
 await act(async()=>{root.render(<DoctorSessionProvider model={m}><ClinicApplication boundary={createProtectedClinicBoundary(m)}/></DoctorSessionProvider>);});
 return async()=>{await act(async()=>root.unmount());m.dispose();};
}
async function fill(){
 const inputs=[...document.querySelectorAll<HTMLInputElement>('form input')];
 assert.equal(inputs.length,9);
 const values=['Synthetic Patient','0000','1990-02-01','','Synthetic chronic','Synthetic allergy','Synthetic surgery','Synthetic family','Synthetic lifestyle'];
 await act(async()=>{inputs.forEach((input,i)=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(input,values[i]);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});});
}
async function submit(){await act(async()=>{document.querySelector('form')!.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));});}
test('original form waits for full response, blocks duplicate submit and round-trips every history field',async()=>{
 let resolve!:(p:typeof patient)=>void;let calls=0;let submitted:unknown;
 const pending=new Promise<typeof patient>(yes=>{resolve=yes;});
 const m=await model({register:async input=>{calls++;submitted=input;return pending;}});const close=await mount(m);
 try{
  await fill();await submit();await submit();assert.equal(calls,1);assert.ok(document.querySelector('fieldset')!.disabled);
  assert.ok(!document.body.textContent!.includes('تم إنشاء ملف المريض بنجاح'));
  assert.deepEqual((submitted as {pastHistory:unknown}).pastHistory,history);
  assert.equal((submitted as {profession:string}).profession,'');
  await act(async()=>{resolve(patient);await pending;});
  assert.ok(document.body.textContent!.includes('CPN-7'));assert.ok(document.body.textContent!.includes('تم إنشاء ملف المريض بنجاح'));
 }finally{await close();}
});
test('original form retains draft on validation error; lookup mode retrieves server patient before dossier',async()=>{
 const m=await model({register:async()=>{throw new ApiFailure(400,'invalid');}});const close=await mount(m);
 try{
  await fill();await submit();assert.equal(document.querySelector<HTMLInputElement>('form input')!.value,'Synthetic Patient');assert.equal(document.querySelector('fieldset')!.disabled,false);
  const button=[...document.querySelectorAll('button')].find(b=>b.textContent!.includes('مريض مسجل'));
  // Original lookup label is kept; locate its icon-independent segmented second button.
  const lookup=button??document.querySelectorAll('.max-w-4xl > div:first-child button')[1];assert.ok(lookup);
  await act(async()=>lookup!.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));
  const input=document.querySelector<HTMLInputElement>('form input')!;
  await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(input,'CPN-7');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
  await submit();assert.ok(document.body.textContent!.includes('Synthetic Patient'));
  const result=[...document.querySelectorAll('button')].find(b=>b.textContent!.includes('Synthetic Patient'));assert.ok(result);
  await act(async()=>result!.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));
  assert.ok(document.body.textContent!.includes('CPN-7'));assert.ok(document.querySelector('fieldset')!.disabled);
 }finally{await close();}
});
test('protected App never loads browser store and shared logout removes authoritative data',async()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');let access=0;
 Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){access++;throw new Error('Protected mode accessed browser storage');}});
 const {default:App}=await import('../App');const m=await model();const root=createRoot(document.getElementById('root')!);
 try{
  await act(async()=>root.render(<DoctorSessionProvider model={m}><App/></DoctorSessionProvider>));
  assert.equal(access,0);const b=createProtectedClinicBoundary(m);await act(async()=>{await b.retrieve!(id);});assert.equal(b.getState().patients[0]?.patientId,id);
  await act(async()=>{await m.logout();});assert.deepEqual(b.getState().patients,[]);assert.equal(access,0);
 }finally{await act(async()=>root.unmount());m.dispose();if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else Reflect.deleteProperty(globalThis,'localStorage');}
});
test('real external gate renders entrance first, then original clinic, and locks on logout',async()=>{
 const {OuterDoctorGate}=await import('./OuterDoctorGate');const {default:App}=await import('../App');
 let authenticated=false;let loginCalls=0;const oldFetch=globalThis.fetch;
 globalThis.fetch=(async(url:unknown)=>{
  const path=String(url);
  if(path==='/auth/login'){authenticated=true;loginCalls++;return new Response('{"authenticated":true}',{headers:{'Content-Type':'application/json'}});}
  if(path==='/auth/logout'){authenticated=false;return new Response(null,{status:204});}
  if(path==='/auth/session')return authenticated?new Response(JSON.stringify(session),{headers:{'Content-Type':'application/json'}}):new Response('{}',{status:401});
  throw new Error('Unexpected gate request');
 }) as typeof fetch;
 const root=createRoot(document.getElementById('root')!);
 try{
  await act(async()=>{root.render(<OuterDoctorGate><App/></OuterDoctorGate>);await new Promise(setImmediate);});
  assert.ok(document.querySelector('[data-roby-gate="outside"]'));assert.equal(document.querySelector('input[type="date"]'),null);
  const inputs=[...document.querySelectorAll<HTMLInputElement>('form input')];
  await act(async()=>{inputs.forEach((input,i)=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(input,i===0?'DR/MK_ROBY':'Synthetic-only-test-key');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});});
  await submit();assert.equal(loginCalls,1);assert.ok(document.querySelector('[data-roby-gate="inside"]'));assert.ok(document.querySelector('input[type="date"]'));
  const lock=[...document.querySelectorAll('button')].find(b=>b.textContent!.includes('إغلاق العيادة'));assert.ok(lock);
  await act(async()=>lock!.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));
  assert.ok(document.querySelector('[data-roby-gate="outside"]'));assert.equal(document.querySelector('input[type="date"]'),null);
 }finally{await act(async()=>root.unmount());globalThis.fetch=oldFetch;}
});
test('demo origin keeps original seeded workflows and local persistence without duplicate registration navigation',async()=>{
 const old=Object.getOwnPropertyDescriptor(globalThis,'localStorage');Object.defineProperty(globalThis,'localStorage',{configurable:true,value:dom.window.localStorage});
 const {default:DemoClinic}=await import('../DemoClinic');const root=createRoot(document.getElementById('root')!);
 try{
  await act(async()=>root.render(<DemoClinic/>));
  assert.ok(document.body.textContent!.includes('Ahmed Hassan'));assert.ok(!document.body.textContent!.includes('مرضى الخادم'));
  assert.ok([...document.querySelectorAll('button')].some(b=>b.textContent!.includes('Reset Data')));
  const intake=[...document.querySelectorAll('nav button')].find(b=>b.textContent!.includes('استقبال'));assert.ok(intake);
  await act(async()=>intake!.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));
  assert.equal(document.querySelectorAll('input[type="date"]').length,1);
  assert.equal(document.querySelector('fieldset')!.disabled,false);
 }finally{await act(async()=>root.unmount());if(old)Object.defineProperty(globalThis,'localStorage',old);else Reflect.deleteProperty(globalThis,'localStorage');}
});
