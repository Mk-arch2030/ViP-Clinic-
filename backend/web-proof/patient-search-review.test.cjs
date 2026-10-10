'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {execFileSync}=require('node:child_process');
const p=require('./stage6-device-package.cjs'),c=require('./clinic-search-device.cjs');
const {reviewBusiness,businessHash}=require('./patient-search-review.cjs');
function baseline(){return { database:p.DATABASE,systemId:p.SYSTEM_ID,manifest:[{singleton:true,head:c.PROOF_HEAD,system_identifier:p.SYSTEM_ID}],patients:[{patient_id:p.FIXTURE.patient,clinic_patient_number:'CPN-60001',name:'Stage 6 Synthetic Baseline',date_of_birth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male'}],sequence:[{last_value:'1',is_called:false}],days:0,sessions:2,attempts:1,actors:[p.FIXTURE.doctor,p.FIXTURE.nurse,p.FIXTURE.disabled].map((actor_id,i)=>({actor_id,actor_role:i===1?'NURSE':'DOCTOR',lifecycle_state:i===2?'DEACTIVATED':'ACTIVE'})),credentials:[p.FIXTURE.doctor,p.FIXTURE.nurse,p.FIXTURE.disabled].map((actor_id,i)=>({actor_id,login_label:p.LABELS[i],version:1,enabled:true})),mode:[{singleton:true,mode:'DOCTOR_NURSE'}],delegations:[{nurse_id:p.FIXTURE.nurse,doctor_id:p.FIXTURE.doctor,mode:'FULL',capabilities:[],version:1}]};}
function mock(b, fail=false){const calls=[];return {calls,async query(sql){calls.push(sql);if(fail&&sql.startsWith('SELECT patient_id'))throw Error('private');if(sql.includes(' AS owns'))return {rows:[{owns:true}]};const map=[['SELECT singleton,head','manifest'],['SELECT patient_id','patients'],['SELECT last_value','sequence'],['SELECT actor_id,actor_role','actors'],['SELECT actor_id,login_label','credentials'],['SELECT singleton,mode','mode'],['SELECT nurse_id','delegations']];for(const [prefix,key] of map)if(sql.startsWith(prefix))return {rows:b[key]};if(sql.startsWith('SELECT count'))return {rows:[{count:sql.includes('sessions')?b.sessions:sql.includes('login_attempts')?b.attempts:b.days}]};return {rows:[]};}};}
const schemaHash=createHash('sha256').update(JSON.stringify({columns:[],relations:[],functions:[],schemas:[],extensions:[]})).digest('hex');
const record={head:c.PROOF_HEAD,database:p.DATABASE,systemId:p.SYSTEM_ID,schemaHash};
test('review/search runner import has no drivers/network and closed modes cannot create/reset a database',()=>{
 const file=__filename.replace('patient-search-review.test.cjs','clinic-search-device.cjs');
 execFileSync(process.execPath,['-e',`const M=require('node:module'),load=M._load;M._load=function(id,...a){if(id==='pg'||id==='fastify')throw Error('driver');return load.call(this,id,...a)};require('node:net').createConnection=()=>{throw Error('network')};require(${JSON.stringify(file)});`]);
 for(const [mode,token] of Object.entries(c.TOKENS))assert.deepEqual(c.parseArgs([mode,token,'a'.repeat(40)]),{mode,head:'a'.repeat(40)});
 assert.throws(()=>c.parseArgs(['prepare','anything','a'.repeat(40)]));assert.throws(()=>c.parseArgs(['review',c.TOKENS.review,'short']));
});
test('current business review preserves exact seed/authority while allowing valid newly persisted patients and sequence gaps',()=>{
 const b=baseline();b.patients.push({...b.patients[0],patient_id:'c5cf67dd-5051-4c10-9895-61e78fbe748e',clinic_patient_number:'CPN-8',name:'Pt 2'});b.sequence=[{last_value:'10',is_called:true}];
 const business=reviewBusiness(b);assert.equal(business.patients.length,2);assert.match(businessHash(business),/^[a-f0-9]{64}$/);
 for(const mutate of [v=>{v.patients[0].name='Changed seed'},v=>{v.days=1},v=>{v.actors[0].lifecycle_state='DEACTIVATED'},v=>{v.credentials[0].version=2},v=>{v.sequence[0].last_value='7'},v=>{v.sequence[0].is_called=false},v=>{v.patients[1].patient_id=v.patients[0].patient_id},v=>{v.sessions=-1},v=>{v.manifest[0].head='a'.repeat(40)}]){const value=structuredClone(b);mutate(value);assert.throws(()=>reviewBusiness(value));}
});
test('read-only review returns a bound business snapshot; later changes roll back and cannot start',async()=>{
 const b=baseline(),client=mock(b);const business=await c.verifyReviewedDatabase(client,record,async()=>p.SYSTEM_ID);
 assert.equal(client.calls[0],'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');assert.equal(client.calls.at(-1),'COMMIT');assert.ok(client.calls.every(sql=>/^SELECT\b/.test(sql)||/^(BEGIN|COMMIT)/.test(sql)));
 const r={head:'a'.repeat(40),proofHead:c.PROOF_HEAD,database:p.DATABASE,systemId:p.SYSTEM_ID,schemaHash,businessHash:businessHash(business),business};
 assert.deepEqual(c.validateReview(r,r.head,record),business);assert.throws(()=>c.validateReview({...r,businessHash:'0'.repeat(64)},r.head,record));assert.throws(()=>c.validateReview(r,'b'.repeat(40),record));
 b.sequence=[{last_value:'2',is_called:true}];const changed=mock(b);await assert.rejects(c.verifyReviewedDatabase(changed,record,async()=>p.SYSTEM_ID,business));assert.equal(changed.calls.at(-1),'ROLLBACK');
});
test('identity/read/schema failures stop before listener with no database mutation or proof rewrite',async()=>{
 const wrong=mock(baseline());await assert.rejects(c.verifyReviewedDatabase(wrong,record,async()=> 'wrong'));assert.equal(wrong.calls.length,0);
 for(const [r,fail] of [[{...record,schemaHash:'a'.repeat(64)},false],[record,true]]){const client=mock(baseline(),fail);await assert.rejects(c.verifyReviewedDatabase(client,r,async()=>p.SYSTEM_ID));assert.equal(client.calls.at(-1),'ROLLBACK');assert.ok(client.calls.every(sql=>!/^\s*(CREATE|DROP|INSERT|UPDATE|DELETE|ALTER|SETVAL)\b/i.test(sql)));}
});
