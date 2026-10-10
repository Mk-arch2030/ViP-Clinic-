'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {createHash}=require('node:crypto');
const p=require('./stage6-device-package.cjs'), c=require('./clinic-connected-device.cjs');
function baseline(){return { database:p.DATABASE,systemId:p.SYSTEM_ID,manifest:[{singleton:true,head:c.PROOF_HEAD,system_identifier:p.SYSTEM_ID}],patients:[{patient_id:p.FIXTURE.patient,clinic_patient_number:'CPN-60001',name:'Stage 6 Synthetic Baseline',date_of_birth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male'}],sequence:[{last_value:'1',is_called:false}],days:0,sessions:2,attempts:1,actors:[p.FIXTURE.doctor,p.FIXTURE.nurse,p.FIXTURE.disabled].map((actor_id,i)=>({actor_id,actor_role:i===1?'NURSE':'DOCTOR',lifecycle_state:i===2?'DEACTIVATED':'ACTIVE'})),credentials:[p.FIXTURE.doctor,p.FIXTURE.nurse,p.FIXTURE.disabled].map((actor_id,i)=>({actor_id,login_label:p.LABELS[i],version:1,enabled:true})),mode:[{singleton:true,mode:'DOCTOR_NURSE'}],delegations:[{nurse_id:p.FIXTURE.nurse,doctor_id:p.FIXTURE.doctor,mode:'FULL',capabilities:[],version:1}]};}
function mock(b, fail=false){const calls=[];return {calls,async query(sql){calls.push(sql);if(fail&&sql.startsWith('SELECT patient_id'))throw Error('private');if(sql.includes(' AS owns'))return {rows:[{owns:true}]};const map=[['SELECT singleton,head','manifest'],['SELECT patient_id','patients'],['SELECT last_value','sequence'],['SELECT actor_id,actor_role','actors'],['SELECT actor_id,login_label','credentials'],['SELECT singleton,mode','mode'],['SELECT nurse_id','delegations']];for(const [prefix,key] of map)if(sql.startsWith(prefix))return {rows:b[key]};if(sql.startsWith('SELECT count'))return {rows:[{count:sql.includes('sessions')?b.sessions:sql.includes('login_attempts')?b.attempts:b.days}]};return {rows:[]};}};}
const schemaHash=createHash('sha256').update(JSON.stringify({columns:[],relations:[],functions:[],schemas:[],extensions:[]})).digest('hex');
const record={head:c.PROOF_HEAD,database:p.DATABASE,systemId:p.SYSTEM_ID,schemaHash};
test('import runs no drivers, connections or listener',()=>{
 const code=`const M=require('node:module'),load=M._load;M._load=function(id,...a){if(id==='pg'||id==='fastify')throw Error('driver');return load.call(this,id,...a)};require('node:net').createConnection=()=>{throw Error('network')};require(${JSON.stringify(__filename.replace('.test.cjs','.cjs'))});`;
 execFileSync(process.execPath,['-e',code]);
});
test('only explicit preflight/build/start tokens and full HEAD are accepted; no prepare/reset mode',()=>{
 for(const [mode,token] of Object.entries(c.TOKENS))assert.deepEqual(c.parseArgs([mode,token,'a'.repeat(40)]),{mode,head:'a'.repeat(40)});
 for(const args of [[],['prepare','ROBY_STAGE6_DATABASE_PREPARE','a'.repeat(40)],['start','WRONG','a'.repeat(40)],['start',c.TOKENS.start,'a'.repeat(7)],['start',c.TOKENS.start,'a'.repeat(40),'extra']])assert.throws(()=>c.parseArgs(args));
});
test('existing auth activity is accepted only with unchanged original proof and business fixture',()=>{
 c.validateExistingBaseline(baseline()); c.baselineRecord(record);
 for(const mutate of [b=>{b.patients.push({...b.patients[0]})},b=>{b.sequence[0].is_called=true},b=>{b.manifest[0].head='a'.repeat(40)},b=>{b.actors[0].lifecycle_state='DEACTIVATED'},b=>{b.sessions=-1},b=>{b.credentials[0].version=2},b=>{b.database='roby_auth_proof_stage5'}]){const b=baseline();mutate(b);assert.throws(()=>c.validateExistingBaseline(b));}
 assert.throws(()=>c.baselineRecord({...record,head:'a'.repeat(40)}));
});
test('database adoption validates identity then read-only transaction and never writes prior proof',async()=>{
 const client=mock(baseline());let identities=0;
 await c.verifyExistingDatabase(client,record,async(_client,database)=>{identities++;assert.equal(database,p.DATABASE);return p.SYSTEM_ID;});
 assert.equal(identities,1);assert.equal(client.calls[0],'BEGIN READ ONLY');assert.equal(client.calls.at(-1),'COMMIT');
 assert.ok(client.calls.every(sql=>sql==='BEGIN READ ONLY'||sql==='COMMIT'||/^SELECT\b/.test(sql)));
});
test('wrong system identity blocks before SQL; changed schema/business or read error rolls back without reset',async()=>{
 const wrong=mock(baseline());await assert.rejects(c.verifyExistingDatabase(wrong,record,async()=> 'wrong'));assert.equal(wrong.calls.length,0);
 for(const [b,r,fail] of [[{...baseline(),days:1},record,false],[baseline(),{...record,schemaHash:'a'.repeat(64)},false],[baseline(),record,true]]){const client=mock(b,fail);await assert.rejects(c.verifyExistingDatabase(client,r,async()=>p.SYSTEM_ID));assert.equal(client.calls.at(-1),'ROLLBACK');assert.ok(client.calls.every(sql=>!/^\s*(CREATE|DROP|INSERT|UPDATE|DELETE|ALTER|SETVAL)\b/i.test(sql)));}
});
test('build binds current source/theme and fixed original DB proof; changed metadata/assets reject',()=>{
 const expected={head:'a'.repeat(40),proofHead:c.PROOF_HEAD,origin:p.ORIGIN,database:p.DATABASE,sources:{'src/App.tsx':'b'.repeat(64)},themeHash:'c'.repeat(64),tls:{caFingerprint:p.CA_HASH}};
 const value={...expected,assets:{'stage6-integration.html':'d'.repeat(64),'assets/clinic.js':'e'.repeat(64)}};
 c.validateManifest(value,expected);
 for(const patch of [{proofHead:'b'.repeat(40)},{themeHash:'f'.repeat(64)},{head:'c'.repeat(40)},{origin:'http://localhost:3000'},{sources:{}},{assets:{'stage6-integration.html':'d'.repeat(64),'assets/key.map':'e'.repeat(64)}}])assert.throws(()=>c.validateManifest({...value,...patch},expected));
});
