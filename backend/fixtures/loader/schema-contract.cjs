'use strict';
const {FixtureError}=require('./safety.cjs');
const columns={
 patients:{patient_id:'uuid',clinic_patient_number:'text',name:'text',date_of_birth:'date',profession:'text',phone:'text',gender:'text'},
 patient_intakes:{patient_id:'uuid'},
 past_history_items:{item_id:'uuid',patient_id:'uuid',category:'text',position:'integer',content:'text'},
 clinic_days:{clinic_day_id:'text',working_date:'date',status:'text',lifecycle:'text',counter:'integer',opened_at:'timestamp with time zone',closed_at:'timestamp with time zone',closed_by:'text'},
 actors:{actor_id:'uuid',actor_role:'text',lifecycle_state:'text'},
};
const fk=[['patient_intakes','patient_id','patients','patient_id'],['past_history_items','patient_id','patient_intakes','patient_id']];
const unique=[['patients','patient_id'],['patients','clinic_patient_number'],['patient_intakes','patient_id'],['past_history_items','item_id'],['past_history_items','patient_id,category,position'],['clinic_days','clinic_day_id'],['clinic_days','working_date'],['actors','actor_id']];
function validateSchema(schema){
 const fail=()=>{throw new FixtureError('SCHEMA_MISMATCH');};
 if(schema.schemas.some(s=>!['public','vip_auth','roby_fixture'].includes(s)))fail();
 const actual={};for(const c of schema.columns){if(c.schema!=='public')continue;(actual[c.table]??={})[c.column]=c.type;}
 if(JSON.stringify(Object.keys(actual).sort())!==JSON.stringify(Object.keys(columns).sort()))fail();
 for(const [table,spec]of Object.entries(columns)){if(JSON.stringify(Object.keys(actual[table]).sort())!==JSON.stringify(Object.keys(spec).sort()))fail();for(const [key,type]of Object.entries(spec))if(actual[table][key]!==type)fail();}
 const defaults={'patients.patient_id':'uuidv7','patients.clinic_patient_number':"'CPN-'||nextval'clinic_patient_number_seq'",'clinic_days.counter':'0','clinic_days.opened_at':'CURRENT_TIMESTAMP','actors.actor_id':'uuidv7','actors.lifecycle_state':"'ACTIVE'"};
 for(const c of schema.columns.filter(c=>c.schema==='public')){const normalized=c.default?.replace(/::text|::regclass/g,'').replace(/[\s()]/g,'').replace(/public\./g,'')??null;if(normalized!==(defaults[c.table+'.'+c.column]??null))fail();}
 const nullable=new Set(['patients.date_of_birth','clinic_days.closed_at','clinic_days.closed_by']);
 for(const c of schema.columns.filter(c=>c.schema==='public'))if(c.nullable!==(nullable.has(c.table+'.'+c.column)?'YES':'NO'))fail();
 if(!schema.sequences.includes('public.clinic_patient_number_seq'))fail();
 if(schema.sequences.some(s=>s!=='public.clinic_patient_number_seq'))fail();
 for(const expected of fk)if(!schema.foreignKeys.some(k=>JSON.stringify(k)===JSON.stringify(expected)))fail();
 if(schema.foreignKeys.length!==fk.length)fail();
 if(schema.uniqueKeys.length!==unique.length)fail();
 for(const expected of unique)if(!schema.uniqueKeys.some(k=>JSON.stringify(k)===JSON.stringify(expected)))fail();
 const required={patients:1,past_history_items:5,clinic_days:3,actors:2};
 for(const [table,count]of Object.entries(required))if(schema.checks.filter(k=>k.table===table).length!==count)fail();
 // PostgreSQL deparses the known lowercase column position as "position".
 // Normalize this exact identifier only; other quoted identifiers stay distinct.
 const norm=s=>s.replace(/"position"/g,'position').replace(/::text/g,'').replace(/[\s()]/g,'');
 const checks={
  patients:["CHECKgender=ANYARRAY['Male','Female']"],
  actors:["CHECKactor_role=ANYARRAY['DOCTOR','NURSE']","CHECKlifecycle_state=ANYARRAY['ACTIVE','DEACTIVATED']"],
  clinic_days:["CHECKstatus=ANYARRAY['OPEN','CLOSED']","CHECKlifecycle=ANYARRAY['WORKING','CONCLUDED']","CHECKclosed_byISNULLORclosed_by='Doctor'"],
  past_history_items:["CHECKcategory=ANYARRAY['chronicIllnesses','knownAllergies','surgicalHistory','familyHistory','lifestyleNotes']","CHECKposition>=0ANDposition<32","CHECKchar_lengthcontent>0ANDchar_lengthcontent<=2000","CHECKcategory<>'lifestyleNotes'ORposition=0","CHECKcategory='lifestyleNotes'ORchar_lengthcontent<=500"]
 };
 for(const [table,list]of Object.entries(checks))if(JSON.stringify(schema.checks.filter(c=>c.table===table).map(c=>norm(c.definition)).sort())!==JSON.stringify(list.sort()))fail();

 // Refuse extra user tables/types/functions; only the project model and the owned ledger are allowed.
 if(schema.otherRelations.length||schema.functions.length||schema.extensions.some(e=>e!=='plpgsql'))fail();
 if(schema.schemas.includes('vip_auth')){const names=[...new Set(schema.columns.filter(c=>c.schema==='vip_auth').map(c=>c.table))].sort();if(JSON.stringify(names)!==JSON.stringify(['credentials','delegations','login_attempts','operating_mode','sessions']))fail();}
 if(schema.ledgerRelations?.some(r=>!(['datasets:r','datasets_pkey:i'].includes(r.relname+':'+r.relkind))))fail();
 if(schema.schemas.includes('roby_fixture')&&schema.ledgerOwns!==true)fail();
 const ledger=schema.columns.filter(c=>c.schema==='roby_fixture');
 if(ledger.length){if(JSON.stringify(schema.ledgerKeys)!==JSON.stringify([['datasets','namespace']]))fail();const keys=ledger.map(c=>c.column).sort();if(JSON.stringify(keys)!==JSON.stringify(['namespace','dataset_hash','projection_hash','payload'].sort())||ledger.some(c=>c.table!=='datasets'||c.nullable!=='NO'||c.type!==(c.column==='payload'?'jsonb':'text')))fail();}
 return true;
}
module.exports={columns,validateSchema};
