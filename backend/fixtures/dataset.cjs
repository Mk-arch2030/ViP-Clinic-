'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const {serialize,literals}=require('./golden/capture.cjs');
const goldenRef=require('./golden/reference.cjs'),extendedRef=require('./extended/reference.cjs');
const sha=value=>createHash('sha256').update(value).digest('hex');
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function unique(items,key){assert.equal(new Set(items.map(x=>x[key])).size,items.length,'Duplicate '+key);}
function validateGraph(data,historical=false){
 for(const [records,key]of [[data.patients,'patientId'],[data.patients,'clinicPatientNumber'],[data.cases,'id'],[data.visits,'id'],[data.clinicDays,'id'],[data.clinicDays,'workingDate']])unique(records,key);
 const patients=new Map(data.patients.map(p=>[p.patientId,p])),cases=new Map(data.cases.map(c=>[c.id,c])),visits=new Map(data.visits.map(v=>[v.id,v])),days=new Map(data.clinicDays.map(d=>[d.id,d]));
 const missing=[];const day=(id,ref)=>{if(!days.has(id))missing.push(ref+'='+id);};
 for(const p of data.patients){assert.match(p.patientId,UUID);assert.match(p.clinicPatientNumber,/^CPN-[1-9][0-9]{0,18}$/);assert.ok(typeof p.name==='string'&&p.name.trim());assert.ok(typeof p.phone==='string');assert.ok(typeof p.profession==='string');assert.ok(['Male','Female'].includes(p.gender));if(p.dateOfBirth!==null){assert.match(p.dateOfBirth,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(p.dateOfBirth).toISOString().slice(0,10),p.dateOfBirth);}
  if(p.pastHistory!==null){const h=p.pastHistory;assert.deepEqual(Object.keys(h).sort(),['chronicIllnesses','knownAllergies','surgicalHistory','familyHistory','lifestyleNotes'].sort());for(const k of ['chronicIllnesses','knownAllergies','surgicalHistory','familyHistory'])assert.ok(Array.isArray(h[k])&&h[k].every(s=>typeof s==='string'));assert.equal(typeof h.lifestyleNotes,'string');}
  if(!historical){assert.match(p.name,/^SYNTHETIC /);assert.match(p.phone,/^SYN-NON-DIALABLE-/);}
 }
 for(const c of data.cases){assert.ok(patients.has(c.patientId));assert.ok(visits.has(c.activeVisitId));assert.equal(visits.get(c.activeVisitId).caseId,c.id);assert.equal(visits.get(c.activeVisitId).patientId,c.patientId);day(c.openedClinicDayId,c.id+'.openedClinicDayId');}
 const rx=[];
 for(const v of data.visits){const c=cases.get(v.caseId);assert.ok(c&&patients.has(v.patientId));assert.equal(v.patientId,c.patientId,'Cross-patient association');day(v.clinicDayId,v.id+'.clinicDayId');assert.ok(c.openedDate<=v.date);const at=Date.parse(v.date+'T'+v.time+':00Z');assert.ok(Number.isFinite(at));assert.equal(v.visitType,'Visit & Consultation');
  const r=v.prescription;assert.ok(r&&Array.isArray(r.items));rx.push(r);if(r.isAuthorized){assert.equal(typeof r.authorizedBy,'string');assert.ok(Date.parse(r.authorizedAt)>=at);}else{assert.equal(r.authorizedAt,null);assert.equal(r.authorizedBy,null);}
 }
 unique(rx,'id');unique(rx.flatMap(r=>r.items),'id');
 const expected=historical?['C-003.openedClinicDayId=CD-2026-09-20','V-004.clinicDayId=CD-2026-09-20']:[];assert.deepEqual(missing.sort(),expected.sort(),'Unexpected historical gap');
 for(const d of data.clinicDays){assert.equal(d.counter,data.visits.filter(v=>v.clinicDayId===d.id).length);if(d.status==='CLOSED'){assert.equal(d.lifecycle,'CONCLUDED');assert.ok(Date.parse(d.closedAt)>Date.parse(d.openedAt));}}
 return {patients:data.patients.length,cases:data.cases.length,visits:data.visits.length,clinicDays:data.clinicDays.length,prescriptions:rx.length,knownHistoricalGaps:missing};
}
function loadDataset(){
 const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
 const bytes=read('golden/baseline-v1.json'),raw=read('golden/clinicStore.current.ts.source.txt'),initial=read('golden/clinicStore.initial.ts.source.txt'),extBytes=read('extended/extended-v1.json');
 assert.equal(sha(bytes),goldenRef.canonicalSha256,'Golden baseline drift');assert.equal(sha(raw),goldenRef.currentRawSha256);assert.equal(sha(initial),goldenRef.initialRawSha256);assert.equal(sha(extBytes),extendedRef.sha256,'Extension version drift');
 const golden=JSON.parse(bytes),extension=JSON.parse(extBytes);assert.equal(serialize(literals(raw)),bytes);assert.equal(serialize(literals(initial)),bytes);validateGraph(golden,true);validateGraph(extension);
 for(const [key,id]of [['patients','patientId'],['patients','clinicPatientNumber'],['cases','id'],['visits','id'],['clinicDays','id'],['clinicDays','workingDate']])unique([...golden[key],...extension[key]],id);
 unique(extension.scenarios,'id');for(const s of extension.scenarios){assert.match(s.id,/^EXT-\d{3}$/);for(const key of ['purpose','syntheticInputs','expectedPersistedRecords','expectedRelationships','expectedApiBehavior','requiredBackendCapability','minimumRoadmapStage','testImplementationStatus'])assert.ok(Object.hasOwn(s,key));assert.ok(s.minimumRoadmapStage>=6&&s.minimumRoadmapStage<=12);if(s.minimumRoadmapStage>=7)assert.equal(s.testImplementationStatus,'SPECIFIED_NOT_IMPLEMENTED');}
 return {golden,extension,baselineHash:goldenRef.canonicalSha256,extensionHash:extendedRef.sha256,datasetHash:sha(serialize({golden,extension}))};
}
function projection(dataset){
 const patients=[...dataset.golden.patients,...dataset.extension.patients];
 const history=[];for(const p of patients)if(p.pastHistory)for(const k of ['chronicIllnesses','knownAllergies','surgicalHistory','familyHistory','lifestyleNotes']){
  const values=k==='lifestyleNotes'?(p.pastHistory[k]?[p.pastHistory[k]]:[]):p.pastHistory[k];
  values.forEach((content,position)=>{const hex=sha(p.patientId+'|'+k+'|'+position).slice(0,32);history.push({itemId:hex.slice(0,8)+'-'+hex.slice(8,12)+'-5'+hex.slice(13,16)+'-8'+hex.slice(17,20)+'-'+hex.slice(20),patientId:p.patientId,category:k,position,content});});
 }
 return {patients:patients.map(p=>({patientId:p.patientId,clinicPatientNumber:p.clinicPatientNumber,name:p.name,dateOfBirth:p.dateOfBirth,profession:p.profession,phone:p.phone,gender:p.gender})),intakes:patients.filter(p=>p.pastHistory!==null).map(p=>p.patientId),history,days:[...dataset.golden.clinicDays,...dataset.extension.clinicDays]};
}
module.exports={loadDataset,validateGraph,projection,sha,serialize};
