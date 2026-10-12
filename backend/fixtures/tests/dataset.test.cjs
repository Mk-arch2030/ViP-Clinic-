const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {loadDataset,validateGraph,projection,sha,serialize}=require('../dataset.cjs');
const {literals}=require('../golden/capture.cjs');
const reference=require('../golden/reference.cjs');
const dataset=loadDataset();
test('Golden baseline pinned SHA and both historical literal sources match exactly',()=>{
 const bytes=fs.readFileSync(path.join(__dirname,'../golden/baseline-v1.json'));
 assert.equal(sha(bytes),'2c29163ab399e99b70918bd179da5e9e2ce3e0df271cf5faeb290952321dba12');assert.equal(sha(bytes),reference.canonicalSha256);
 const current=fs.readFileSync(path.join(__dirname,'../../../src/services/clinicStore.ts'),'utf8');assert.deepEqual(literals(current),dataset.golden);
 const changed=structuredClone(dataset.golden);changed.patients[0].name='Changed';assert.notEqual(sha(serialize(changed)),reference.canonicalSha256);
});
test('baseline inventory and exact known historical day gap are preserved without normalization',()=>{
 const stats=validateGraph(dataset.golden,true);assert.deepEqual([stats.patients,stats.cases,stats.visits,stats.clinicDays,stats.prescriptions],[3,3,4,1,4]);
 assert.deepEqual(stats.knownHistoricalGaps,['C-003.openedClinicDayId=CD-2026-09-20','V-004.clinicDayId=CD-2026-09-20']);
 assert.deepEqual(dataset.golden.visits.map(v=>v.id),['V-001','V-002','V-004','V-003']);
 assert.equal(dataset.golden.visits[2].prescription.authorizedBy,'Dr. Roby, MD (Attending Physician)');
});
test('extension is disjoint, explicitly synthetic and fully specified with no future-stage passing claims',()=>{
 const x=dataset.extension;assert.equal(x.scenarios.length,47);assert.equal(x.patients.length,4);
 assert.equal(x.patients[0].name,x.patients[1].name);assert.notEqual(x.patients[0].patientId,x.patients[1].patientId);
 assert.equal(x.patients[2].dateOfBirth,null);assert.equal(x.patients[2].pastHistory,null);
 assert.equal(x.patients[1].pastHistory.lifestyleNotes,'');assert.equal(x.patients[0].profession,'');
 for(const s of x.scenarios){for(const key of ['id','purpose','syntheticInputs','expectedPersistedRecords','expectedRelationships','expectedApiBehavior','requiredBackendCapability','minimumRoadmapStage','testImplementationStatus'])assert.ok(s[key]);if(s.minimumRoadmapStage>=7)assert.equal(s.testImplementationStatus,'SPECIFIED_NOT_IMPLEMENTED');assert.ok(!s.testImplementationStatus.includes('PASS'));}
 assert.deepEqual(x.scenarios.reduce((a,s)=>(a[s.minimumRoadmapStage]=(a[s.minimumRoadmapStage]??0)+1,a),{}),{6:17,7:7,8:15,9:2,10:3,11:1,12:2});
});
test('fixture projection is deterministic, retains source identities and excludes unsupported clinical rows',()=>{
 const p=projection(dataset);assert.deepEqual(p,projection(loadDataset()));assert.deepEqual([p.patients.length,p.intakes.length,p.history.length,p.days.length],[7,6,28,3]);
 assert.equal(new Set(p.history.map(h=>h.itemId)).size,28);assert.ok(p.history.every(h=>p.patients.some(p=>p.patientId===h.patientId)));
 assert.equal(p.patients[0].clinicPatientNumber,'CPN-1001');assert.equal('cases' in p,false);assert.equal('registeredAt' in p.patients[0],false);
});
test('duplicates, cross-patient references, unknown day gaps and corrupted authorization chronology fail',()=>{
 for(const mutate of [x=>x.patients.push(structuredClone(x.patients[0])),x=>{x.visits[0].patientId=x.patients[1].patientId;},x=>{x.visits[0].clinicDayId='UNKNOWN';},x=>{x.visits[1].prescription.authorizedAt='1990-01-01';},x=>{x.cases[0].activeVisitId='MISSING';}]){const x=structuredClone(dataset.golden);mutate(x);assert.throws(()=>validateGraph(x,true));}
});
test('generated/unknown source expressions are never silently captured as historical seed',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../golden/clinicStore.current.ts.source.txt'),'utf8');
 assert.throws(()=>literals(source.replace("name: 'Ahmed Hassan'","name: crypto.randomUUID()")),/Generated or unknown/);
});
test('restore preparation manifest matches pinned datasets, supported row checksum and historical ordering without claiming execution',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../verification-manifest-v1.json'),'utf8'));
 const {expectedRows}=require('../loader/core.cjs');const p=projection(dataset);
 assert.equal(manifest.baselineHash,dataset.baselineHash);assert.equal(manifest.datasetHash,dataset.datasetHash);assert.equal(manifest.extensionHash,dataset.extensionHash);
 assert.equal(manifest.projectionHash,sha(serialize(p)));assert.equal(manifest.verifiedRowsHash,sha(serialize(expectedRows(p))));
 assert.deepEqual(manifest.supportedCounts,{patients:7,intakes:6,historyItems:28,clinicDays:3});assert.equal(manifest.actualBackupRestore,'NOT_RUN');
 assert.deepEqual(manifest.clinicalTimelineReferences.find(c=>c.caseId==='C-003').orderedVisits,['V-004','V-003']);assert.deepEqual(manifest.clinicalTimelineReferences.find(c=>c.caseId==='SYN-C-001').orderedVisits,['SYN-V-001','SYN-V-002']);
});
