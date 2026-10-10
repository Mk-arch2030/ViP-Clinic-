'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const Fastify=require('fastify');
const {composeSecuredPatients}=require('./secured-patient-composition');
const {searchInput,searchPatients}=require('../persistence/patient-search');
const {makeHarness}=require('../auth/test-harness.cjs');
const {login,DOCTOR}=require('../auth/test-service-contract.cjs');
const id='c5cf67dd-5051-4c10-9895-61e78fbe748e';
const row={patient_id:id,clinic_patient_number:'CPN-8',name:'Pt 2',date_of_birth:null,profession:'Test',phone:'012',gender:'Male'};
const cookie=token=>'__Host-vip_session='+token;
test('CPN supports number or prefixed number; name is literal NFC substring with bounded input',()=>{
 assert.deepEqual(searchInput({mode:'cpn',value:' 8 '}),{mode:'cpn',value:'CPN-8'});
 assert.equal(searchInput({mode:'cpn',value:'cpn-60001'}).value,'CPN-60001');
 assert.equal(searchInput({mode:'name',value:' محمود '} ).value,'محمود');
 assert.equal(searchInput({mode:'name',value:' %_\\ '} ).value,'%_\\');
 for(const q of [{mode:'cpn',value:'0'},{mode:'cpn',value:'008'},{mode:'cpn',value:'8 OR 1=1'},{mode:'name',value:'a'},{mode:'name',value:'x'.repeat(81)},{mode:'name',value:'ab\ncd'},{mode:'name',value:['Pt','2']},{mode:'name',value:'Pt',role:'Doctor'}])assert.throws(()=>searchInput(q));
});
test('search SQL parameterizes literal text and bounds duplicate-name results without choosing a patient',async()=>{
 let sql,params;
 const rows=Array.from({length:26},(_,i)=>({...row,patient_id:String(i)}));
 const result=await searchPatients({query:async(s,p)=>{sql=s;params=p;return {rows};}},{mode:'name',value:"Pt %_'"});
 assert.deepEqual(params,["Pt %_'"]);assert.ok(!sql.includes("Pt %_'"));assert.match(sql,/strpos\(lower\(name\), lower\(\$1\)\)/);
 assert.match(sql,/ORDER BY lower\(name\), clinic_patient_number, patient_id LIMIT 26/);
 assert.equal(result.patients.length,25);assert.equal(result.hasMore,true);assert.equal(result.patients[0].age,null);
});
test('CPN uses exact equality and empty search is an empty result, not UUID not-found routing',async()=>{
 let sql;
 const result=await searchPatients({query:async(s,p)=>{sql=s;assert.deepEqual(p,['CPN-8']);return {rows:[]};}},{mode:'cpn',value:'8'});
 assert.match(sql,/clinic_patient_number = \$1/);assert.deepEqual(result,{patients:[],hasMore:false});
});
async function setup(){const h=makeHarness(),calls=[];h.store.client={query:async(sql,params)=>{calls.push({sql,params});return {rows:params[0]==='CPN-8'||params[0]==='Pt'? [row]:[]};}};const app=Fastify();await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:'https://vip.synthetic.invalid'});await app.ready();return {...h,app,calls};}
test('search enforces actual sessions and persisted Doctor authority before querying patient data',async()=>{
 const h=await setup();try {
  for(const headers of [{},{'x-actor-role':'Doctor'},{cookie:cookie('A'.repeat(43))},{cookie:cookie('A'.repeat(43))+'; '+cookie('B'.repeat(43))}])assert.equal((await h.app.inject({method:'GET',url:'/patients/search?mode=cpn&value=8',headers})).statusCode,401);
  const nurse=await login(h,'SYN/NURSE');assert.equal((await h.app.inject({method:'GET',url:'/patients/search?mode=name&value=Pt',headers:{cookie:cookie(nurse.token),'x-actor-role':'Doctor'}})).statusCode,403);
  assert.equal(h.calls.length,0);
  const doctor=await login(h);const response=await h.app.inject({method:'GET',url:'/patients/search?mode=cpn&value=8',headers:{cookie:cookie(doctor.token)}});
  assert.equal(response.statusCode,200);assert.equal(response.json().patients[0].patient_id,id);assert.equal(response.headers['cache-control'],'no-store');
  await h.actor(DOCTOR,{lifecycle_state:'DEACTIVATED'});const count=h.calls.length;
  assert.equal((await h.app.inject({method:'GET',url:'/patients/search?mode=name&value=Pt',headers:{cookie:cookie(doctor.token)}})).statusCode,401);assert.equal(h.calls.length,count);
 }finally{await h.app.close();}
});
test('malformed search and cross-site requests deny; database failures expose no diagnostic body',async()=>{
 const h=await setup();try{const {token}=await login(h);const headers={cookie:cookie(token)};
 for(const url of ['/patients/search?mode=name&value=P','/patients/search?mode=name&value=Pt&role=Doctor','/patients/search?mode=name&value=Pt&value=Other','/patients/search?value=Pt'])assert.equal((await h.app.inject({method:'GET',url,headers})).statusCode,400);
 assert.equal(h.calls.length,0);
 assert.equal((await h.app.inject({method:'GET',url:'/patients/search?mode=cpn&value=8',headers:{...headers,'sec-fetch-site':'cross-site'}})).statusCode,403);
 h.store.client.query=async()=>{throw Error('private database diagnostic');};
 const result=await h.app.inject({method:'GET',url:'/patients/search?mode=cpn&value=8',headers});assert.equal(result.statusCode,503);assert.ok(!result.body.includes('private'));
 }finally{await h.app.close();}
});
