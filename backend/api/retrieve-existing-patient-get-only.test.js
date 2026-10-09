'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Fastify=require('fastify');
const {PatientRepository}=require('../persistence/patient-repository');
const {retrieveExistingPatientController}=require('./controllers/retrieve-existing-patient-controller');
const FOUND='33333333-3333-4333-8333-333333333333';
const MISSING='44444444-4444-4444-8444-444444444444';
function setup(){const calls=[];const client={async query(sql,params){calls.push({sql,params});assert.match(sql,/^\s*SELECT\b/i);assert.match(sql,/FROM patients/i);assert.match(sql,/WHERE patient_id = \$1/i);return {rows:params[0]===FOUND?[{patient_id:FOUND,clinic_patient_number:'CPN-9001',name:'Synthetic Retrieve Fixture',date_of_birth:null,profession:'Tester',phone:'00000000000',gender:'Male'}]:[]}}};const app=Fastify();app.decorate('patientRepository',new PatientRepository(client));app.get('/patients/:patientId',retrieveExistingPatientController);return {app,calls}}
test('GET found returns 200',async t=>{const {app,calls}=setup();t.after(()=>app.close());await app.ready();assert.equal(app.hasRoute({method:'POST',url:'/patients'}),false);const r=await app.inject({method:'GET',url:'/patients/'+FOUND});assert.equal(r.statusCode,200);assert.equal(r.json().patient_id,FOUND);assert.equal(r.json().clinic_patient_number,'CPN-9001');assert.equal(r.json().age,null);assert.equal(calls.length,1)});
test('GET missing returns controller 404',async t=>{const {app,calls}=setup();t.after(()=>app.close());await app.ready();assert.equal(app.hasRoute({method:'GET',url:'/patients/:patientId'}),true);const r=await app.inject({method:'GET',url:'/patients/'+MISSING});assert.equal(r.statusCode,404);assert.deepEqual(r.json(),{error:'Patient not found'});assert.equal(calls.length,1);assert.deepEqual(calls[0].params,[MISSING])});
test('POST route absent',async t=>{const {app,calls}=setup();t.after(()=>app.close());await app.ready();assert.equal(app.hasRoute({method:'POST',url:'/patients'}),false);assert.equal(calls.length,0)});
