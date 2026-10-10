'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const p=require('./stage6-device-package.cjs');
const head='a'.repeat(40);
const verifiers=Array(3).fill('vip-scrypt-v1$'+'A'.repeat(22)+'$'+'B'.repeat(43));
function baseline(){return {
 database:p.DATABASE,systemId:p.SYSTEM_ID,manifest:[{singleton:true,head,system_identifier:p.SYSTEM_ID}],
 patients:[{patient_id:p.FIXTURE.patient,clinic_patient_number:'CPN-60001',name:'Stage 6 Synthetic Baseline',date_of_birth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male'}],
 sequence:[{last_value:'1',is_called:false}],days:0,sessions:0,attempts:0,
 actors:[p.FIXTURE.doctor,p.FIXTURE.nurse,p.FIXTURE.disabled].map((actor_id,i)=>({actor_id,actor_role:i===1?'NURSE':'DOCTOR',lifecycle_state:i===2?'DEACTIVATED':'ACTIVE'})),
 credentials:[p.FIXTURE.doctor,p.FIXTURE.nurse,p.FIXTURE.disabled].map((actor_id,i)=>({actor_id,login_label:p.LABELS[i],version:1,enabled:true})),
 mode:[{singleton:true,mode:'DOCTOR_NURSE'}],delegations:[{nurse_id:p.FIXTURE.nurse,doctor_id:p.FIXTURE.doctor,mode:'FULL',capabilities:[],version:1}]
};}
function client(options={}){
 const calls=[];
 const b=baseline();
 const query=async(sql,params)=>{
  calls.push({sql,params});
  if(sql===options.failSql)throw new Error('private DB diagnostic');
  if(sql.includes('pg_get_userbyid'))return {rows:[{empty:options.empty!==false}]};
  if(sql.startsWith('SELECT singleton,head'))return {rows:b.manifest};
  if(sql.startsWith('SELECT patient_id'))return {rows:b.patients};
  if(sql.startsWith('SELECT last_value'))return {rows:b.sequence};
  if(sql.startsWith('SELECT actor_id,actor_role'))return {rows:b.actors};
  if(sql.startsWith('SELECT actor_id,login_label'))return {rows:b.credentials};
  if(sql.startsWith('SELECT singleton,mode'))return {rows:b.mode};
  if(sql.startsWith('SELECT nurse_id'))return {rows:b.delegations};
  if(sql.startsWith('SELECT count'))return {rows:[{count:0}]};
  return {rows:[]};
 };
 return {calls,query,async end(){calls.push({sql:'END'});}};
}
function initOptions(){return {head,systemId:p.SYSTEM_ID,baseSchema:'CREATE BASE MARKER',authSchema:'CREATE AUTH MARKER',verifiers,validateEmpty:row=>assert.equal(row.empty,true)};}

test('import creates no connection/listener and cannot load pg or Fastify',()=>{
 const code=`const Module=require('node:module'),net=require('node:net');const original=Module._load;Module._load=function(id,...args){if(id==='pg'||id==='fastify')throw Error('driver loaded');return original.call(this,id,...args);};net.createConnection=()=>{throw Error('connection started');};require(${JSON.stringify(__filename.replace('.test.cjs','.cjs'))});console.log('IMPORT=PASS');`;
 assert.match(execFileSync(process.execPath,['-e',code],{encoding:'utf8'}),/IMPORT=PASS/);
});

test('mode tokens/full HEAD are closed and extra input rejects',()=>{
 for(const [mode,token] of Object.entries(p.TOKENS))assert.deepEqual(p.parseArgs([mode,token,head]),{mode,head});
 for(const args of [[],['prepare','WRONG',head],['cleanup','ROBY_STAGE6_DATABASE_PREPARE',head],['start',p.TOKENS.start,'a'.repeat(7)],['start',p.TOKENS.start,head,'extra'],['start',p.TOKENS.start,'A'.repeat(40)]])assert.throws(()=>p.parseArgs(args));
 const output=execFileSync(process.execPath,['-e',`const cp=require('node:child_process');const r=cp.spawnSync(process.execPath,[${JSON.stringify(__filename.replace('.test.cjs','.cjs'))},'start','WRONG',${JSON.stringify(head)}],{encoding:'utf8'});if(r.status!==1||!r.stderr.includes('ARGUMENT_GUARD'))throw Error('CLI guard failed');console.log('CLI=PASS');`],{encoding:'utf8'});
 assert.match(output,/CLI=PASS/);
});

test('public certificate fingerprint pinning blocks unrelated/invalid material without key access',()=>{
 assert.equal(p.CA_HASH.length,64);assert.equal(p.LEAF_HASH.length,64);
 assert.throws(()=>p.verifyPublicCertificates(Buffer.from('not a certificate'),Buffer.from('not a leaf')));
});

test('source/path readers reject symlinks and oversized/private-mode mismatches',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'roby-path-'));
 try{
  const file=path.join(root,'public');fs.writeFileSync(file,'abc',{mode:0o600});
  assert.equal(p.readRegular(file,3,true).toString(),'abc');
  assert.throws(()=>p.readRegular(file,2));
  const link=path.join(root,'link');fs.symlinkSync(file,link);assert.throws(()=>p.readRegular(link));
  fs.chmodSync(file,0o644);assert.throws(()=>p.readRegular(file,3,true));
  const alias=path.join(root,'alias');fs.symlinkSync(root,alias);assert.throws(()=>p.safeDirectory(alias));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('asset/manifest guards reject traversal, maps, secret paths, extra configuration and stale source HEAD',()=>{
 const assets={'stage6-integration.html':'a'.repeat(64),'assets/app.js':'b'.repeat(64)};
 p.validateAssetMap(assets);
 for(const name of ['../key','assets/file.map','server.key.pem','assets/sub/app.js','assets/../key.js'])assert.throws(()=>p.validateAssetMap({...assets,[name]:'c'.repeat(64)}));
 const sources={'src/integration/main.tsx':'d'.repeat(64)},tls={caFingerprint:p.CA_HASH};
 const good={head,origin:p.ORIGIN,database:p.DATABASE,sources,tls,assets};
 p.validateBuildManifest(good,head,sources,tls);
 for(const patch of [{head:'b'.repeat(40)},{origin:'http://127.0.0.1:3443'},{database:'roby_auth_proof_stage5'},{sources:{}},{tls:{}},{token:'secret'}])assert.throws(()=>p.validateBuildManifest({...good,...patch},head,sources,tls));
});

test('exact fresh target fixture rejects consumed sequences, prior sessions and altered authority',()=>{
 p.validateNewBaseline(baseline(),head);
 for(const mutate of [b=>{b.systemId='1';},b=>{b.database='roby_auth_proof_stage5';},b=>{b.manifest[0].head='b'.repeat(40);},b=>{b.patients.push({...b.patients[0]});},b=>{b.sequence[0].is_called=true;},b=>{b.sessions=1;},b=>{b.actors[0].lifecycle_state='DEACTIVATED';},b=>{b.credentials[0].version=2;},b=>{b.delegations[0].doctor_id=p.FIXTURE.nurse;}]){const b=baseline();mutate(b);assert.throws(()=>p.validateNewBaseline(b,head));}
});

test('nonempty/unauthorized target rolls back before DDL; DDL failure never commits',async()=>{
 const nonempty=client({empty:false});
 await assert.rejects(p.initialize(nonempty,initOptions()));
 assert.equal(nonempty.calls.some(c=>c.sql==='CREATE BASE MARKER'),false);
 assert.equal(nonempty.calls.at(-1).sql,'ROLLBACK');
 for(const failSql of ['CREATE BASE MARKER','CREATE AUTH MARKER','COMMIT']){
  const c=client({failSql});await assert.rejects(p.initialize(c,initOptions()));assert.equal(c.calls.at(-1).sql,'ROLLBACK');
  if(failSql!=='COMMIT')assert.equal(c.calls.some(q=>q.sql==='COMMIT'),false);
 }
});

test('initialization uses public for base DDL and fixed fixture/manifest without consuming CPN',async()=>{
 const c=client();await p.initialize(c,initOptions());
 const sql=c.calls.map(q=>q.sql);
 assert.ok(sql.indexOf('SET LOCAL search_path = public')<sql.indexOf('CREATE BASE MARKER'));
 assert.ok(sql.indexOf('CREATE BASE MARKER')<sql.indexOf('SET LOCAL search_path = pg_catalog, public'));
 assert.ok(sql.indexOf('SET LOCAL search_path = pg_catalog, public')<sql.indexOf('CREATE AUTH MARKER'));
 assert.equal(sql.at(-1),'COMMIT');
 assert.equal(sql.some(q=>/\bnextval\b|\bsetval\b|\bTRUNCATE\b|\bDROP\b/i.test(q)),false);
 const inserts=c.calls.filter(q=>q.sql.startsWith('INSERT INTO vip_auth.credentials'));
 assert.deepEqual(inserts.map(q=>q.params[1]),p.LABELS);
});

test('database identity/existence checks precede CREATE and existing target is never opened/reset',async()=>{
 for(const kind of ['wrong-identity','existing']){
  const calls=[];let targetOpened=false;
  const admin={async query(sql){calls.push(sql);return {rows:kind==='existing'&&sql.startsWith('SELECT 1')?[{}]:[]};}};
  await assert.rejects(p.createDatabase(admin,{identity:async()=>kind==='wrong-identity'?'1':p.SYSTEM_ID,connectTarget:async()=>{targetOpened=true;},initializeTarget:async()=>{}}));
  assert.equal(targetOpened,false);assert.equal(calls.some(sql=>sql.startsWith('CREATE')),false);
  assert.equal(calls.some(sql=>/DROP|TRUNCATE|setval/.test(sql)),false);
 }
});

test('prepare keeps maintenance lock through target initialization and closes target on failure',async()=>{
 const calls=[];
 const target={end:async()=>{calls.push('target-end');}};
 const admin={query:async(sql)=>{calls.push(sql);return {rows:[]};}};
 const options={identity:async(_client,database)=>{calls.push('identity:'+database);return p.SYSTEM_ID;},connectTarget:async()=>{calls.push('target-connect');return target;},initializeTarget:async()=>{calls.push('initialize');throw Error('fixture failure');}};
 await assert.rejects(p.createDatabase(admin,options));
 assert.equal(calls.filter(x=>x.startsWith('CREATE DATABASE')).length,1);
 assert.ok(calls.indexOf('SELECT pg_advisory_lock(76551006)')<calls.indexOf('target-connect'));
 assert.ok(calls.indexOf('initialize')<calls.indexOf('SELECT pg_advisory_unlock(76551006)'));
 assert.ok(calls.indexOf('target-end')<calls.indexOf('SELECT pg_advisory_unlock(76551006)'));
 assert.equal(calls.some(x=>/DROP|TRUNCATE/.test(x)),false);
});

test('simultaneous preparers serialize existence check; only one creates the target',async()=>{
 let held=false,exists=false,creates=0;
 const queue=[];
 const admin=()=>({async query(sql){
  if(sql.includes('pg_advisory_lock(')){if(held)await new Promise(r=>queue.push(r));held=true;}
  if(sql.includes('pg_advisory_unlock(')){held=false;queue.shift()?.();}
  if(sql.startsWith('SELECT 1'))return {rows:exists?[{}]:[]};
  if(sql.startsWith('CREATE DATABASE')){creates++;exists=true;}
  return {rows:[]};
 }});
 const options={identity:async()=>p.SYSTEM_ID,connectTarget:async()=>({end:async()=>{}}),initializeTarget:async()=>{}};
 const results=await Promise.allSettled([p.createDatabase(admin(),options),p.createDatabase(admin(),options)]);
 assert.equal(creates,1);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);assert.equal(results.filter(x=>x.status==='rejected').length,1);
});

test('owned close is idempotent across competing signals, failures stay failures',async()=>{
 let count=0,checks=0;
 const app={server:{listening:true},async close(){count++;this.server.listening=false;}};
 const close=await p.shutdownOwned(app,async()=>{checks++;});
 await Promise.all([close(),close(),close()]);assert.equal(count,1);assert.equal(checks,1);
 const bad=await p.shutdownOwned({server:{listening:true},close:async()=>{throw Error('close failed');}},()=>{});
 await assert.rejects(bad());await assert.rejects(bad());
});
