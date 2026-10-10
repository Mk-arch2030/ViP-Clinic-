'use strict';

// Explicit device tooling: importing this module loads builtins only and runs nothing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { execFileSync } = require('node:child_process');
const { createHash, X509Certificate } = require('node:crypto');
const REPO = path.resolve(__dirname,'../..');
const DATABASE = 'roby_web_proof_stage6';
const SYSTEM_ID = '7694773229923891271';
const ORIGIN = 'https://127.0.0.1:3443';
const CA_HASH = '7ec5ec247c13012f208d693ad869928b121d6916c9455567c3924659b660a0cc';
const LEAF_HASH = '9d470c49d0f1d5b893f68bf742fe16bdc0afdfc1d3193300ad212bcde58cfcbd';
const TOKENS = Object.freeze({preflight:'ROBY_STAGE6_DEVICE_PREFLIGHT',build:'ROBY_STAGE6_DEVICE_BUILD',prepare:'ROBY_STAGE6_DATABASE_PREPARE',start:'ROBY_STAGE6_LISTENER_START'});
const PROTECTED = Object.freeze(['src/index.css','ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md','backend/api/routes/register-new-patient-route.js','src/components/PatientIntake.tsx.pre-light-migration']);
const FIXTURE = Object.freeze({doctor:'a6000000-0000-4600-8600-000000000001',nurse:'a6000000-0000-4600-8600-000000000002',disabled:'a6000000-0000-4600-8600-000000000003',patient:'b6000000-0000-4600-8600-000000000001',missing:'b6000000-0000-4600-8600-000000000002'});
const LABELS = Object.freeze(['SYN/STAGE6/DOCTOR','SYN/STAGE6/NURSE','SYN/STAGE6/DISABLED']);
const REQUIRED_PACKAGES = ['react','react-dom','vite','typescript','fastify','pg','tsx'];
const hash = b => createHash('sha256').update(b).digest('hex');
let phase = 'ARGUMENT_GUARD';

