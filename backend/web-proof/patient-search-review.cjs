'use strict';
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const prior=require('./stage6-device-package.cjs');
const {PROOF_HEAD}=require('./clinic-connected-device.cjs');
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const seed={patient_id:prior.FIXTURE.patient,clinic_patient_number:'CPN-60001',name:'Stage 6 Synthetic Baseline',date_of_birth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male'};
const sequence=[{last_value:'1',is_called:false}];
function reviewBusiness(value){
 assert.ok(Array.isArray(value.patients)&&value.patients.length>=1&&value.patients.length<=100,'Bounded synthetic review only');
 assert.equal(value.days,0);
 const ids=new Set(),cpns=new Set(); let maximum=0n;
 for(const row of value.patients){
  assert.deepEqual(Object.keys(row).sort(),Object.keys(seed).sort());assert.match(row.patient_id,uuid);assert.match(row.clinic_patient_number,/^CPN-[1-9][0-9]{0,18}$/);
  assert.ok(!ids.has(row.patient_id)&&!cpns.has(row.clinic_patient_number));ids.add(row.patient_id);cpns.add(row.clinic_patient_number);
  for(const key of ['name','phone','profession']) assert.ok(typeof row[key]==='string'&&row[key].length>0&&row[key].length<=256);
  assert.ok(['Male','Female'].includes(row.gender));
  if(row.date_of_birth!==null){assert.match(row.date_of_birth,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(row.date_of_birth).toISOString().slice(0,10),row.date_of_birth);assert.ok(row.date_of_birth<=new Date().toISOString().slice(0,10));}
  if(row.patient_id===seed.patient_id)assert.deepEqual(row,seed);
  else {const n=BigInt(row.clinic_patient_number.slice(4));maximum=n>maximum?n:maximum;}
 }
 assert.ok(ids.has(seed.patient_id));assert.equal(value.sequence.length,1);
 const seq=value.sequence[0];assert.deepEqual(Object.keys(seq).sort(),['is_called','last_value']);assert.match(seq.last_value,/^[1-9][0-9]{0,18}$/);assert.equal(typeof seq.is_called,'boolean');
 assert.ok(BigInt(seq.last_value)>=maximum);if(maximum>0n)assert.equal(seq.is_called,true);
 if(maximum===0n&&!seq.is_called)assert.equal(seq.last_value,'1');
 // Validate every original authority/schema-proof field without changing its record.
 prior.validateNewBaseline({...value,patients:[seed],sequence,sessions:0,attempts:0},PROOF_HEAD);
 for(const count of [value.sessions,value.attempts])assert.ok(Number.isSafeInteger(count)&&count>=0);
 return {patients:value.patients,sequence:value.sequence,days:value.days};
}
const businessHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
module.exports={reviewBusiness,businessHash};
