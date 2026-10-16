'use strict';
// Actual SQL adapter. Values use bind parameters; no connection defaults or URLs.
const {validateSchema}=require('./schema-contract.cjs');
const {requireTrue,validateIdentity}=require('./safety.cjs');
const {sha,serialize}=require('../dataset.cjs');
const TABLES=['patients','patient_intakes','past_history_items','clinic_days','actors'];
const KEYS={patients:'patient_id',patient_intakes:'patient_id',past_history_items:'item_id',clinic_days:'clinic_day_id',actors:'actor_id'};
async function inspect(client,config){
 const identity=(await client.query(`SELECT current_database() AS database,current_setting('data_directory') AS data_directory,
 current_setting('unix_socket_directories') AS sockets,current_setting('port') AS port,current_setting('listen_addresses') AS tcp,
 inet_server_addr()::text AS address,(pg_control_system()).system_identifier::text AS system_id,
 current_setting('server_version_num') AS version,current_setting('search_path') AS search_path,
 pg_get_userbyid(datdba)=current_user AS owns FROM pg_database WHERE datname=current_database()`)).rows[0];
 validateIdentity(identity,config);
 const schemas=(await client.query("SELECT nspname FROM pg_namespace WHERE nspname !~ '^pg_' AND nspname<>'information_schema' ORDER BY nspname")).rows.map(r=>r.nspname);
 const columns=(await client.query("SELECT table_schema AS schema,table_name AS table,column_name AS column,data_type AS type,is_nullable AS nullable,column_default AS default FROM information_schema.columns WHERE table_schema IN ('public','vip_auth','roby_fixture') ORDER BY table_schema,table_name,ordinal_position")).rows;
 const constraints=(await client.query("SELECT n.nspname AS schema,c.relname AS table,k.contype AS type,pg_get_constraintdef(k.oid) AS definition FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname IN ('public','vip_auth','roby_fixture') ORDER BY n.nspname,c.relname,k.conname")).rows;
 const publicRelations=(await client.query("SELECT c.relname,c.relkind FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' ORDER BY c.relname")).rows;
 const foreignKeys=constraints.filter(c=>c.schema==='public'&&c.type==='f').map(c=>{const m=c.definition.match(/^FOREIGN KEY \(([^)]+)\) REFERENCES (?:public\.)?([a-z_]+)\(([^)]+)\)/);return m?[c.table,m[1],m[2],m[3]]:[];});
 const uniqueKeys=constraints.filter(c=>c.schema==='public'&&['p','u'].includes(c.type)).map(c=>[c.table,(c.definition.match(/\(([^)]+)\)/)?.[1]??'').split(',').map(name=>{name=name.trim();return name==='"position"'?'position':name;}).join(',')]);
 const ledgerRelations=schemas.includes('roby_fixture')?(await client.query("SELECT c.relname,c.relkind FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='roby_fixture' ORDER BY c.relname")).rows:[];
 const ledgerOwns=schemas.includes('roby_fixture')?(await client.query("SELECT n.nspowner=(SELECT oid FROM pg_roles WHERE rolname=current_user) AND c.relowner=(SELECT oid FROM pg_roles WHERE rolname=current_user) AS owns FROM pg_namespace n JOIN pg_class c ON c.relnamespace=n.oid WHERE n.nspname='roby_fixture' AND c.relname='datasets'")).rows[0]?.owns:null;
 const functions=(await client.query("SELECT n.nspname,p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname IN ('public','roby_fixture') ORDER BY n.nspname,p.proname")).rows;
 const extensions=(await client.query('SELECT extname FROM pg_extension ORDER BY extname')).rows.map(r=>r.extname);
 const ledgerKeys=constraints.filter(c=>c.schema==='roby_fixture'&&c.type==='p').map(c=>[c.table,(c.definition.match(/\(([^)]+)\)/)?.[1]??'').replace(/ /g,'')]);
 const schema={schemas,columns,ledgerKeys,ledgerRelations,ledgerOwns,foreignKeys,uniqueKeys,checks:constraints.filter(c=>c.schema==='public'&&c.type==='c'),sequences:publicRelations.filter(r=>r.relkind==='S').map(r=>'public.'+r.relname),otherRelations:publicRelations.filter(r=>!['r','i','S'].includes(r.relkind)),functions,extensions};
 validateSchema(schema);
 const tables={};for(const name of TABLES)tables[name]=(await client.query('SELECT row_to_json(t) AS row FROM public.'+name+' t ORDER BY '+KEYS[name])).rows.map(r=>r.row);
 const sequence=(await client.query('SELECT last_value::text,is_called FROM public.clinic_patient_number_seq')).rows;
 const registry=schemas.includes('roby_fixture')?(await client.query('SELECT namespace,dataset_hash,projection_hash,payload FROM roby_fixture.datasets ORDER BY namespace')).rows:[];
 // Auth rows never leave SQL: only a digest is collected for preservation checking.
 const authDigest=schemas.includes('vip_auth')?(await client.query(`SELECT md5((SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY actor_id)::text,'[]') FROM vip_auth.credentials t)) AS credentials,
 md5((SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY digest)::text,'[]') FROM vip_auth.sessions t)) AS sessions,
 md5((SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY key)::text,'[]') FROM vip_auth.login_attempts t)) AS attempts,
 md5((SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY singleton)::text,'[]') FROM vip_auth.operating_mode t)) AS mode,
 md5((SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY nurse_id)::text,'[]') FROM vip_auth.delegations t)) AS delegations`)).rows[0]:null;
 return {identity,schema,tableState:tables,sequence,registry,authDigest,stateHash:sha(serialize({tables,sequence,registry,authDigest,schema}))};
}
async function lock(client){await client.query('SELECT pg_advisory_xact_lock($1)',[764412]);await client.query('LOCK TABLE public.patients,public.patient_intakes,public.past_history_items,public.clinic_days IN SHARE ROW EXCLUSIVE MODE');}
async function insert(client,projection){
 for(const p of projection.patients)await client.query('INSERT INTO public.patients(patient_id,clinic_patient_number,name,date_of_birth,profession,phone,gender) VALUES ($1,$2,$3,$4,$5,$6,$7)',[p.patientId,p.clinicPatientNumber,p.name,p.dateOfBirth,p.profession,p.phone,p.gender]);
 for(const id of projection.intakes)await client.query('INSERT INTO public.patient_intakes(patient_id) VALUES ($1)',[id]);
 for(const h of projection.history)await client.query('INSERT INTO public.past_history_items(item_id,patient_id,category,position,content) VALUES ($1,$2,$3,$4,$5)',[h.itemId,h.patientId,h.category,h.position,h.content]);
 for(const d of projection.days)await client.query('INSERT INTO public.clinic_days(clinic_day_id,working_date,status,lifecycle,counter,opened_at,closed_at,closed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[d.id,d.workingDate,d.status,d.lifecycle,d.counter,d.openedAt,d.closedAt??null,d.closedBy??null]);
 // ALTER SEQUENCE RESTART is transactional, unlike setval. Only a validated bounded
 // decimal is interpolated: PostgreSQL does not accept bind parameters in this DDL.
 const seq=(await client.query('SELECT last_value::text,is_called FROM public.clinic_patient_number_seq')).rows[0];
 const cpns=(await client.query('SELECT clinic_patient_number FROM public.patients')).rows.map(r=>r.clinic_patient_number);
 let maximum=0n;for(const cpn of cpns){requireTrue(/^CPN-[1-9][0-9]{0,18}$/.test(cpn),'UNEXPECTED_CPN_FORMAT');const n=BigInt(cpn.slice(4));if(n>maximum)maximum=n;}
 const next=BigInt(seq.last_value)+(seq.is_called?1n:0n);requireTrue(maximum<9223372036854775807n,'CPN_RANGE_EXHAUSTED');
 if(next<=maximum)await client.query('ALTER SEQUENCE public.clinic_patient_number_seq RESTART WITH '+String(maximum+1n));
}
async function writeRegistry(client,namespace,dataset,projectionHash){
 await client.query('CREATE SCHEMA IF NOT EXISTS roby_fixture');
 await client.query('CREATE TABLE IF NOT EXISTS roby_fixture.datasets(namespace TEXT PRIMARY KEY,dataset_hash TEXT NOT NULL,projection_hash TEXT NOT NULL,payload JSONB NOT NULL)');
 await client.query('INSERT INTO roby_fixture.datasets(namespace,dataset_hash,projection_hash,payload) VALUES ($1,$2,$3,$4::jsonb)',[namespace,dataset.datasetHash,projectionHash,serialize({golden:dataset.golden,extension:dataset.extension})]);
}
module.exports={inspect,lock,insert,writeRegistry};
