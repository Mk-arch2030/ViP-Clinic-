const test=require('node:test'),assert=require('node:assert/strict');
const {validateSchema,columns}=require('../loader/schema-contract.cjs');
const sql=require('../loader/postgres.cjs');
const {loadDataset,projection}=require('../dataset.cjs');
const {TOKEN,DATABASE,NAMESPACE}=require('../loader/safety.cjs');
function schema(){
 const nullable=new Set(['patients.date_of_birth','clinic_days.closed_at','clinic_days.closed_by']);
 const defaults={'patients.patient_id':'uuidv7()','patients.clinic_patient_number':"('CPN-'::text || (nextval('clinic_patient_number_seq'::regclass))::text)",'clinic_days.counter':'0','clinic_days.opened_at':'CURRENT_TIMESTAMP','actors.actor_id':'uuidv7()','actors.lifecycle_state':"'ACTIVE'::text"};
 const defs={patients:["CHECK (gender = ANY (ARRAY['Male'::text, 'Female'::text]))"],actors:["CHECK (actor_role = ANY (ARRAY['DOCTOR'::text,'NURSE'::text]))","CHECK (lifecycle_state = ANY (ARRAY['ACTIVE'::text,'DEACTIVATED'::text]))"],clinic_days:["CHECK (status = ANY (ARRAY['OPEN'::text,'CLOSED'::text]))","CHECK (lifecycle = ANY (ARRAY['WORKING'::text,'CONCLUDED'::text]))","CHECK ((closed_by IS NULL) OR (closed_by = 'Doctor'::text))"],past_history_items:["CHECK (category = ANY (ARRAY['chronicIllnesses'::text,'knownAllergies'::text,'surgicalHistory'::text,'familyHistory'::text,'lifestyleNotes'::text]))","CHECK ((position >= 0) AND (position < 32))","CHECK ((char_length(content) > 0) AND (char_length(content) <= 2000))","CHECK ((category <> 'lifestyleNotes'::text) OR (position = 0))","CHECK ((category = 'lifestyleNotes'::text) OR (char_length(content) <= 500))"]};
 return {schemas:['public'],columns:Object.entries(columns).flatMap(([table,spec])=>Object.entries(spec).map(([column,type])=>({schema:'public',table,column,type,nullable:nullable.has(table+'.'+column)?'YES':'NO',default:defaults[table+'.'+column]??null}))),foreignKeys:[['patient_intakes','patient_id','patients','patient_id'],['past_history_items','patient_id','patient_intakes','patient_id']],uniqueKeys:[['patients','patient_id'],['patients','clinic_patient_number'],['patient_intakes','patient_id'],['past_history_items','item_id'],['past_history_items','patient_id,category,position'],['clinic_days','clinic_day_id'],['clinic_days','working_date'],['actors','actor_id']],checks:Object.entries(defs).flatMap(([table,defs])=>defs.map(definition=>({table,definition}))),sequences:['public.clinic_patient_number_seq'],otherRelations:[],functions:[],extensions:['plpgsql'],ledgerKeys:[]};
}
test('schema contract accepts current structural model and rejects missing migrations, extra columns/checks/defaults/schemas',()=>{
 assert.equal(validateSchema(schema()),true);
 for(const change of [s=>s.columns=s.columns.filter(c=>c.table!=='patient_intakes'),s=>s.schemas.push('unexpected'),s=>s.columns.push({schema:'public',table:'patients',column:'secret',type:'text'}),s=>s.checks[0].definition='CHECK (true)',s=>s.columns[0].default='wrong()',s=>s.foreignKeys=[],s=>s.uniqueKeys.pop(),s=>s.functions.push({proname:'unexpected'}),s=>s.extensions.push('dblink')]){const s=schema();change(s);assert.throws(()=>validateSchema(s),e=>e.code==='SCHEMA_MISMATCH');}
});
test('SQL adapter checks actual database identity before schema or row access',async()=>{
 const calls=[];const client={async query(text){calls.push(text);return {rows:[{database:'roby_intake_proof_stage6'}]};}};
 await assert.rejects(sql.inspect(client,{database:DATABASE,dataDirectory:'/tmp/data',socketDirectory:'/tmp/socket',port:55449,systemId:'8000000000000000001'}),e=>e.code==='DATABASE_IDENTITY_MISMATCH');assert.equal(calls.length,1);assert.ok(!calls[0].includes('verifier'));
});
test('identity accepts PostgreSQL search_path whitespace without accepting different schemas or ordering',()=>{
 const {validateIdentity}=require('../loader/safety.cjs');
 const config={database:DATABASE,dataDirectory:'/tmp/data',socketDirectory:'/tmp/socket',port:55449,systemId:'8000000000000000001'};
 const row={database:DATABASE,data_directory:config.dataDirectory,sockets:config.socketDirectory,port:'55449',system_id:config.systemId,tcp:'',address:null,owns:true,version:'180002'};
 for(const search_path of ['pg_catalog,public','pg_catalog, public'])assert.doesNotThrow(()=>validateIdentity({...row,search_path},config));
 for(const search_path of ['public,pg_catalog','pg_catalog,public,evil','pg_catalog,public,public','pg_catalog,"public"','"$user",public','pg_catalog,publicevil','pg_ catalog,public',null])assert.throws(()=>validateIdentity({...row,search_path},config),e=>e.code==='DATABASE_IDENTITY_MISMATCH');
});
test('SQL adapter uses parameterized values and bounded transactional sequence restart, not nontransactional setval',async()=>{
 const calls=[];const p=projection(loadDataset());p.history[0].content="SYNTHETIC '); DROP TABLE patients; --";
 const client={async query(sql,params){calls.push({sql,params});if(sql.startsWith('SELECT last_value'))return {rows:[{last_value:'1',is_called:false}]};if(sql.startsWith('SELECT clinic_patient_number'))return {rows:p.patients.map(p=>({clinic_patient_number:p.clinicPatientNumber}))};return {rows:[]};}};
 await sql.insert(client,p);const inserts=calls.filter(c=>c.sql.startsWith('INSERT'));assert.equal(inserts.length,44);
 assert.ok(inserts.every(c=>c.sql.includes('$1')&&Array.isArray(c.params)));assert.ok(!inserts.some(c=>c.sql.includes('DROP TABLE')));assert.ok(inserts.some(c=>c.params.includes(p.history[0].content)));
 assert.ok(calls.some(c=>c.sql==='ALTER SEQUENCE public.clinic_patient_number_seq RESTART WITH 90005'));assert.ok(!calls.some(c=>c.sql.includes('setval')));
});
test('CLI wrong owner database or secret config refuses before pg driver loads and never prints input values',async()=>{
 const cp=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'fixture-cli-denial-'));
 try{const file=path.join(root,'config.json');fs.writeFileSync(file,JSON.stringify({database:'roby_intake_proof_stage6',port:55449,user:'fixture_user',dataDirectory:'/tmp/roby-golden-fixtures-disposable-unit/data',socketDirectory:'/tmp/roby-golden-fixtures-disposable-unit/socket',systemId:'8000000000000000001',namespace:NAMESPACE}));
 const entry=path.join(__dirname,'../loader/cli.cjs');const script="const M=require('node:module'),load=M._load;M._load=function(id,...a){if(id==='pg')throw Error('PG_DRIVER_MUST_NOT_LOAD');return load.call(this,id,...a)};require("+JSON.stringify(entry)+").main(['load',"+JSON.stringify(TOKEN)+","+JSON.stringify(file)+",'/missing/plan']).then(()=>process.exit(2)).catch(e=>{console.log(e.code);if(e.code!=='DISPOSABLE_DATABASE_REQUIRED')process.exitCode=1;});";
 const env=Object.fromEntries(Object.entries(process.env).filter(([k])=>!k.startsWith('PG')&&k!=='DATABASE_URL'));
 const output=cp.execFileSync(process.execPath,['-e',script],{encoding:'utf8',env});assert.equal(output.trim(),'DISPOSABLE_DATABASE_REQUIRED');
 fs.writeFileSync(file,JSON.stringify({password:'DO_NOT_PRINT_SYNTHETIC_SECRET'}));const result=cp.spawnSync(process.execPath,[entry,'load',TOKEN,file,'/missing/plan'],{encoding:'utf8',env});assert.equal(result.status,1);assert.ok(!result.stdout.includes('DO_NOT_PRINT'));assert.ok(!result.stderr.includes('DO_NOT_PRINT'));assert.ok(result.stderr.includes('AMBIGUOUS_CONFIGURATION'));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
