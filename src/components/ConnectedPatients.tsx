import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ShieldCheck, Search, FolderOpen, LogOut } from 'lucide-react';
import { useDoctorSession } from '../integration/doctor-session-context';
import { TEST_ORIGIN, type FailureKind } from '../integration/web-api-client';
import { PatientIntake } from './PatientIntake';
import type { Language } from '../i18n/translations';

export interface ConnectedIdentity { role: 'Doctor' | 'Nurse' | null; checking: boolean; blocked: boolean }
const inputClass = 'w-full theme-input border theme-border rounded-lg py-2.5 px-3 text-sm theme-text-primary theme-focus';
const actionClass = 'px-4 py-2.5 theme-action-primary rounded-lg text-sm font-medium theme-focus disabled:opacity-50';
const panelClass = 'theme-surface border theme-border rounded-xl p-5 space-y-4 shadow-xs';
const messages: Record<FailureKind, [string, string]> = {
  'not-found':['المريض غير موجود.','Patient not found.'],
  unauthorized:['تعذر الدخول أو انتهت الجلسة.','Login failed or session expired.'],
  forbidden:['العملية غير مسموحة لهذا الحساب.','This account cannot perform this operation.'],
  invalid:['تحقق من بيانات الطلب.','Check the request details.'],
  throttled:['محاولات كثيرة. انتظر قبل المحاولة التالية.','Too many attempts. Wait before trying again.'],
  unavailable:['الخدمة غير متاحة. أعد فحص الجلسة عندما يعود الاتصال.','Service unavailable. Recheck the session when connected.'],
  busy:['الطلب قيد التنفيذ.','Request in progress.'],
  'outcome-unknown':['نتيجة التسجيل غير مؤكدة. لا تكرر التسجيل؛ راجع النتيجة أولًا.','Registration outcome unknown. Do not retry; reconcile the outcome first.']
};

export function ConnectedPatients(props: { language: Language; onIdentity: (value: ConnectedIdentity) => void }) {
  if (window.location.origin !== TEST_ORIGIN) return <section className={panelClass}>
    <h2 className="font-semibold theme-text-primary">{props.language === 'ar' ? 'مرضى الخادم' : 'Server patients'}</h2>
    <p>{props.language === 'ar' ? 'افتح نسخة العيادة المحمية لتسجيل الدخول والتعامل مع مرضى الخادم. بيانات العرض النموذجية تظل محفوظة هنا.' : 'Open the protected clinic to sign in and use server patients. Demonstration records remain here.'}</p>
    <a href={TEST_ORIGIN} className={actionClass}>{props.language === 'ar' ? 'فتح العيادة المحمية' : 'Open protected clinic'}</a>
  </section>;
  return <ProtectedPatients {...props} />;
}

