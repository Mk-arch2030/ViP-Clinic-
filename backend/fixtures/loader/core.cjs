'use strict';
const assert=require('node:assert/strict');
const {loadDataset,projection,sha,serialize}=require('../dataset.cjs');
const {FixtureError,requireTrue,validateIdentity,validateConfig,NAMESPACE}=require('./safety.cjs');
const sql=require('./postgres.cjs');
const unsupported=['patients.registeredAt','cases and Case-to-Patient runtime persistence','visits and clinical timeline runtime persistence','encounter/vitals/investigations/diagnoses/treatment','prescription authorization/clinical identity','follow-up and visit exit','unseeded historical clinic day CD-2026-09-20'];
function expectedRows(p){return {
 patients:p.patients.map(p=>({patient_id:p.patientId,clinic_patient_number:p.clinicPatientNumber,name:p.name,date_of_birth:p.dateOfBirth,profession:p.profession,phone:p.phone,gender:p.gender})),
 patient_intakes:p.intakes.map(id=>({patient_id:id})),
 past_history_items:p.history.map(h=>({item_id:h.itemId,patient_id:h.patientId,category:h.category,position:h.position,content:h.content})),
 clinic_days:p.days.map(d=>({clinic_day_id:d.id,working_date:d.workingDate,status:d.status,lifecycle:d.lifecycle,counter:d.counter,opened_at:new Date(d.openedAt).toISOString(),closed_at:d.closedAt?new Date(d.closedAt).toISOString():null,closed_by:d.closedBy??null})),
};}
function normalize(table,row){const x=structuredClone(row);if(table==='clinic_days')for(const k of ['opened_at','closed_at'])if(x[k]!==null)x[k]=new Date(x[k]).toISOString();return x;}
const keys={patients:'patient_id',patient_intakes:'patient_id',past_history_items:'item_id',clinic_days:'clinic_day_id'};
function fixtureRows(state,p){
 const expected=expectedRows(p),owned={};
 for(const [table,list]of Object.entries(expected)){
  const ids=new Set(list.map(r=>r[keys[table]]));
  owned[table]=state.tableState[table].filter(r=>ids.has(r[keys[table]])||(['past_history_items','patient_intakes'].includes(table)&&p.patients.some(p=>p.patientId===r.patient_id)));
 }
 return {expected,owned};
}
function verifyOwned(state,p,dataset){
 const marker=state.registry.find(r=>r.namespace===NAMESPACE);requireTrue(!!marker,'FIXTURE_MANIFEST_REQUIRED');
 requireTrue(marker.dataset_hash===dataset.datasetHash&&marker.projection_hash===sha(serialize(p))&&sha(serialize(marker.payload))===dataset.datasetHash,'FIXTURE_MANIFEST_DRIFT');
 const {expected,owned}=fixtureRows(state,p);
 for(const table of Object.keys(expected)){
  const sorted=rows=>rows.map(r=>normalize(table,r)).sort((a,b)=>String(a[keys[table]]).localeCompare(String(b[keys[table]])));
  try{assert.deepEqual(sorted(owned[table]),sorted(expected[table]));}catch{throw new FixtureError('FIXTURE_RECORD_DRIFT');}
 }
 const minimum=BigInt(p.patients.reduce((m,p)=>BigInt(p.clinicPatientNumber.slice(4))>m?BigInt(p.clinicPatientNumber.slice(4)):m,0n))+1n;
 const seq=state.sequence[0];requireTrue(BigInt(seq.last_value)+(seq.is_called?1n:0n)>=minimum,'CPN_SEQUENCE_DRIFT');
 return Object.fromEntries(Object.entries(owned).map(([table,rows])=>[table,rows.length]));
}
function collisionCheck(state,p){
 requireTrue(!state.registry.some(r=>r.namespace===NAMESPACE),'FIXTURE_ALREADY_PRESENT');
 const {owned}=fixtureRows(state,p);requireTrue(Object.values(owned).every(rows=>!rows.length),'UNOWNED_ID_COLLISION');
 const cpns=new Set(p.patients.map(p=>p.clinicPatientNumber)),dates=new Set(p.days.map(d=>d.workingDate));
 requireTrue(!state.tableState.patients.some(r=>cpns.has(r.clinic_patient_number)),'UNOWNED_CPN_COLLISION');
 requireTrue(!state.tableState.clinic_days.some(r=>dates.has(r.working_date)),'UNOWNED_DAY_COLLISION');
}
function preserve(before,after){
 for(const [table,rows]of Object.entries(before.tableState))for(const row of rows){
  const key=table==='actors'?'actor_id':keys[table];
  const actual=after.tableState[table].find(r=>r[key]===row[key]);
  try{assert.deepEqual(normalize(table,actual),normalize(table,row));}catch{throw new FixtureError('UNRELATED_RECORD_CHANGED');}
 }
 requireTrue(serialize(before.authDigest)===serialize(after.authDigest),'AUTH_STATE_CHANGED');
 for(const row of before.registry)requireTrue(after.registry.some(r=>serialize(r)===serialize(row)),'UNRELATED_NAMESPACE_CHANGED');
}
function report(state,dataset,p,status){return {status,namespace:NAMESPACE,datasetHash:dataset.datasetHash,baselineHash:dataset.baselineHash,extensionHash:dataset.extensionHash,expectedProjectionHash:sha(serialize(p)),verifiedRowsHash:status==='DRY_RUN_NO_WRITES'?null:sha(serialize(expectedRows(p))),stateHash:state.stateHash,
 projectedCounts:{patients:p.patients.length,intakes:p.intakes.length,historyItems:p.history.length,clinicDays:p.days.length},archivedOnlyCounts:{cases:dataset.golden.cases.length+dataset.extension.cases.length,visits:dataset.golden.visits.length+dataset.extension.visits.length,prescriptions:dataset.golden.visits.length+dataset.extension.visits.length},unsupported,clinicalPersistence:'NOT_IMPLEMENTED',credentialWrites:0,cleanup:'NOT_IMPLEMENTED'};}
