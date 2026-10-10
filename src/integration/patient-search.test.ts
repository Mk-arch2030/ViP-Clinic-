import test from 'node:test';
import assert from 'node:assert/strict';
import {createWebApi,TEST_ORIGIN,ApiFailure,type WebApi,type ServerSession} from './web-api-client';
import {ConnectedPatientSession} from './connected-patient-session';
const id='c5cf67dd-5051-4c10-9895-61e78fbe748e';
const row={patient_id:id,clinic_patient_number:'CPN-8',name:'Pt 2',date_of_birth:null,profession:'Test',phone:'012',gender:'Male',age:null};
const session:ServerSession={actorIdentityReference:id,role:'Doctor',lifecycle:'ACTIVE',csrf:'A'.repeat(43)};
const patient={patientId:id,clinicPatientNumber:'CPN-8',name:'Pt 2',dateOfBirth:null,profession:'Test',phone:'012',gender:'Male' as const,age:null};
const api=(overrides:Partial<WebApi>={}):WebApi=>({session:async()=>session,login:async()=>{},logout:async()=>{},retrieve:async()=>patient,register:async()=>patient,search:async()=>({patients:[patient],hasMore:false}),...overrides});
test('search adapter uses fixed same-origin GET and escaped query; rejects invalid input before fetch',async()=>{
 const calls:unknown[]=[];
 const web=createWebApi({origin:TEST_ORIGIN,fetcher:async(url,options)=>{calls.push([url,options]);return new Response(JSON.stringify({patients:[row],hasMore:false}),{headers:{'content-type':'application/json'}});}});
 const result=await web.search!('name','Pt %_');assert.equal(result.patients[0].patientId,id);
 assert.equal((calls[0] as unknown[])[0],'/patients/search?mode=name&value=Pt%20%25_');
 const options=(calls[0] as unknown[])[1] as RequestInit;assert.equal(options.credentials,'same-origin');assert.equal(options.method,'GET');assert.equal(options.cache,'no-store');
 await assert.rejects(web.search!('name','a'));await assert.rejects(web.search!('cpn','8 OR 1=1'));assert.equal(calls.length,1);
});
test('malformed or duplicate/oversized search responses cannot become selected Patient data',async()=>{
 for(const data of [{patients:[row,row],hasMore:false},{patients:Array(26).fill(row),hasMore:false},{patients:[],hasMore:true},{patients:[],hasMore:false,role:'Doctor'},{patients:[{...row,patient_id:'bad'}],hasMore:false}]){
  const web=createWebApi({origin:TEST_ORIGIN,fetcher:async()=>new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}})});
  await assert.rejects(web.search!('cpn','8'),(e:unknown)=>e instanceof ApiFailure && e.kind==='unavailable');
 }
});
test('duplicate names produce choices; selection retrieves internal UUID; empty search clears old data and retains notice',async()=>{
 let empty=false,read='';const other={...patient,patientId:'c5cf67dd-5051-4c10-9895-61e78fbe748f',clinicPatientNumber:'CPN-9'};
 const model=new ConnectedPatientSession(api({search:async()=>({patients:empty?[]:[patient,other],hasMore:false}),retrieve:async(id)=>{read=id;return other;}}));
 await model.refresh();await model.search('name','Pt');assert.equal(model.getSnapshot().session.patient,null);assert.equal(model.getSnapshot().session.searchResults.length,2);
 await model.retrieve(other.patientId);assert.equal(read,other.patientId);assert.equal(model.getSnapshot().session.patient,other);
 empty=true;await model.search('name','Pt');assert.equal(model.getSnapshot().session.patient,null);assert.equal(model.getSnapshot().session.searchResults.length,0);assert.equal(model.getSnapshot().notice?.kind,'not-found');await model.refresh();assert.equal(model.getSnapshot().notice?.kind,'not-found');
});
test('Nurse cannot search; late search after logout cannot restore records even if abort is ignored',async()=>{
 let calls=0,resolve!:(value:{patients:typeof patient[];hasMore:boolean})=>void;
 const nurse=new ConnectedPatientSession(api({session:async()=>({...session,role:'Nurse'}),search:async()=>{calls++;return {patients:[patient],hasMore:false};}}));await nurse.refresh();await nurse.search('cpn','8');assert.equal(calls,0);
 const pending=new Promise<{patients:typeof patient[];hasMore:boolean}>(yes=>{resolve=yes;});
 const doctor=new ConnectedPatientSession(api({search:async()=>pending}));await doctor.refresh();const work=doctor.search('name','Pt');await doctor.logout();resolve({patients:[patient],hasMore:false});await work;
 assert.equal(doctor.getSnapshot().session.session,null);assert.equal(doctor.getSnapshot().session.searchResults.length,0);
});
