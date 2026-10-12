const test=require('node:test'),assert=require('node:assert/strict');
const {TOKEN,DATABASE,NAMESPACE,validateConfig,validateIdentity}=require('../loader/safety.cjs');
const {run,expectedRows,verifyOwned}=require('../loader/core.cjs');
const {loadDataset,projection,serialize,sha}=require('../dataset.cjs');
const {columns,validateSchema}=require('../loader/schema-contract.cjs');
const {main}=require('../loader/cli.cjs');
const config={database:DATABASE,port:55449,user:'fixture_user',dataDirectory:'/tmp/roby-golden-fixtures-disposable-unit/data',socketDirectory:'/tmp/roby-golden-fixtures-disposable-unit/socket',systemId:'8000000000000000001',namespace:NAMESPACE};
const identity={database:DATABASE,data_directory:config.dataDirectory,sockets:config.socketDirectory,port:'55449',system_id:config.systemId,tcp:'',address:null,owns:true,search_path:'pg_catalog, public',version:'180000'};
const dataset=loadDataset(),p=projection(dataset);
function fixture(){
 let state={identity,schema:{contract:'unit-test-only'},tableState:{patients:[{patient_id:'a9000000-0000-4900-8900-000000000001',clinic_patient_number:'CPN-2',name:'SYNTHETIC UNRELATED',date_of_birth:null,profession:'',phone:'SYN-NON-DIALABLE',gender:'Male'}],patient_intakes:[],past_history_items:[],clinic_days:[],actors:[{actor_id:'a9000000-0000-4900-8900-000000000002',actor_role:'DOCTOR',lifecycle_state:'ACTIVE'}]},sequence:[{last_value:'3',is_called:false}],registry:[],authDigest:{credentials:'opaque-digest',sessions:'opaque-digest'}};
 let saved;const calls=[];const client={async query(sql){calls.push(sql);if(sql.startsWith('BEGIN'))saved=structuredClone(state);if(sql==='ROLLBACK')state=saved;return {rows:[]};}};
 const adapter={async inspect(){return {...structuredClone(state),stateHash:sha(serialize(state))};},async lock(){calls.push('UNIT_LOCK');},async insert(client,p){for(const [name,rows]of Object.entries(expectedRows(p)))state.tableState[name].push(...structuredClone(rows));state.sequence=[{last_value:'90005',is_called:false}];},async writeRegistry(client,namespace,dataset,projectionHash){state.registry.push({namespace,dataset_hash:dataset.datasetHash,projection_hash:projectionHash,payload:{golden:dataset.golden,extension:dataset.extension}});}};
 return {client,adapter,calls,state:()=>state};
}
test('missing authorization, owner DBs, production-like names, ambiguous config and ambient defaults are rejected before SQL',async()=>{
 for(const token of [undefined,'WRONG'])assert.throws(()=>validateConfig(config,token,{}));
 for(const database of ['roby_intake_proof_stage6','roby_web_proof_stage6','roby_auth_proof_stage5','postgres','clinic_production'])assert.throws(()=>validateConfig({...config,database},TOKEN,{}));
 for(const patch of [{port:55441},{systemId:'7695362409703475295'},{namespace:''},{socketDirectory:'127.0.0.1'},{password:'never logged'},{dataDirectory:'/tmp/existing-owner/data'}])assert.throws(()=>validateConfig({...config,...patch},TOKEN,{}));
 for(const env of [{DATABASE_URL:'secret'}, {PGDATABASE:DATABASE},{PGPASSWORD:'secret'}])assert.throws(()=>validateConfig(config,TOKEN,env));
 const f=fixture();await assert.rejects(run(f.client,config,'load',null,'WRONG',f.adapter));assert.deepEqual(f.calls,[]);
 await assert.rejects(main(['load','WRONG','/missing/config','/missing/plan']));
});
test('server identity, socket, owner, TCP, version and wrong system ID fail closed',()=>{
 for(const patch of [{database:'roby_intake_proof_stage6'},{system_id:'7695362409703475295'},{sockets:'/wrong/socket'},{tcp:'localhost'},{owns:false},{address:'127.0.0.1'},{version:'170000'}])assert.throws(()=>validateIdentity({...identity,...patch},config));
});
test('core unit fake adapter: dry-run performs no fixture writes and requires fresh bound plan',async()=>{
 const f=fixture(),before=serialize(f.state());const plan=await run(f.client,config,'dry-run',undefined,TOKEN,f.adapter);
 assert.equal(plan.status,'DRY_RUN_NO_WRITES');assert.equal(serialize(f.state()),before);assert.ok(f.calls.every(q=>q.startsWith('BEGIN')||q==='COMMIT'));
 await assert.rejects(run(f.client,config,'load',undefined,TOKEN,f.adapter),e=>e.code==='DRY_RUN_PLAN_MISSING_OR_STALE');assert.equal(serialize(f.state()),before);
 const valid=await run(f.client,config,'dry-run',undefined,TOKEN,f.adapter);f.state().sequence[0].last_value='4';await assert.rejects(run(f.client,config,'load',valid,TOKEN,f.adapter),e=>e.code==='DRY_RUN_PLAN_MISSING_OR_STALE');
});
test('core unit fake adapter: second load is idempotent, supported fields round-trip and unrelated rows remain unchanged',async()=>{
 const f=fixture();const unrelated=structuredClone(f.state().tableState.patients[0]);const plan=await run(f.client,config,'dry-run',undefined,TOKEN,f.adapter);
 const first=await run(f.client,config,'load',plan,TOKEN,f.adapter);assert.equal(first.status,'LOADED_AND_ROUNDTRIP_VERIFIED');assert.deepEqual(first.projectedCounts,{patients:7,intakes:6,historyItems:28,clinicDays:3});
 const before=serialize(f.state());const second=await run(f.client,config,'load',plan,TOKEN,f.adapter);assert.equal(second.status,'ALREADY_LOADED_VERIFIED_NO_WRITES');assert.equal(serialize(f.state()),before);assert.deepEqual(f.state().tableState.patients[0],unrelated);
 assert.deepEqual(verifyOwned(await f.adapter.inspect(),p,dataset),{patients:7,patient_intakes:6,past_history_items:28,clinic_days:3});
 assert.equal(f.state().registry[0].payload.golden.visits.length,4);assert.equal(first.clinicalPersistence,'NOT_IMPLEMENTED');
});
test('core unit fake adapter: fixture drift and an unexpected unknown-history marker are not overwritten',async()=>{
 for(const mutate of [f=>f.state().tableState.patients[1].name='CHANGED',f=>f.state().tableState.patient_intakes.push({patient_id:dataset.extension.patients[2].patientId}),f=>f.state().registry[0].payload.golden.visits[0].currentComplaint='CHANGED']){
  const f=fixture();const plan=await run(f.client,config,'dry-run',undefined,TOKEN,f.adapter);await run(f.client,config,'load',plan,TOKEN,f.adapter);mutate(f);const before=serialize(f.state());await assert.rejects(run(f.client,config,'load',plan,TOKEN,f.adapter));assert.equal(serialize(f.state()),before);
 }
});
test('core unit fake adapter: partial insert, registry failure and preservation failure roll back rows and sequence',async()=>{
 for(const phase of ['insert','writeRegistry','preservation']){
  const f=fixture();const plan=await run(f.client,config,'dry-run',undefined,TOKEN,f.adapter);const before=serialize(f.state());
  const adapter={...f.adapter};if(phase==='preservation'){const insert=adapter.insert;adapter.insert=async(...args)=>{await insert(...args);f.state().tableState.patients[0].name='CHANGED';};}else{const original=adapter[phase];adapter[phase]=async(...args)=>{await original(...args);throw Error('Synthetic private driver error');};}
  await assert.rejects(run(f.client,config,'load',plan,TOKEN,adapter));assert.equal(serialize(f.state()),before);assert.equal(f.calls.at(-1),'ROLLBACK');
 }
});
test('core unit fake adapter: collision with unowned UUID, CPN or working date is rejected without adopting records',async()=>{
 for(const mutate of [f=>{f.state().tableState.patients[0].patient_id=p.patients[0].patientId;},f=>{f.state().tableState.patients[0].clinic_patient_number=p.patients[0].clinicPatientNumber;},f=>{f.state().tableState.clinic_days.push({...expectedRows(p).clinic_days[0],clinic_day_id:'UNRELATED'});}]){
  const f=fixture();mutate(f);const before=serialize(f.state());await assert.rejects(run(f.client,config,'dry-run',undefined,TOKEN,f.adapter));assert.equal(serialize(f.state()),before);
 }
});
test('core unit fake adapter: secret-bearing driver exceptions never enter returned dry-run report',async()=>{
 const f=fixture();const report=await run(f.client,config,'dry-run',undefined,TOKEN,f.adapter);assert.ok(!JSON.stringify(report).includes('opaque-digest'));assert.ok(!JSON.stringify(report).includes('SYNTHETIC UNRELATED'));assert.ok(!JSON.stringify(report).includes('password'));
});
