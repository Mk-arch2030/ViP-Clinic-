import React,{useEffect,useState,useRef} from 'react';
import type { ClinicPatient } from '../integration/clinic-boundary';
import type { ConnectedPatientSession } from '../integration/connected-patient-session';
import {createCaseApi,type CaseIntent,type CaseOutcome} from '../integration/case-api';
import {createCaseJournal,type CaseJournal} from '../integration/case-journal';
import {ApiFailure} from '../integration/web-api-client';
export function CaseCreatePanel({patient,model,language}:{patient:ClinicPatient|null;model:ConnectedPatientSession;language:'ar'|'en'}) {
 const ar=language==='ar';const [summary,setSummary]=useState('');const [pending,setPending]=useState(false);const [outcome,setOutcome]=useState<CaseOutcome|null>(null);const [notice,setNotice]=useState('');const [operation,setOperation]=useState<string|null>(null);
 const busy=useRef(false),generation=useRef(0),intent=useRef<CaseIntent|null>(null),journal=useRef<CaseJournal|null>(null);
 const [view,setView]=useState(model.getSnapshot());
 useEffect(()=>{journal.current=createCaseJournal(()=>window.localStorage,navigator.locks);try{setOperation(journal.current.read());}catch{setNotice('storage');}let actor=model.getSnapshot().session.session?.actorIdentityReference;
 const unsubscribe=model.subscribe(()=>{const next=model.getSnapshot();const nextActor=next.session.session?.actorIdentityReference;if(nextActor!==actor||next.session.state!=='authenticated'){generation.current++;intent.current=null;setSummary('');setOutcome(null);}actor=nextActor;setView(next);});return()=>{generation.current++;unsubscribe();};},[model]);
 useEffect(()=>{if(!operation)setSummary('');},[patient?.patientId,operation]);
 const session=view.session;const allowed=session.state==='authenticated'&&session.session?.role==='Doctor'&&!session.mutationsBlocked&&!session.logoutUnconfirmed&&!session.registrationUnconfirmed&&!session.busy;
 async function run(mode:'create'|'recover'|'retry'){
  if(busy.current||!allowed||!session.session||!journal.current)return;
  busy.current=true;setPending(true);setNotice('');const g=generation.current;
  try{
   const api=createCaseApi(window.location.origin);let id=journal.current.read();
   if(mode==='create'){
    if(!patient||!summary.trim()||summary.length>4000||summary.includes('\0'))throw new ApiFailure(400,'invalid');
    id=await journal.current.reserve();setOperation(id);intent.current={operationId:id,patientId:patient.patientId,problemSummary:summary};
   }
   if(!id)throw Error('Missing operation');
   if(g!==generation.current)return;
   const result=mode==='recover'?await api.recover(id,session.session.csrf):await api.create(intent.current??(()=>{throw Error('Original intent unavailable');})(),session.session.csrf);
   if(g!==generation.current)return;
   setOutcome(result);setNotice(result.status==='UNKNOWN'?'unknown':'');
  }catch(e){if(g===generation.current){setNotice(e instanceof ApiFailure?e.kind:'storage');if(e instanceof ApiFailure&&e.status===401)await model.refresh();}}
  finally{busy.current=false;setPending(false);}
 }
 async function nextCase(){if(busy.current||outcome?.status!=='COMMITTED'||!operation||!journal.current)return;busy.current=true;setPending(true);try{await journal.current.releaseConfirmed(operation);intent.current=null;setOperation(null);setOutcome(null);setSummary('');setNotice('');}catch{setNotice('storage');}finally{busy.current=false;setPending(false);}}
 const messages:Record<string,[string,string]>={unknown:['لا يوجد إيصال مؤكد لهذه الجلسة. هذا لا يثبت فشل العملية؛ لا تبدأ عملية بديلة.','No receipt found for this actor. This does not prove rollback; do not start a replacement.'],storage:['تعذر ضمان حفظ هوية العملية؛ توقفت الكتابة.','Operation identity cannot be safely maintained; writes stopped.'],conflict:['هوية العملية مرتبطة بطلب مختلف؛ راجع الإيصال.','Operation identity conflicts with another intent; recover the receipt.'],unauthorized:['أعد الدخول من البوابة الخارجية ثم استرجع الإيصال.','Sign in through the external gate, then recover the receipt.'],forbidden:['الحساب أو الطلب غير مسموح.','Account or request denied.'],invalid:['راجع وصف الحالة.','Check the clinical problem summary.'],'not-found':['المريض غير موجود أو العملية غير متاحة.','Patient not found or operation unavailable.'],'outcome-unknown':['النتيجة غير مؤكدة؛ استرجع الإيصال قبل أي محاولة جديدة.','Outcome uncertain; recover the receipt before any new operation.']};
 return <section className="theme-panel rounded-xl p-4 mb-4" aria-label={ar?'إنشاء حالة سريرية':'Create clinical case'}>
  <h2>{ar?'إنشاء حالة سريرية':'Create clinical case'}</h2>
  <p>{ar?'إنشاء الحالة لا يسجل وصولًا أو زيارة أو يوم عيادة.':'Creating a Case records no arrival, Visit or Clinic Day.'}</p>
  {operation?<p>{ar?'توجد عملية محفوظة للاسترجاع.':'A saved operation is available for recovery.'}</p>:<>
   <p>{patient?`${patient.name} — ${patient.clinicPatientNumber}`:ar?'اختر مريضًا من الدليل وافتح ملفه أولًا.':'Select a patient from the directory and open the dossier first.'}</p>
   <label>{ar?'الشكوى / المشكلة السريرية':'Clinical complaint / problem'}<textarea value={summary} maxLength={4000} disabled={!allowed||pending} onChange={e=>setSummary(e.target.value)}/></label>
   <button type="button" disabled={!allowed||!patient||pending||!summary.trim()||notice==='storage'} onClick={()=>void run('create')}>{ar?'إنشاء الحالة فقط':'Create Case only'}</button>
  </>}
  {operation&&<button type="button" disabled={!allowed||pending} onClick={()=>void run('recover')}>{ar?'استرجاع إيصال العملية':'Recover operation receipt'}</button>}
  {operation&&intent.current&&outcome?.status!=='COMMITTED'&&<button type="button" disabled={!allowed||pending} onClick={()=>void run('retry')}>{ar?'إعادة نفس الطلب المحفوظ':'Replay identical retained request'}</button>}
  {outcome?.status==='COMMITTED'&&allowed&&<div role="status"><p>{ar?'تم تأكيد إنشاء الحالة — إيصال الإنشاء الأصلي، وليس حالتها الحالية:':'Case creation confirmed — original creation receipt, not current Case state:'} {outcome.result.caseId}</p><button type="button" disabled={pending} onClick={()=>void nextCase()}>{ar?'إنهاء مراجعة الإيصال وبدء طلب جديد':'Finish receipt review and start a new request'}</button></div>}
  {notice&&<p role="alert">{messages[notice]?.[ar?0:1]??(ar?'تعذر تأكيد العملية.':'Operation not confirmed.')}</p>}
 </section>;
}