function ProtectedPatients({ language, onIdentity }: { language: Language; onIdentity: (value: ConnectedIdentity) => void }) {
  const model = useDoctorSession();
  const state = useSyncExternalStore(model.subscribe, model.getSnapshot, model.getSnapshot);
  const view = state.session;
  const ar = language === 'ar';
  const text = (arabic: string, english: string) => ar ? arabic : english;
  const [label, setLabel] = useState('');
  const [password, setPassword] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchMode, setSearchMode] = useState<'cpn' | 'name'>('cpn');
  const [intakeEpoch, setIntakeEpoch] = useState(0);
  const previousActor = useRef<string | null>(null);
  const doctor = view.state === 'authenticated' && view.session?.role === 'Doctor';
  useEffect(() => {
    onIdentity({ role:view.session?.role ?? null, checking:view.state === 'checking', blocked:view.busy || view.registrationUnconfirmed || view.logoutUnconfirmed });
  }, [onIdentity, view]);
  useEffect(() => {
    const actor = view.session?.actorIdentityReference ?? null;
    if (view.state === 'unauthenticated' ||
        (actor && previousActor.current && actor !== previousActor.current)) { setPassword(''); setSearchValue(''); setIntakeEpoch(value => value + 1); }
    if (actor || view.state === 'unauthenticated') previousActor.current = actor;
  }, [view.state, view.session?.actorIdentityReference]);
  const message = (kind: FailureKind) => messages[kind][ar ? 0 : 1];
  const notice = (operation: 'retrieve' | 'register') => state.notice?.operation === operation &&
    <p role="alert" className="theme-status-danger">{message(state.notice.kind)}</p>;
  return <div className="space-y-6">
    <section className={panelClass} aria-label={text('جلسة الخادم', 'Server session')}>
      <h2 className="flex items-center gap-2 font-semibold theme-text-primary"><ShieldCheck className="w-5 h-5" />{text('جلسة العيادة المحمية', 'Protected clinic session')}</h2>
      <p role="status">{view.state === 'checking' ? text('جار التحقق من الجلسة…', 'Checking session…') : view.session ? text('هوية الخادم: ', 'Server identity: ') + view.session.role : text('لم يتم تسجيل الدخول.', 'Not signed in.')}</p>
      {view.failure && !state.notice && <p role="alert" className="theme-status-danger">{message(view.failure)}</p>}
      {view.logoutUnconfirmed && <p role="alert">{text('تسجيل الخروج غير مؤكد. أعد فحص الجلسة.', 'Logout is unconfirmed. Recheck the session.')}</p>}
      {view.registrationUnconfirmed && <p role="alert" className="theme-status-danger">{message('outcome-unknown')}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" className={actionClass} disabled={view.busy} onClick={() => void model.refresh()}>{text('إعادة فحص الجلسة', 'Recheck session')}</button>
        {view.session && <button type="button" className={actionClass} disabled={view.busy} onClick={() => { setPassword(''); setSearchValue(''); setIntakeEpoch(value => value + 1); void model.logout(); }}><LogOut className="w-4 h-4 inline" /> {text('تسجيل الخروج', 'Sign out')}</button>}
      </div>
      {!view.session && <form onSubmit={event => { event.preventDefault(); const submitted = password; setPassword(''); void model.login(label, submitted); }}>
        <fieldset disabled={view.busy || view.logoutUnconfirmed || view.state === 'checking' || view.state === 'unavailable'} className="space-y-4">
          <label className="block space-y-2">{text('اسم الدخول', 'Login name')}<input className={inputClass} dir="ltr" autoComplete="username" maxLength={64} required value={label} onChange={e => setLabel(e.target.value)} /></label>
          <label className="block space-y-2">{text('كلمة المرور', 'Password')}<input className={inputClass} dir="ltr" type="password" autoComplete="current-password" maxLength={1024} required value={password} onChange={e => setPassword(e.target.value)} /></label>
          <button className={actionClass} type="submit">{text('دخول', 'Sign in')}</button>
        </fieldset>
      </form>}
      {view.session?.role === 'Nurse' && <p>{text('تم التعرف على الممرض. عمليات المريض هنا غير متاحة لهذا الدور.', 'Nurse identified. Patient operations here are unavailable for this role.')}</p>}
    </section>
    <section className={panelClass} aria-label={text('استرجاع مريض من الخادم', 'Retrieve server patient')}>
      <h2 className="flex gap-2 font-semibold"><Search className="w-5 h-5" />{text('استرجاع مريض', 'Retrieve patient')}</h2>
      <form onSubmit={event => { event.preventDefault(); void model.search(searchMode, searchValue); }}>
        <fieldset disabled={!doctor || view.busy} className="space-y-4">
          <label className="block space-y-2">{text('البحث باستخدام', 'Search by')}<select className={inputClass} value={searchMode} onChange={e => { setSearchMode(e.target.value as 'cpn' | 'name'); setSearchValue(''); }}><option value="cpn">{text('رقم الملف CPN','Patient number CPN')}</option><option value="name">{text('اسم المريض','Patient name')}</option></select></label>
          <label className="block space-y-2">{searchMode === 'cpn' ? text('رقم الملف — مثل CPN-8 أو 8','Patient number — e.g. CPN-8 or 8') : text('اسم المريض — حرفان على الأقل','Patient name — at least two characters')}<input className={inputClass} required maxLength={80} value={searchValue} onChange={e => setSearchValue(e.target.value)} /></label>
          <button type="submit" className={actionClass}>{text('استرجاع', 'Retrieve')}</button>
        </fieldset>
      </form>{notice('retrieve')}
      {view.searchHasMore && <p role="status">{text('ظهرت أول 25 نتيجة. اكتب اسمًا أكثر تحديدًا.','First 25 results shown. Refine the name to narrow the search.')}</p>}
      {view.searchResults.length > 0 && <ul className="space-y-3" aria-label={text('نتائج بحث المريض','Patient search results')}>{view.searchResults.map(patient => <li key={patient.patientId} className="theme-surface-nested border theme-border rounded-lg p-3"><button type="button" className="w-full text-start theme-focus rounded-lg" disabled={!doctor || view.busy} onClick={() => void model.retrieve(patient.patientId, true)}><span className="font-semibold">{patient.name}</span> · <span className="font-mono theme-text-technical">{patient.clinicPatientNumber}</span><span className="block text-sm theme-text-secondary">{patient.dateOfBirth ?? text('تاريخ الميلاد غير مسجل','Date of birth not recorded')} · {patient.phone}</span></button></li>)}</ul>}
    </section>
    <PatientIntake key={intakeEpoch} patients={[]} cases={[]} actorRole={view.session?.role ?? 'Nurse'} language={language}
      serverRegistration registrationDisabled={!doctor || view.busy || view.mutationsBlocked || view.registrationUnconfirmed}
      registrationNotice={notice('register')}
      onRegisterPatient={async input => {
        const patient = await model.register({ ...input, pastHistory: {
          chronicIllnesses: input.pastHistory?.chronicIllnesses ?? [], knownAllergies: input.pastHistory?.knownAllergies ?? [],
          surgicalHistory: input.pastHistory?.surgicalHistory ?? [], familyHistory: input.pastHistory?.familyHistory ?? [],
          lifestyleNotes: input.pastHistory?.lifestyleNotes ?? ''
        } });
        return patient && patient.dateOfBirth && patient.pastHistory ? { ...patient, dateOfBirth: patient.dateOfBirth } : null;
      }}
      onRecordArrival={() => { throw new Error('Server arrival unavailable'); }}
      onSelectPatientDossier={() => { throw new Error('Server clinical dossier unavailable'); }} />
    {view.patient && <section className={panelClass} aria-label={text('بيانات المريض المحفوظة بالخادم', 'Server patient result')}>
      <h2 className="flex gap-2 font-semibold"><FolderOpen className="w-5 h-5" />{view.patient.name}</h2>
      <div className="font-mono theme-text-technical">{view.patient.clinicPatientNumber}</div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries({ [text('تاريخ الميلاد','Date of birth')]:view.patient.dateOfBirth ?? text('غير مسجل','Not recorded'), [text('العمر المشتق','Derived age')]:view.patient.age ?? text('غير متاح','Unavailable'), [text('المهنة','Profession')]:view.patient.profession, [text('الهاتف','Phone')]:view.patient.phone, [text('النوع','Gender')]:view.patient.gender }).map(([key, value]) => <div key={key}><dt className="theme-text-muted text-xs">{key}</dt><dd className="theme-text-primary break-all">{value}</dd></div>)}
      </dl>
      {view.patient.pastHistory === null && <p>{text('التاريخ المرضي لم يُسجّل بهذا المسار بعد.', 'Past history has not been captured by this workflow.')}</p>}
      {view.patient.pastHistory && <dl className="space-y-2" aria-label={text('التاريخ المرضي السابق','Past history')}>
        {Object.entries(view.patient.pastHistory).map(([key, value], index) => <div key={key}>
          <dt className="theme-text-muted text-xs">{(ar ? ['الأمراض المزمنة','الحساسية المعروفة','التاريخ الجراحي','التاريخ العائلي','نمط الحياة'] : ['Chronic illnesses','Known allergies','Surgical history','Family history','Lifestyle notes'])[index]}</dt>
          <dd className="theme-text-primary">{(Array.isArray(value) ? value.join(', ') : value) || text('لم تُدخل معلومات','No information entered')}</dd>
        </div>)}
      </dl>}
    </section>}
  </div>;
}
