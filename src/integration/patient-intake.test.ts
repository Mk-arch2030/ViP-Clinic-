import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIntakePatient, parseIntakeRegistration } from './patient-intake';
import { parsePatient } from './basic-patient';
import { createWebApi, TEST_ORIGIN, ApiFailure, type WebApi } from './web-api-client';
import { ConnectedPatientSession } from './connected-patient-session';
const id='55555555-5555-4555-8555-555555555555';
const history={chronicIllnesses:['ضغط'],knownAllergies:['Penicillin'],surgicalHistory:[],familyHistory:[],lifestyleNotes:'No smoking'};
const input={name:'Synthetic',dateOfBirth:'1990-02-01',profession:'',phone:'0000',gender:'Male' as const,pastHistory:history};
const row={patient_id:id,clinic_patient_number:'CPN-7',name:input.name,date_of_birth:input.dateOfBirth,profession:'',phone:input.phone,gender:'Male',age:36,pastHistory:history};
const session={actorIdentityReference:id,role:'Doctor' as const,lifecycle:'ACTIVE' as const,csrf:'A'.repeat(43)};
const patient=parseIntakePatient(row);
function api(overrides:Partial<WebApi>={}):WebApi {return {session:async()=>session,login:async()=>{},logout:async()=>{},retrieve:async()=>patient,register:async()=>patient,...overrides};}
test('intake parsers preserve original form fields and distinguish uncaptured history',()=>{
 assert.deepEqual(parseIntakeRegistration(input),input);
 assert.deepEqual(parseIntakePatient(row).pastHistory,history);
 assert.equal(parseIntakePatient({...row,pastHistory:null}).pastHistory,null);
 const {pastHistory,...basic}=row;
 assert.throws(()=>parseIntakePatient(basic));
 assert.equal(parsePatient(basic).profession,'');
 for(const value of [undefined,{}, {...history,clinicalHistory:[]}, {...history,knownAllergies:Array(33).fill('x')}, {...history,lifestyleNotes:'\0'}]) assert.throws(()=>parseIntakeRegistration({...input,pastHistory:value}));
});
test('complete form uses only intake endpoint, sends CSRF, and never retries through legacy registration',async()=>{
 const calls:Array<{url:string;options:RequestInit}>=[];
 const fetcher=(async(url:unknown,options:RequestInit)=>{calls.push({url:String(url),options});return new Response(JSON.stringify(row),{status:201,headers:{'Content-Type':'application/json'}});}) as typeof fetch;
 const client=createWebApi({origin:TEST_ORIGIN,fetcher});
 const saved=await client.register(input,session.csrf);
 assert.deepEqual(saved.pastHistory,history);assert.equal(calls.length,1);assert.equal(calls[0].url,'/patients/intake');
 assert.deepEqual(JSON.parse(String(calls[0].options.body)),input);
 assert.equal((calls[0].options.headers as Record<string,string>)['X-CSRF-Token'],session.csrf);
 assert.equal(calls[0].options.credentials,'same-origin');
});
test('missing history in a 201 response is unconfirmed, never downgraded to basic success',async()=>{
 let calls=0;
 const client=createWebApi({origin:TEST_ORIGIN,fetcher:(async()=>{calls++;return new Response(JSON.stringify({...row,pastHistory:null}),{status:201,headers:{'Content-Type':'application/json'}});}) as typeof fetch});
 await assert.rejects(client.register(input,session.csrf),e=>e instanceof ApiFailure && e.kind==='unavailable');
 assert.equal(calls,1);
});
test('selected server patient retrieval uses the complete intake GET and retains unknown history',async()=>{
 let path='';
 const client=createWebApi({origin:TEST_ORIGIN,fetcher:(async(url:unknown)=>{path=String(url);return new Response(JSON.stringify({...row,pastHistory:null}),{headers:{'Content-Type':'application/json'}});}) as typeof fetch});
 assert.equal((await client.retrieveIntake!(id)).pastHistory,null);assert.equal(path,'/patients/'+id+'/intake');
});
test('pending full registration cannot report success or dispatch twice; validated failure allows corrected submission',async()=>{
 let resolve!:(value:typeof patient)=>void;let calls=0;
 const pending=new Promise<typeof patient>(yes=>{resolve=yes;});
 const model=new ConnectedPatientSession(api({register:async()=>{calls++;return pending;}}));
 await model.refresh();const work=model.register(input);assert.equal(model.getSnapshot().session.busy,true);
 assert.equal(await model.register(input),null);assert.equal(calls,1);assert.equal(model.getSnapshot().session.patient,null);
 resolve(patient);assert.deepEqual(await work,patient);model.dispose();
 let attempts=0;
 const validation=new ConnectedPatientSession(api({register:async()=>{if(++attempts===1)throw new ApiFailure(400,'invalid');return patient;}}));
 await validation.refresh();assert.equal(await validation.register(input),null);assert.equal(validation.getSnapshot().notice?.kind,'invalid');
 assert.deepEqual(await validation.register(input),patient);validation.dispose();
});
test('uncertain registration stays blocked after refresh and never silently repeats or falls back',async()=>{
 let calls=0;
 const model=new ConnectedPatientSession(api({register:async()=>{calls++;throw new ApiFailure(0,'unavailable');}}));
 await model.refresh();assert.equal(await model.register(input),null);
 assert.equal(model.getSnapshot().session.registrationUnconfirmed,true);
 await model.refresh();assert.equal(await model.register(input),null);assert.equal(calls,1);model.dispose();
});
test('full retrieval does not fall back to the basic patient API when capability is unavailable',async()=>{
 let basicReads=0;
 const model=new ConnectedPatientSession(api({retrieve:async()=>{basicReads++;return patient;}}));
 await model.refresh();await model.retrieve(id,true);
 assert.equal(basicReads,0);assert.equal(model.getSnapshot().session.patient,null);assert.equal(model.getSnapshot().session.failure,'unavailable');model.dispose();
});
