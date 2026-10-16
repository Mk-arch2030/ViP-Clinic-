const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const tool=require('./original-clinic-unified-device.cjs');
test('unified launcher has explicit closed modes, dedicated branch and full source commit guard',()=>{
 assert.equal(tool.BRANCH,'work/original-clinic-postgres-unification');
 for (const mode of ['build','preflight','listen']) assert.equal(tool.parseArgs([mode,tool.TOKEN,'a'.repeat(40)]).action,mode);
 for(const action of ['build','preflight','listen'])assert.equal(tool.parseArgs([action,tool.TOKEN,'a'.repeat(40),'/existing/key.pem']).action,action);
 for(const args of [['migrate',tool.TOKEN,'a'.repeat(40),'/key'],['listen','wrong','a'.repeat(40),'/key'],['listen',tool.TOKEN,'short','/key'],['listen',tool.TOKEN,'a'.repeat(40),'relative/key']])assert.throws(()=>tool.parseArgs(args));
});
test('unified build inventory includes lazy demo assets but rejects tampering and extra files',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'unified-assets-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));fs.mkdirSync(path.join(dir,'assets'));
 for(const [name,value]of Object.entries({'index.html':'<div id="root"></div>','assets/app.js':'app','assets/demo.js':'demo','assets/style.css':'body{}'}))fs.writeFileSync(path.join(dir,name),value);
 const manifest=tool.assetManifest(dir);assert.equal(Object.keys(manifest).length,4);
 const record={head:'a'.repeat(40),branch:tool.BRANCH,themeHash:'b'.repeat(64),sources:{app:'c'.repeat(64)},assets:manifest};
 assert.deepEqual(tool.validateRecord(record,record),manifest);
 assert.throws(()=>tool.validateRecord({...record,themeHash:'d'.repeat(64)},record));
 fs.writeFileSync(path.join(dir,'private.key'),'not served');assert.throws(()=>tool.assetManifest(dir));
});
test('automatic existing-key selection fails closed on invalid certificate without changing private files',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'unified-existing-tls-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 fs.writeFileSync(path.join(dir,'server.cert.pem'),'invalid synthetic certificate');
 const privateFile=path.join(dir,'server.key.pem');fs.writeFileSync(privateFile,'synthetic sentinel, not a key',{mode:0o600});
 assert.throws(()=>tool.locateExistingKey(dir));assert.equal(fs.readFileSync(privateFile,'utf8'),'synthetic sentinel, not a key');
});