async function run(client,config,mode,plan,token,adapter=sql){
 validateConfig(config,token);const dataset=loadDataset();
 requireTrue(['dry-run','load','verify'].includes(mode),'UNKNOWN_MODE');
 const p=projection(dataset);let begun=false;
 try{
  await client.query(mode==='load'?'BEGIN ISOLATION LEVEL SERIALIZABLE':'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');begun=true;
  const before=await adapter.inspect(client,config);validateIdentity(before.identity,config);
  if(mode==='load')await adapter.lock(client);
  const exists=before.registry.some(r=>r.namespace===NAMESPACE);
  if(exists){verifyOwned(before,p,dataset);await client.query('COMMIT');begun=false;return report(before,dataset,p,'ALREADY_LOADED_VERIFIED_NO_WRITES');}
  requireTrue(mode!=='verify','FIXTURE_NOT_LOADED');collisionCheck(before,p);
  if(mode==='dry-run'){
   const result={...report(before,dataset,p,'DRY_RUN_NO_WRITES'),configHash:sha(serialize(config)),schemaHash:sha(serialize(before.schema))};
   await client.query('COMMIT');begun=false;return result;
  }
  requireTrue(plan?.status==='DRY_RUN_NO_WRITES'&&plan.datasetHash===dataset.datasetHash&&plan.configHash===sha(serialize(config))&&plan.stateHash===before.stateHash&&plan.schemaHash===sha(serialize(before.schema)),'DRY_RUN_PLAN_MISSING_OR_STALE');
  await adapter.insert(client,p);
  await adapter.writeRegistry(client,config.namespace,dataset,sha(serialize(p)));
  const after=await adapter.inspect(client,config);validateIdentity(after.identity,config);verifyOwned(after,p,dataset);preserve(before,after);
  await client.query('COMMIT');begun=false;return report(after,dataset,p,'LOADED_AND_ROUNDTRIP_VERIFIED');
 }catch(error){if(begun)await client.query('ROLLBACK').catch(()=>{});throw error;}
}
module.exports={run,expectedRows,verifyOwned,collisionCheck,preserve,unsupported};
