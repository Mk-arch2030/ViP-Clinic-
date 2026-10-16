import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { createRequire } from 'node:module';
import { OuterDoctorGate } from './OuterDoctorGate';
import App from '../App';
import { TEST_ORIGIN } from '../integration/web-api-client';
import { REGISTRATION_MARKER } from '../integration/registration-uncertainty';

const require=createRequire(import.meta.url);
const Fastify=require('fastify');
const { makeHarness }=require('../../backend/auth/test-harness.cjs');
const { login }=require('../../backend/auth/test-service-contract.cjs');
const { composeSecuredPatients }=require('../../backend/api/secured-patient-composition');

test('original protected clinic + secured HTTP injection: lost 201 reply locks actual gate across remount (DOM/fake SQL, not browser/PostgreSQL)',async t=>{
  const h=makeHarness(),patients:any[]=[],markers=new Set<string>(),history:any[]=[];let allocations=0,posts=0;
  let settled!:()=>void;
  const routeSettled=new Promise<void>(resolve=>{settled=resolve;});
  // Explicit non-transactional SQL double, suitable only for this successful-response
  // path. It is not PostgreSQL rollback/concurrency/COMMIT proof.
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
  const app=Fastify();await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:TEST_ORIGIN});t.after(()=>app.close());
  const signed=await login(h);
  const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:TEST_ORIGIN});
  let tail=Promise.resolve();
  const locks={request(_name:string,_options:unknown,work:()=>unknown){const next=tail.then(work);tail=next.then(()=>{},()=>{});return next;}};
  const properties=['window','document','HTMLElement','navigator','fetch','IS_REACT_ACT_ENVIRONMENT'];
  const previous=new Map(properties.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  Object.defineProperties(globalThis,{
    window:{configurable:true,value:dom.window},document:{configurable:true,value:dom.window.document},
    HTMLElement:{configurable:true,value:dom.window.HTMLElement},navigator:{configurable:true,value:{locks,userAgent:dom.window.navigator.userAgent}},
    IS_REACT_ACT_ENVIRONMENT:{configurable:true,value:true},
    fetch:{configurable:true,value:async(url:unknown,options:RequestInit={})=>{
      const r=await app.inject({method:options.method??'GET',url:String(url),headers:{origin:TEST_ORIGIN,cookie:'__Host-vip_session='+signed.token,...options.headers},payload:options.body});
      if(options.method==='POST'&&String(url)==='/patients/intake'){
        posts++;assert.equal(r.statusCode,201);settled();throw Error('Synthetic successful route response lost');
      }
      return new Response(r.statusCode===204?null:r.body,{status:r.statusCode,headers:r.headers});
    }}
  });
  const {createRoot}=await import('react-dom/client');let root=createRoot(document.getElementById('root')!);
  try {
    await act(async()=>{root.render(<OuterDoctorGate><App/></OuterDoctorGate>);});
    assert.ok(document.querySelector('[data-roby-gate="inside"]'));
    const inputs=[...document.querySelectorAll<HTMLInputElement>('form input')];assert.equal(inputs.length,9);
    const values=['Synthetic Recovery Patient','0000','1990-02-01','','Synthetic chronic','Synthetic allergy','Synthetic surgery','Synthetic family','Synthetic lifestyle'];
    await act(async()=>{inputs.forEach((input,i)=>{
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(input,values[i]);
      input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
    });});
    await act(async()=>{
      document.querySelector('form')!.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
      let timeout:ReturnType<typeof setTimeout>;
      try { await Promise.race([routeSettled,new Promise<never>((_,reject)=>{timeout=setTimeout(()=>reject(Error('Registration route did not settle')),2000);})]); }
      finally { clearTimeout(timeout!); }
    });
    assert.equal(posts,1);assert.equal(patients.length,1);assert.equal(allocations,1);
    assert.equal(new Set(history.map(row=>row.category)).size,5);
    assert.ok(dom.window.localStorage.getItem(REGISTRATION_MARKER));
    assert.ok(document.querySelector('[data-roby-gate="outside"]'));
    assert.equal(document.querySelector('form'),null);
    assert.ok(!document.body.textContent!.includes('تم إنشاء ملف المريض بنجاح'));
    await act(async()=>root.unmount());
    // New gate/model reads the persistent marker. The DOM itself is new; storage
    // is intentionally retained, modelling reload of this browser origin.
    root=createRoot(document.getElementById('root')!);
    await act(async()=>{root.render(<OuterDoctorGate><App/></OuterDoctorGate>);});
    assert.ok(document.querySelector('[data-roby-gate="outside"]'));
    assert.equal(document.querySelector('form'),null);assert.equal(posts,1);assert.equal(patients.length,1);
  } finally {
    await act(async()=>root.unmount());
    for(const [name,descriptor] of previous){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else Reflect.deleteProperty(globalThis,name);}
    dom.window.close();
  }
});