function parseArgs(args) {
  assert.equal(args.length,3,'Mode/token/full HEAD required');
  const [mode,token,head]=args;
  assert.ok(Object.hasOwn(TOKENS,mode),'Unknown mode');
  assert.equal(token,TOKENS[mode],'Execution token mismatch');
  assert.match(head,/^[0-9a-f]{40}$/,'Full lowercase HEAD required');
  return {mode,head};
}
function git(repo,args) {
  return execFileSync('git',['-C',repo,...args],{env:{...process.env,GIT_OPTIONAL_LOCKS:'0'},maxBuffer:32*1024*1024});
}
function safeDirectory(directory,privateMode=false) {
  assert.equal(path.resolve(directory),directory);
  let current=directory;
  while (true) {
    const info=fs.lstatSync(current);
    assert.ok(info.isDirectory()&&!info.isSymbolicLink(),'Directory/symlink mismatch');
    if(current===directory&&privateMode){assert.equal(info.uid,process.getuid());assert.equal(info.mode&0o777,0o700);}
    const parent=path.dirname(current); if(parent===current)break; current=parent;
  }
  assert.equal(fs.realpathSync(directory),directory);
  return directory;
}
function readRegular(file,max=16*1024*1024,privateMode=false) {
  safeDirectory(path.dirname(file));
  const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);
  try{
    const s=fs.fstatSync(fd);
    assert.ok(s.isFile()&&s.size<=max,'Regular bounded file required');
    if(privateMode){assert.equal(s.uid,process.getuid());assert.equal(s.mode&0o777,0o600);}
    return fs.readFileSync(fd);
  }finally{fs.closeSync(fd);}
}
function disk(file) {
  const s=fs.lstatSync(file);
  if(s.isSymbolicLink())return {kind:'link',value:fs.readlinkSync(file)};
  assert.ok(s.isFile(),'Unexpected worktree file type');
  return {kind:'file',hash:hash(fs.readFileSync(file)),mode:s.mode&0o777};
}
function snapshot(repo) {
  const untracked=git(repo,['ls-files','--others','--exclude-standard','-z']).toString().split('\0').filter(Boolean);
  const indexPath=path.resolve(repo,git(repo,['rev-parse','--git-path','index']).toString().trim());
  return {head:git(repo,['rev-parse','HEAD']).toString().trim(),index:hash(fs.readFileSync(indexPath)),
    status:git(repo,['status','--porcelain=v1','-z','--untracked-files=all']).toString(),
    diff:hash(git(repo,['diff','--binary','--no-ext-diff','--no-textconv'])),
    cached:hash(git(repo,['diff','--cached','--binary','--no-ext-diff','--no-textconv'])),
    protected:PROTECTED.map(p=>[p,disk(path.join(repo,p))]),
    untracked:untracked.map(p=>[p,disk(path.join(repo,p))])};
}
function sourcePreflight(repo,head) {
  assert.equal(git(repo,['rev-parse','--show-toplevel']).toString().trim(),repo);
  assert.equal(git(repo,['branch','--show-current']).toString().trim(),'main');
  assert.equal(git(repo,['rev-parse','HEAD']).toString().trim(),head);
  assert.ok(['git@github.com:Mk-arch2030/ViP-Clinic-.git','https://github.com/Mk-arch2030/ViP-Clinic-.git','ssh://git@github.com/Mk-arch2030/ViP-Clinic-.git'].includes(git(repo,['remote','get-url','origin']).toString().trim()));
  assert.equal(git(repo,['diff','--cached','--name-only']).length,0);
  assert.equal(git(repo,['ls-files','-u']).length,0);
  const files=git(repo,['ls-tree','-r','--name-only',head]).toString().trim().split('\n').filter(p=>
    /^(backend\/(auth|web-proof|persistence|config)\/|backend\/api\/controllers\/|application\/services\/|domain\/|src\/integration\/)/.test(p)||
    ['backend/api/stage6-web-test-runtime.cjs','backend/api/stage6-web-test-runtime.test.cjs','backend/api/stage6-patient-response-contract.test.ts','backend/api/secured-patient-composition.js','backend/api/secured-patient-composition.test.js','backend/package.json','application/package.json','package.json','package-lock.json','stage6-integration.html','vite.stage6.config.ts'].includes(p));
  assert.ok(files.includes('backend/web-proof/stage6-device-package.cjs')&&files.includes('package-lock.json'));
  const sources={};
  for(const p of files){const committed=git(repo,['show',head+':'+p]);assert.equal(hash(readRegular(path.join(repo,p))),hash(committed),'Source bytes differ: '+p);sources[p]=hash(committed);}
  const lock=JSON.parse(readRegular(path.join(repo,'package-lock.json')));
  for(const name of REQUIRED_PACKAGES){
    const installed=JSON.parse(readRegular(path.join(repo,'node_modules',name,'package.json')));
    assert.equal(installed.version,lock.packages['node_modules/'+name]?.version,'Locked dependency mismatch: '+name);
  }
  return sources;
}
function devicePaths(home,head) {
  assert.ok(path.isAbsolute(home));safeDirectory(home);
  const root=path.join(home,'vip-web-proof-stage6');safeDirectory(root,true);
  return {root,tls:path.join(root,'tls-9a690549'),build:path.join(root,'build-'+head),run:path.join(root,'run-'+head),manifest:path.join(root,'run-'+head,'build-manifest.json')};
}
function verifyPublicCertificates(caBytes,leafBytes,now=Date.now()) {
  const ca=new X509Certificate(caBytes),leaf=new X509Certificate(leafBytes);
  assert.equal(hash(ca.raw),CA_HASH,'CA fingerprint mismatch');
  assert.equal(hash(leaf.raw),LEAF_HASH,'Leaf fingerprint mismatch');
  assert.equal(ca.subject,'CN=RobY Stage6 Device Test CA 9a690549');
  assert.equal(ca.ca,true);assert.equal(ca.verify(ca.publicKey),true);assert.equal(leaf.ca,false);
  assert.equal(leaf.verify(ca.publicKey),true);assert.equal(leaf.issuer,ca.subject);
  assert.equal(leaf.subjectAltName,'IP Address:127.0.0.1');
  assert.deepEqual(leaf.keyUsage,['1.3.6.1.5.5.7.3.1']);
  for(const c of [ca,leaf]){assert.ok(Date.parse(c.validFrom)<=now&&now<Date.parse(c.validTo),'Expired/not-yet-valid certificate');assert.equal(c.publicKey.asymmetricKeyType,'rsa');assert.equal(c.publicKey.asymmetricKeyDetails.modulusLength,3072);}
  return {caFingerprint:hash(ca.raw),leafFingerprint:hash(leaf.raw),caExpires:ca.validTo,leafExpires:leaf.validTo};
}
function publicTls(paths) {
  safeDirectory(paths.tls,true);
  const ca=readRegular(path.join(paths.tls,'ca.cert.der'),16384,true);
  const cert=readRegular(path.join(paths.tls,'server.cert.pem'),16384,true);
  return {cert,review:verifyPublicCertificates(ca,cert)};
}
async function unusedPort() {
  await new Promise((resolve,reject)=>{
    const socket=net.createConnection({host:'127.0.0.1',port:3443});
    socket.setTimeout(1500);
    socket.once('connect',()=>{socket.destroy();reject(new Error('Loopback port occupied'));});
    socket.once('timeout',()=>{socket.destroy();reject(new Error('Port probe inconclusive'));});
    socket.once('error',e=>{socket.destroy();e.code==='ECONNREFUSED'?resolve():reject(new Error('Port probe inconclusive'));});
  });
  // The empty TCP probe sent no HTTP/TLS/credentials; it did not reserve the port.
}
function validateAssetMap(entries) {
  assert.ok(entries&&typeof entries==='object'&&!Array.isArray(entries));
  const keys=Object.keys(entries);
  assert.ok(keys.length>=2&&keys.length<=32&&keys.includes('stage6-integration.html'));
  for(const name of keys){assert.ok(name==='stage6-integration.html'||/^assets\/[A-Za-z0-9_-][A-Za-z0-9._-]*\.(js|css)$/.test(name),'Disallowed asset');assert.match(entries[name],/^[0-9a-f]{64}$/);}
}
function buildAssets(directory) {
  safeDirectory(directory);
  const assets={};let total=0;
  for(const p of ['stage6-integration.html',...fs.readdirSync(path.join(directory,'assets')).map(n=>'assets/'+n)]){
    const bytes=readRegular(path.join(directory,p));total+=bytes.length;assert.ok(total<=16*1024*1024);assets[p]=hash(bytes);
  }
  validateAssetMap(assets);
  const rootNames=fs.readdirSync(directory).sort();
  assert.deepEqual(rootNames,['.vite','assets','stage6-integration.html']);
  safeDirectory(path.join(directory,'.vite'));
  assert.deepEqual(fs.readdirSync(path.join(directory,'.vite')),['manifest.json']);
  readRegular(path.join(directory,'.vite','manifest.json'));
  return assets;
}
function writeNew(file,value) {
  const fd=fs.openSync(file,fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_NOFOLLOW,0o600);
  try{fs.writeFileSync(fd,JSON.stringify(value,null,2)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
}
function validateBuildManifest(value,head,sources,review) {
  assert.deepEqual(Object.keys(value).sort(),['assets','database','head','origin','sources','tls'].sort());
  assert.equal(value.head,head);assert.equal(value.origin,ORIGIN);assert.equal(value.database,DATABASE);
  assert.deepEqual(value.sources,sources);assert.deepEqual(value.tls,review);validateAssetMap(value.assets);
}
function loadBuild(paths,head,sources,review) {
  safeDirectory(paths.run,true);
  const manifest=JSON.parse(readRegular(paths.manifest,4*1024*1024,true));
  validateBuildManifest(manifest,head,sources,review);
  assert.deepEqual(buildAssets(paths.build),manifest.assets,'Build bytes changed');
  return manifest;
}
function validateNewBaseline(value,head) {
  assert.equal(value.database,DATABASE);assert.equal(value.systemId,SYSTEM_ID);
  assert.deepEqual(value.manifest,[{singleton:true,head,system_identifier:SYSTEM_ID}]);
  assert.deepEqual(value.patients,[{patient_id:FIXTURE.patient,clinic_patient_number:'CPN-60001',name:'Stage 6 Synthetic Baseline',date_of_birth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male'}]);
  assert.deepEqual(value.sequence,[{last_value:'1',is_called:false}]);
  assert.equal(value.days,0);assert.equal(value.sessions,0);assert.equal(value.attempts,0);
  assert.deepEqual(value.actors,[{actor_id:FIXTURE.doctor,actor_role:'DOCTOR',lifecycle_state:'ACTIVE'},{actor_id:FIXTURE.nurse,actor_role:'NURSE',lifecycle_state:'ACTIVE'},{actor_id:FIXTURE.disabled,actor_role:'DOCTOR',lifecycle_state:'DEACTIVATED'}]);
  assert.deepEqual(value.credentials,[FIXTURE.doctor,FIXTURE.nurse,FIXTURE.disabled].map((actor_id,i)=>({actor_id,login_label:LABELS[i],version:1,enabled:true})));
  assert.deepEqual(value.mode,[{singleton:true,mode:'DOCTOR_NURSE'}]);
  assert.deepEqual(value.delegations,[{nurse_id:FIXTURE.nurse,doctor_id:FIXTURE.doctor,mode:'FULL',capabilities:[],version:1}]);
}
async function collectBaseline(client,systemId) {
  const rows=async sql=>(await client.query(sql)).rows;
  const count=async table=>(await rows('SELECT count(*)::int AS count FROM '+table))[0].count;
  return {database:DATABASE,systemId,
    manifest:await rows('SELECT singleton,head,system_identifier FROM vip_auth.proof_manifest ORDER BY singleton'),
    patients:await rows('SELECT patient_id,clinic_patient_number,name,date_of_birth::text AS date_of_birth,profession,phone,gender FROM public.patients ORDER BY patient_id'),
    sequence:await rows('SELECT last_value::text,is_called FROM public.clinic_patient_number_seq'),
    actors:await rows('SELECT actor_id,actor_role,lifecycle_state FROM public.actors ORDER BY actor_id'),
    credentials:await rows('SELECT actor_id,login_label,version,enabled FROM vip_auth.credentials ORDER BY actor_id'),
    mode:await rows('SELECT singleton,mode FROM vip_auth.operating_mode ORDER BY singleton'),
    delegations:await rows('SELECT nurse_id,doctor_id,mode,capabilities,version FROM vip_auth.delegations ORDER BY nurse_id'),
    days:await count('public.clinic_days'),sessions:await count('vip_auth.sessions'),attempts:await count('vip_auth.login_attempts')};
}
async function schemaState(client) {
  const rows=async sql=>(await client.query(sql)).rows;
  return {
    columns:await rows("SELECT table_schema,table_name,column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_schema IN ('public','vip_auth') ORDER BY table_schema,table_name,ordinal_position"),
    relations:await rows("SELECT n.nspname,c.relname,c.relkind FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname IN ('public','vip_auth') ORDER BY n.nspname,c.relname"),
    functions:await rows("SELECT n.nspname,p.proname,pg_get_function_identity_arguments(p.oid) AS arguments FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname IN ('public','vip_auth') ORDER BY n.nspname,p.proname,arguments"),
    schemas:await rows("SELECT nspname FROM pg_namespace WHERE nspname NOT IN ('public','vip_auth','information_schema') AND nspname !~ '^pg_' ORDER BY nspname"),
    extensions:await rows("SELECT extname,extversion FROM pg_extension ORDER BY extname")
  };
}
const EMPTY_STATE_SQL = `SELECT pg_get_userbyid(d.datdba)=current_user AS current_user_owns_database,
 has_schema_privilege(current_user,'public','CREATE') AS public_create_allowed,
 EXISTS(SELECT 1 FROM pg_namespace WHERE nspname='vip_auth') AS auth_schema_exists,
 (SELECT count(*)::int FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public') AS public_relations,
 (SELECT count(*)::int FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public') AS public_functions,
 (SELECT count(*)::int FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public') AS public_types,
 (SELECT count(*)::int FROM pg_namespace WHERE nspname NOT IN ('public','information_schema') AND nspname !~ '^pg_') AS other_user_schemas,
 (SELECT count(*)::int FROM pg_extension WHERE extname <> 'plpgsql') AS unexpected_extensions
 FROM pg_database d WHERE d.datname=current_database()`;
async function initialize(client,{head,systemId,baseSchema,authSchema,verifiers,validateEmpty}) {
  assert.equal(systemId,SYSTEM_ID);assert.match(head,/^[0-9a-f]{40}$/);assert.equal(verifiers.length,3);
  try{
    phase='EMPTY_STAGE6_TARGET_GUARD';
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout='10s'");await client.query("SET LOCAL lock_timeout='5s'");
    await client.query("SET LOCAL idle_in_transaction_session_timeout='15s'");
    await client.query('SELECT pg_advisory_xact_lock(76551005)');
    validateEmpty((await client.query(EMPTY_STATE_SQL)).rows[0]);
    phase='PUBLIC_AND_AUTH_SCHEMA';
    await client.query('SET LOCAL search_path = public');await client.query(baseSchema);
    await client.query('SET LOCAL search_path = pg_catalog, public');await client.query(authSchema);
    await client.query('CREATE TABLE vip_auth.proof_manifest (singleton BOOLEAN PRIMARY KEY CHECK (singleton),head TEXT NOT NULL,system_identifier TEXT NOT NULL)');
    await client.query('INSERT INTO vip_auth.proof_manifest VALUES (true,$1,$2)',[head,systemId]);
    phase='SYNTHETIC_STAGE6_FIXTURE';
    for(const [i,id] of [FIXTURE.doctor,FIXTURE.nurse,FIXTURE.disabled].entries()){
      await client.query('INSERT INTO public.actors(actor_id,actor_role,lifecycle_state) VALUES ($1,$2,$3)',[id,i===1?'NURSE':'DOCTOR',i===2?'DEACTIVATED':'ACTIVE']);
      await client.query('INSERT INTO vip_auth.credentials(actor_id,login_label,verifier,version,enabled) VALUES ($1,$2,$3,1,true)',[id,LABELS[i],verifiers[i]]);
    }
    await client.query("INSERT INTO vip_auth.operating_mode VALUES (true,'DOCTOR_NURSE')");
    await client.query("INSERT INTO vip_auth.delegations VALUES ($1,$2,'FULL',ARRAY[]::text[],1)",[FIXTURE.nurse,FIXTURE.doctor]);
    await client.query("INSERT INTO public.patients(patient_id,clinic_patient_number,name,date_of_birth,profession,phone,gender) VALUES ($1,'CPN-60001','Stage 6 Synthetic Baseline','1990-02-01','Tester','00000000000','Male')",[FIXTURE.patient]);
    validateNewBaseline(await collectBaseline(client,systemId),head);
    await client.query('COMMIT');
  }catch(e){try{await client.query('ROLLBACK');}catch{}throw e;}
}
async function createDatabase(admin,{identity,connectTarget,initializeTarget}) {
  let locked=false,target;
  try{
    assert.equal(await identity(admin,'postgres'),SYSTEM_ID,'Wrong isolated maintenance identity');
    await admin.query('SELECT pg_advisory_lock(76551006)');locked=true;
    const exists=await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[DATABASE]);
    assert.equal(exists.rows.length,0,'Target database exists; no retry/reset/resume');
    phase='CREATE_NEW_STAGE6_DATABASE';
    await admin.query('CREATE DATABASE roby_web_proof_stage6 TEMPLATE template0');
    target=await connectTarget();
    assert.equal(await identity(target,DATABASE),SYSTEM_ID);
    await initializeTarget(target);
  }finally{
    try{if(target)await target.end();}finally{if(locked)await admin.query('SELECT pg_advisory_unlock(76551006)');}
  }
}
async function hiddenPassword(label) {
  const input=process.stdin,output=process.stdout;
  assert.ok(input.isTTY&&output.isTTY&&input.setRawMode,'Hidden owner TTY input required');
  assert.equal(input.isRaw,false);
  output.write('Synthetic '+label+' password (hidden; never send to chat): ');
  return new Promise((resolve,reject)=>{
    const bytes=[];
    const finish=(error)=>{
      input.off('data',onData);input.off('end',onEnd);input.setRawMode(false);input.pause();output.write('\n');
      const value=Buffer.from(bytes).toString('utf8');bytes.fill(0);error?reject(error):resolve(value);
    };
    const onEnd=()=>finish(new Error('TTY input ended'));
    const onData=data=>{
      for(const byte of data){
        if(byte===3||byte===4||byte===27)return finish(new Error('Input cancelled'));
        if(byte===10||byte===13)return finish();
        if(byte===127||byte===8){bytes.pop();continue;}
        if(byte<32||bytes.length>=1024)return finish(new Error('Invalid bounded TTY input'));
        bytes.push(byte);
      }
    };
    input.setRawMode(true);input.on('data',onData);input.once('end',onEnd);input.resume();
  });
}
async function shutdownOwned(app,check) {
  let closing;
  return function close(){
    if(!closing)closing=(async()=>{await app.close();assert.equal(app.server.listening,false);await check();})();
    return closing;
  };
}
async function execute({mode,head}) {
  phase='SOURCE_AND_PRIVATE_PATH_PREFLIGHT';
  const sources=sourcePreflight(REPO,head),before=snapshot(REPO);
  const paths=devicePaths(process.env.HOME,head);
  const tls=publicTls(paths);
  const guards=require('../auth/postgres-proof-guards.cjs');
  const cluster=guards.clusterPaths(process.env.HOME,process.env.PREFIX||'/data/data/com.termux/files/usr');
  const pid=guards.preflightCluster(cluster);process.kill(Number(pid),0);
  await unusedPort();
  assert.deepEqual(snapshot(REPO),before);
  console.log('SOURCE_PUBLIC_TLS_CLUSTER_METADATA_AND_UNUSED_PORT=PASS_NOT_SQL_OR_BROWSER_PROOF');
  if(mode==='preflight'){console.log('STAGE6_DEVICE_PREFLIGHT=PASS_FOR_REPORTED_CHECKS');return;}
  if(mode==='build'){
    phase='FRESH_BUILD_TARGETS';
    assert.equal(fs.existsSync(paths.build),false);assert.equal(fs.existsSync(paths.run),false);
    fs.mkdirSync(paths.build,{mode:0o700});fs.mkdirSync(paths.run,{mode:0o700});
    const vite=path.join(REPO,'node_modules/vite/bin/vite.js');readRegular(vite);
    phase='SEPARATE_LOCKED_VITE_BUILD';
    execFileSync(process.execPath,[vite,'build','--config',path.join(REPO,'vite.stage6.config.ts'),'--outDir',paths.build],{cwd:REPO,stdio:'pipe',timeout:120000,maxBuffer:4*1024*1024});
    const assets=buildAssets(paths.build);
    assert.deepEqual(sourcePreflight(REPO,head),sources);assert.deepEqual(snapshot(REPO),before);
    writeNew(paths.manifest,{head,origin:ORIGIN,database:DATABASE,sources,tls:tls.review,assets});
    console.log('SEPARATE_BUILD_AND_BYTE_MANIFEST=PASS');console.log('MANIFEST='+paths.manifest);return;
  }
  const manifest=loadBuild(paths,head,sources,tls.review);
  const proof=require('../auth/postgres-proof.cjs');
  if(mode==='prepare'){
    phase='HIDDEN_SYNTHETIC_INPUT';
    const {createVerifier,normalizePassword}=require('../auth/password-verifier');
    const verifiers=[],used=new Set();
    for(const label of LABELS){
      let password=normalizePassword(await hiddenPassword(label));
      let confirmation=normalizePassword(await hiddenPassword(label+' confirmation'));
      assert.equal(password,confirmation,'Synthetic password confirmation mismatch');confirmation=undefined;
      const d=hash(password);assert.equal(used.has(d),false,'Separate synthetic passwords required');used.add(d);
      verifiers.push(await createVerifier(password));password=undefined;
    }
    assert.deepEqual(sourcePreflight(REPO,head),sources);assert.deepEqual(snapshot(REPO),before);publicTls(paths);
    assert.equal(guards.preflightCluster(cluster),pid);process.kill(Number(pid),0);
    assert.equal(fs.existsSync(path.join(paths.run,'database-baseline.json')),false,'Existing preparation record; no retry');
    const baseSchema=readRegular(path.join(REPO,'backend/persistence/schema.sql'));
    const authSchema=readRegular(path.join(REPO,'backend/persistence/auth-schema.sql'));
    assert.equal(hash(baseSchema),sources['backend/persistence/schema.sql']);assert.equal(hash(authSchema),sources['backend/persistence/auth-schema.sql']);
    const {Client}=require('pg');
    const admin=new Client(proof.connectionOptions(cluster,'postgres'));
    try{
      phase='ISOLATED_MAINTENANCE_CONNECTION';await admin.connect();
      await createDatabase(admin,{
        identity:(client,database)=>proof.identity(client,cluster,database),
        async connectTarget(){const client=new Client(proof.connectionOptions(cluster,DATABASE));try{await client.connect();return client;}catch(e){await client.end().catch(()=>{});throw e;}},
        async initializeTarget(client){
          await initialize(client,{head,systemId:SYSTEM_ID,baseSchema:baseSchema.toString(),authSchema:authSchema.toString(),verifiers,validateEmpty:guards.validateEmptyAuthDatabase});
          validateNewBaseline(await collectBaseline(client,SYSTEM_ID),head);
          assert.deepEqual(sourcePreflight(REPO,head),sources);assert.deepEqual(snapshot(REPO),before);
          writeNew(path.join(paths.run,'database-baseline.json'),{head,database:DATABASE,systemId:SYSTEM_ID,schemaHash:hash(JSON.stringify(await schemaState(client)))});
        }
      });
      assert.deepEqual(snapshot(REPO),before);
      console.log('NEW_STAGE6_DATABASE_AND_COMMITTED_SYNTHETIC_BASELINE=PASS');
      console.log('STAGE4_STAGE5_AND_HISTORICAL_DATABASE_CONNECTIONS=NONE');
    }finally{verifiers.fill(undefined);await admin.end();}
    return;
  }
  phase='EXISTING_STAGE6_BASELINE_BEFORE_LISTEN';
  const {Client}=require('pg');
  const client=new Client(proof.connectionOptions(cluster,DATABASE));
  try{
    await client.connect();assert.equal(await proof.identity(client,cluster,DATABASE),SYSTEM_ID);
    await client.query('BEGIN READ ONLY');
    validateNewBaseline(await collectBaseline(client,SYSTEM_ID),head);
    const record=JSON.parse(readRegular(path.join(paths.run,'database-baseline.json'),16384,true));
    assert.deepEqual(record,{head,database:DATABASE,systemId:SYSTEM_ID,schemaHash:hash(JSON.stringify(await schemaState(client)))});
    assert.equal((await client.query(EMPTY_STATE_SQL)).rows[0].current_user_owns_database,true);
    await client.query('COMMIT');
  }finally{await client.end();}
  const key=readRegular(path.join(paths.tls,'server.key.pem'),16384,true);
  const runtime=require('../api/stage6-web-test-runtime.cjs');
  runtime.tlsOptions({key,cert:tls.cert});
  assert.deepEqual(snapshot(REPO),before);await unusedPort();
  phase='OWNED_LOOPBACK_HTTPS_START';
  const {app,address}=await runtime.startStage6WebTestRuntime({token:'ROBY_STAGE6_WEB_START',expectedHead:head,buildHead:head,tls:{key,cert:tls.cert},assetsDirectory:paths.build,manifest:manifest.assets});
  let close;
  try{
    close=await shutdownOwned(app,()=>assert.deepEqual(snapshot(REPO),before));
    assert.equal(address,ORIGIN);assert.equal(app.server.address().address,'127.0.0.1');
    assert.deepEqual(snapshot(REPO),before);
  }catch(e){await app.close();throw e;}
  const stopped=async()=>{
    try{await close();console.log('OWNED_LISTENER_AND_POOL_CLOSED=PASS');console.log('PROTECTED_SOURCE_STATUS_INDEX_AND_UNTRACKED_BYTES=UNCHANGED');}
    catch{console.error('OWNED_CLOSE=FAILED_INSPECT_WITHOUT_CLUSTER_CLEANUP');process.exitCode=1;}
  };
  process.once('SIGINT',stopped);process.once('SIGTERM',stopped);
  console.log('LISTENER_ADDRESS='+address);console.log('BROWSER_TLS_AND_W01_W16_PROOF=NOT_ESTABLISHED');
  console.log('FOREGROUND_OWNER_CTRL_C_CLOSES_ONLY_THIS_LISTENER');
  return close;
}
async function main(args=process.argv.slice(2)) {
  let before,ownedClose;
  try{
    const parsed=parseArgs(args);
    before=snapshot(REPO);
    ownedClose=await execute(parsed);
    assert.deepEqual(snapshot(REPO),before);
    console.log('PROTECTED_SOURCE_STATUS_INDEX_AND_UNTRACKED_BYTES=UNCHANGED');
  }catch(error){
    if(ownedClose)try{await ownedClose();}catch{console.error('OWNED_CLOSE=FAILED_INSPECT');}
    console.error('STAGE6_DEVICE_COMMAND=FAILED_RETAIN_BOUNDED_STATE');console.error('FAILED_PHASE='+phase);
    if(typeof error.code==='string'&&/^[A-Z0-9_]{1,16}$/.test(error.code))console.error('ERROR_CODE='+error.code);
    process.exitCode=1;
  }finally{
    if(before){try{assert.deepEqual(snapshot(REPO),before);}catch{if(ownedClose)try{await ownedClose();}catch{}console.error('PROTECTED_STATE=CHANGED_INSPECT_WITHOUT_RESET');process.exitCode=1;}}
    console.log('CLUSTER_STOP_DROP_RESET_AND_CLEANUP=NONE');
    console.log('ANDROID_TRUST_CHANGES_AND_PRODUCTION_CLINICAL_USE=NONE');
  }
}
module.exports={parseArgs,safeDirectory,readRegular,snapshot,sourcePreflight,devicePaths,verifyPublicCertificates,validateAssetMap,buildAssets,validateBuildManifest,validateNewBaseline,collectBaseline,schemaState,initialize,createDatabase,shutdownOwned,FIXTURE,LABELS,DATABASE,SYSTEM_ID,ORIGIN,CA_HASH,LEAF_HASH,TOKENS};
if(require.main===module)void main();
