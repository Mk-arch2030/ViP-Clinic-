'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const https = require('node:https');
const { execFileSync,spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { AuthError } = require('../auth/errors');
const { tlsOptions,readAssets,buildStage6WebTestRuntime,startStage6WebTestRuntime } = require('./stage6-web-test-runtime.cjs');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
let directory,tls,assets,manifest;
test.before(() => {
  directory=fs.mkdtempSync(path.join(os.tmpdir(),'vip-stage6-test-'));
  const key=path.join(directory,'key.pem'),cert=path.join(directory,'cert.pem');
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',key,'-out',cert,'-days','1',
    '-subj','/CN=Stage6 Synthetic Test','-addext','subjectAltName=IP:127.0.0.1'],{ stdio:'ignore' });
  tls={ key:fs.readFileSync(key),cert:fs.readFileSync(cert) };
  assets=path.join(directory,'build');fs.mkdirSync(assets);fs.mkdirSync(path.join(assets,'assets'));
  fs.writeFileSync(path.join(assets,'stage6-integration.html'),'<html><body>synthetic test</body></html>');
  fs.writeFileSync(path.join(assets,'assets','test.js'),'console.log("synthetic");');
  manifest=Object.fromEntries(['stage6-integration.html','assets/test.js'].map(name=>[name,hash(fs.readFileSync(path.join(assets,name)))]));
});
test.after(() => fs.rmSync(directory,{ recursive:true,force:true }));
const session={ actorIdentityReference:'11111111-1111-4111-8111-111111111111',role:'Doctor',lifecycle:'ACTIVE',csrf:'B'.repeat(43) };
const auth = () => ({
  async login({ password }) { if(password!=='synthetic password') throw new AuthError(401); return { token:'A'.repeat(43),expires:Date.now()+60000 }; },
  async current(token) { if(token!=='A'.repeat(43)) throw new AuthError(401); return session; },
  async logout(token,csrf) { if(token!=='A'.repeat(43)) throw new AuthError(401); if(csrf!==session.csrf) throw new AuthError(403); },
  async withAuthorized() { throw new AuthError(403); }
});
function options(extra={}) { return { auth:auth(),tls,assetsDirectory:assets,manifest,...extra }; }
async function request(app,url,headers={},payload) {
  return new Promise((resolve,reject) => {
    const req=https.request({ hostname:'127.0.0.1',servername:'',port:app.server.address().port,path:url,ca:tls.cert,
      method:payload===undefined?'GET':'POST',headers:{ Host:'127.0.0.1:3443',...headers } },response=>{
      const chunks=[];response.on('data',chunk=>chunks.push(chunk));response.on('end',()=>resolve({ status:response.statusCode,
        headers:response.headers,body:Buffer.concat(chunks).toString('utf8') }));
    });req.on('error',reject);req.end(payload===undefined?undefined:JSON.stringify(payload));
  });
}
test('import exposes builders without loading pg/Fastify or opening listener/pool', () => {
  const result=spawnSync(process.execPath,['-e',`
    const Module=require('node:module');const old=Module._load;
    Module._load=function(name,...args){if(['pg','fastify'].includes(name))throw Error('driver loaded');return old.call(this,name,...args);};
    require(${JSON.stringify(path.join(__dirname,'stage6-web-test-runtime.cjs'))});
  `],{ encoding:'utf8',timeout:5000 });assert.equal(result.status,0,result.stderr);
});
test('start rejects missing execution token/full HEAD before driver or resource creation', async () => {
  await assert.rejects(startStage6WebTestRuntime());
  await assert.rejects(startStage6WebTestRuntime({ token:'ROBY_STAGE6_WEB_START',expectedHead:'short',buildHead:'short' }));
  await assert.rejects(startStage6WebTestRuntime({ token:'ROBY_STAGE6_WEB_START',expectedHead:'a'.repeat(40),buildHead:'b'.repeat(40) }));
});
test('certificate/key, IP SAN, validity and HTTPS origin reject rather than downgrade', async () => {
  assert.ok(tlsOptions(tls));
  assert.throws(()=>tlsOptions(tls,Date.now()+3*86400000));
  assert.throws(()=>tlsOptions({ ...tls,key:'invalid' }));
  const { generateKeyPairSync }=require('node:crypto');
  const otherKey=generateKeyPairSync('ec',{ namedCurve:'prime256v1' }).privateKey.export({ type:'pkcs8',format:'pem' });
  assert.throws(()=>tlsOptions({ ...tls,key:otherKey }));
  const wrongCert=path.join(directory,'wrong-cert.pem');
  execFileSync('openssl',['req','-x509','-key',path.join(directory,'key.pem'),'-out',wrongCert,'-days','1',
    '-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost'],{ stdio:'ignore' });
  assert.throws(()=>tlsOptions({ ...tls,cert:fs.readFileSync(wrongCert) }));
  assert.throws(()=>tlsOptions());
  await assert.rejects(buildStage6WebTestRuntime(options({ trustedOrigin:'http://127.0.0.1:3443' })));
  await assert.rejects(buildStage6WebTestRuntime(options({ trustedOrigin:'https://localhost:3443' })));
});
test('asset manifest rejects traversal, source/config exposure, symlinks and hash mismatch', () => {
  assert.equal(readAssets(assets,manifest).size,2);
  for(const name of ['../key.pem','.env','src/App.tsx','assets/test.js.map','assets/../key.js']) assert.throws(()=>readAssets(assets,{ ...manifest,[name]:'a'.repeat(64) }));
  assert.throws(()=>readAssets(assets,{ ...manifest,'assets/test.js':'a'.repeat(64) }));
  const symlink=path.join(directory,'link');fs.symlinkSync(assets,symlink);assert.throws(()=>readAssets(symlink,manifest));
  fs.symlinkSync(path.join(directory,'key.pem'),path.join(assets,'assets','key.js'));
  assert.throws(()=>readAssets(assets,{ ...manifest,'assets/key.js':hash(tls.key) }));
});
test('build does not listen/connect; owned pool closes once, caller pool never closes', async () => {
  for(const ownsPool of [true,false]) {
    let ends=0;const pool={ connect(){ assert.fail('build connected'); },async end(){ ends++; } };
    const app=await buildStage6WebTestRuntime(options({ pool,ownsPool }));
    assert.equal(app.server.listening,false);await app.close();await app.close();assert.equal(ends,ownsPool?1:0);
  }
  let ends=0;
  await assert.rejects(buildStage6WebTestRuntime(options({ auth:{},ownsPool:true,pool:{ async end(){ends++;} } })));
  assert.equal(ends,1);
});
test('trusted TLS Node client receives no-store/CSP; incorrect Host and unknown assets fail without SPA fallback', async () => {
  const app=await buildStage6WebTestRuntime(options());
  try {
    await app.listen({host:'127.0.0.1',port:0});
    const result=await request(app,'/');assert.equal(result.status,200);assert.match(result.body,/synthetic test/);
    assert.equal(result.headers['cache-control'],'no-store');assert.match(result.headers['content-security-policy'],/frame-ancestors 'none'/);
    assert.equal((await request(app,'/',{Host:'evil.test'})).status,400);
    for(const url of ['/src/App.tsx','/.env','/assets/missing.js','/patients/not-a-uuid']) assert.notEqual((await request(app,url)).status,200);
  } finally { await app.close(); }
});
test('cookie expiry recovery clears only invalid session/logout cookies, never a failed password login', async () => {
  const app=await buildStage6WebTestRuntime(options());
  try {
    await app.listen({host:'127.0.0.1',port:0});
    const invalid=await request(app,'/auth/session',{ Cookie:'__Host-vip_session=invalid' });
    assert.equal(invalid.status,401);assert.match(invalid.headers['set-cookie'][0],/Secure; HttpOnly; SameSite=Strict; Max-Age=0/);
    const headers={ Origin:'https://127.0.0.1:3443','Content-Type':'application/json',Cookie:'__Host-vip_session='+'A'.repeat(43) };
    const bad=await request(app,'/auth/login',headers,{ loginLabel:'SYN/DOCTOR',password:'wrong password' });
    assert.equal(bad.status,401);assert.equal(bad.headers['set-cookie'],undefined);
    const good=await request(app,'/auth/login',headers,{ loginLabel:'SYN/DOCTOR',password:'synthetic password' });
    assert.equal(good.status,200);assert.match(good.headers['set-cookie'][0],/__Host-vip_session=.*Path=\/; Secure; HttpOnly; SameSite=Strict/);
    const current=await request(app,'/auth/session',{ Cookie:'__Host-vip_session='+'A'.repeat(43) });
    assert.equal(current.status,200);assert.deepEqual(JSON.parse(current.body),session);
  } finally { await app.close(); }
});
test('origin/CSRF/server authorization failures precede business work on the TLS boundary', async () => {
  let logins=0;const mock=auth();const original=mock.login;mock.login=async input=>{logins++;return original(input);};
  const app=await buildStage6WebTestRuntime(options({auth:mock}));
  try {
    await app.listen({host:'127.0.0.1',port:0});
    const body={ loginLabel:'SYN/DOCTOR',password:'synthetic password' };
    assert.equal((await request(app,'/auth/login',{'Content-Type':'application/json'},body)).status,403);assert.equal(logins,0);
    const headers={ Origin:'https://127.0.0.1:3443','Content-Type':'application/json',Cookie:'__Host-vip_session='+'A'.repeat(43) };
    assert.equal((await request(app,'/auth/logout',headers,{})).status,403);
    assert.equal((await request(app,'/patients/55555555-5555-4555-8555-555555555555',headers)).status,403);
    assert.equal((await request(app,'/auth/logout',{...headers,'X-CSRF-Token':session.csrf},{})).status,204);
  } finally { await app.close(); }
});
