import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ShieldCheck, Search, UserPlus, FolderOpen, LogOut } from 'lucide-react';
import { ConnectedPatientSession } from '../integration/connected-patient-session';
import { createWebApi, TEST_ORIGIN, type FailureKind } from '../integration/web-api-client';
import type { Registration } from '../integration/basic-patient';
import type { Language } from '../i18n/translations';

export interface ConnectedIdentity { role: 'Doctor' | 'Nurse' | null; checking: boolean; blocked: boolean }
const blank: Registration = { name:'', dateOfBirth:'', profession:'', phone:'', gender:'Male' };
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
  const model = useMemo(() => new ConnectedPatientSession(createWebApi({ origin:window.location.origin })), []);
  const state = useSyncExternalStore(model.subscribe, model.getSnapshot, model.getSnapshot);
  const view = state.session;
  const ar = language === 'ar';
  const text = (arabic: string, english: string) => ar ? arabic : english;
  const [label, setLabel] = useState('');
  const [password, setPassword] = useState('');
  const [patientId, setPatientId] = useState('');
  const [draft, setDraft] = useState<Registration>({ ...blank });
  const previousActor = useRef<string | null>(null);
  const doctor = view.state === 'authenticated' && view.session?.role === 'Doctor';
  useEffect(() => {
    void model.refresh();
    const reconcile = () => { if (document.visibilityState === 'visible') void model.refresh(); };
    window.addEventListener('focus', reconcile); window.addEventListener('pageshow', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    return () => { window.removeEventListener('focus', reconcile); window.removeEventListener('pageshow', reconcile); document.removeEventListener('visibilitychange', reconcile); model.dispose(); };
  }, [model]);
  useEffect(() => {
    onIdentity({ role:view.session?.role ?? null, checking:view.state === 'checking', blocked:view.busy || view.registrationUnconfirmed || view.logoutUnconfirmed });
  }, [onIdentity, view]);
  useEffect(() => {
    const actor = view.session?.actorIdentityReference ?? null;
    if (view.state === 'unauthenticated' || view.state === 'unavailable' ||
        (actor && previousActor.current && actor !== previousActor.current)) { setPassword(''); setPatientId(''); setDraft({ ...blank }); }
    if (actor || view.state === 'unauthenticated' || view.state === 'unavailable') previousActor.current = actor;
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
        {view.session && <button type="button" className={actionClass} disabled={view.busy} onClick={() => { setPassword(''); setPatientId(''); setDraft({ ...blank }); void model.logout(); }}><LogOut className="w-4 h-4 inline" /> {text('تسجيل الخروج', 'Sign out')}</button>}
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
      <form onSubmit={event => { event.preventDefault(); void model.retrieve(patientId); }}>
        <fieldset disabled={!doctor || view.busy} className="space-y-4">
          <label className="block space-y-2">{text('معرف المريض UUID', 'Patient UUID')}<input className={inputClass} dir="ltr" required maxLength={36} value={patientId} onChange={e => setPatientId(e.target.value)} /></label>
          <button type="submit" className={actionClass}>{text('استرجاع', 'Retrieve')}</button>
        </fieldset>
      </form>{notice('retrieve')}
    </section>
    <section className={panelClass} aria-label={text('تسجيل مريض بالخادم', 'Register server patient')}>
      <h2 className="flex gap-2 font-semibold"><UserPlus className="w-5 h-5" />{text('تسجيل مريض — بيانات أساسية', 'Register patient — basic details')}</h2>
      <p className="theme-text-secondary">{text('رقم الملف يصدر بعد الحفظ. التاريخ المرضي والزيارات غير متاحين في هذه الخدمة بعد.', 'The patient number is issued after saving. History and visits are not yet available in this service.')}</p>
      <form onSubmit={event => { event.preventDefault(); void model.register(draft); }}>
        <fieldset disabled={!doctor || view.busy || view.mutationsBlocked || view.registrationUnconfirmed} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['name','dateOfBirth','profession','phone'] as const).map((key, index) => <label key={key} className="block space-y-2">
              {ar ? ['الاسم','تاريخ الميلاد','المهنة','الهاتف'][index] : ['Name','Date of birth','Profession','Phone'][index]}
              <input className={inputClass} type={key === 'dateOfBirth' ? 'date' : 'text'} required maxLength={256} value={draft[key]} onChange={e => setDraft(current => ({ ...current, [key]:e.target.value }))} />
            </label>)}
            <label className="block space-y-2">{text('النوع', 'Gender')}<select className={inputClass} value={draft.gender} onChange={e => setDraft(current => ({ ...current, gender:e.target.value as 'Male' | 'Female' }))}><option value="Male">{text('ذكر','Male')}</option><option value="Female">{text('أنثى','Female')}</option></select></label>
          </div><button type="submit" className={actionClass}>{text('تسجيل', 'Register')}</button>
        </fieldset>
      </form>{notice('register')}
    </section>
    {view.patient && <section className={panelClass} aria-label={text('بيانات المريض المحفوظة بالخادم', 'Server patient result')}>
      <h2 className="flex gap-2 font-semibold"><FolderOpen className="w-5 h-5" />{view.patient.name}</h2>
      <div className="font-mono theme-text-technical">{view.patient.clinicPatientNumber}</div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries({ [text('معرف المريض','Patient UUID')]:view.patient.patientId, [text('تاريخ الميلاد','Date of birth')]:view.patient.dateOfBirth ?? text('غير مسجل','Not recorded'), [text('العمر المشتق','Derived age')]:view.patient.age ?? text('غير متاح','Unavailable'), [text('المهنة','Profession')]:view.patient.profession, [text('الهاتف','Phone')]:view.patient.phone, [text('النوع','Gender')]:view.patient.gender }).map(([key, value]) => <div key={key}><dt className="theme-text-muted text-xs">{key}</dt><dd className="theme-text-primary break-all">{value}</dd></div>)}
      </dl>
    </section>}
  </div>;
}
