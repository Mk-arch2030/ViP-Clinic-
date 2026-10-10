import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createWebApi, type FailureKind } from './web-api-client';
import { SessionCoordinator } from './session-coordinator';
import type { Registration } from './basic-patient';
import './integration.css';

const messages: Record<FailureKind,string> = {
  unauthorized:'تعذر الدخول أو انتهت الجلسة. تحقق من بيانات الدخول.',
  forbidden:'العملية غير مسموحة. أعد فحص الجلسة قبل أي تغيير.',
  'not-found':'المريض غير موجود.', invalid:'تحقق من بيانات الطلب.',
  throttled:'محاولات كثيرة. انتظر قبل المحاولة التالية.', unavailable:'الخدمة غير متاحة. أعد فحص الجلسة عندما يعود الاتصال.',
  busy:'الطلب قيد التنفيذ.', 'outcome-unknown':'نتيجة التسجيل غير مؤكدة. لا تكرر التسجيل؛ راجع النتيجة أولًا.'
};
const blank: Registration = { name:'',dateOfBirth:'',profession:'',phone:'',gender:'Male' };
export function Stage6IntegrationApp() {
  const coordinator = useMemo(() => new SessionCoordinator(createWebApi({ origin:window.location.origin })),[]);
  const view = useSyncExternalStore(coordinator.subscribe,coordinator.getSnapshot,coordinator.getSnapshot);
  const [label,setLabel] = useState('');
  const [password,setPassword] = useState('');
  const [patientId,setPatientId] = useState('');
  const [registration,setRegistration] = useState<Registration>(blank);
  const previousActor = useRef<string | null>(null);
  const clearDraft = () => { setPassword(''); setPatientId(''); setRegistration({ ...blank }); };
  useEffect(() => {
    const actor = view.session?.actorIdentityReference ?? null;
    if (view.state === 'unauthenticated' || view.state === 'unavailable' ||
        (actor && previousActor.current && actor !== previousActor.current)) clearDraft();
    if (actor || view.state === 'unauthenticated' || view.state === 'unavailable') previousActor.current = actor;
  },[view.state,view.session?.actorIdentityReference]);
  useEffect(() => {
    void coordinator.refresh();
    const reconcile = () => { if (document.visibilityState === 'visible') void coordinator.refresh(); };
    window.addEventListener('focus',reconcile);
    window.addEventListener('pageshow',reconcile);
    document.addEventListener('visibilitychange',reconcile);
    return () => {
      window.removeEventListener('focus',reconcile);
      window.removeEventListener('pageshow',reconcile);
      document.removeEventListener('visibilitychange',reconcile);
      coordinator.dispose();
    };
  },[coordinator]);
  const doctor = view.state === 'authenticated' && view.session?.role === 'Doctor';
  return <main className="stage6" dir="rtl">
    <header><p className="stage6-eyebrow">ViP Clinic · Web integration</p><h1>بوابة بيانات المريض الأساسية</h1>
      <p>بيئة اختبار ببيانات صناعية. الملف السريري ودليل العيادة الحالي منفصلان عن هذه البوابة.</p></header>
    <section aria-label="الجلسة">
      <h2>الجلسة</h2>
      <p role="status">{view.state === 'checking' ? 'جارٍ التحقق من الجلسة…' : view.state === 'authenticated' ?
        `هوية الخادم: ${view.session?.role}` : view.state === 'unavailable' ? 'الدخول متوقف لحين التحقق من الخادم.' : 'لم يتم تسجيل الدخول.'}</p>
      {view.failure && <p role="alert">{messages[view.failure]}{view.retryAfter ? ` انتظر ${view.retryAfter} ثانية.` : ''}</p>}
      {view.logoutUnconfirmed && <p role="alert">إلغاء الجلسة على الخادم غير مؤكد. أعد فحص الجلسة.</p>}
      {view.registrationUnconfirmed && <p role="alert">التسجيل السابق غير مؤكد. تسجيل جديد متوقف في هذه الصفحة لحين مراجعة النتيجة.</p>}
      <div className="stage6-actions"><button disabled={view.busy} onClick={() => void coordinator.refresh()}>إعادة فحص الجلسة</button>
        {view.session && <button disabled={view.busy} onClick={() => { clearDraft(); void coordinator.logout(); }}>تسجيل الخروج</button>}</div>
      {!view.session && <form onSubmit={async event => {
        event.preventDefault();
        const submitted = password; setPassword('');
        await coordinator.login(label,submitted);
      }}>
        <fieldset disabled={view.busy || view.logoutUnconfirmed || view.state === 'checking' || view.state === 'unavailable'}>
          <label>اسم الدخول<input dir="ltr" autoComplete="username" maxLength={64} value={label} onChange={event => setLabel(event.target.value)} required /></label>
          <label>كلمة المرور<input dir="ltr" type="password" autoComplete="current-password" maxLength={1024} value={password} onChange={event => setPassword(event.target.value)} required /></label>
          <button type="submit">دخول</button>
        </fieldset>
      </form>}
    </section>
    {view.session?.role === 'Nurse' && <p role="status">تم التعرف على هوية الممرض. عمليات المريض في هذه البوابة غير متاحة لهذا الدور.</p>}
    <section aria-label="استرجاع المريض"><h2>استرجاع بيانات أساسية</h2>
      <form onSubmit={event => { event.preventDefault(); void coordinator.retrieve(patientId); }}>
        <fieldset disabled={!doctor || view.busy}>
          <label>معرّف المريض<input dir="ltr" value={patientId} onChange={event => setPatientId(event.target.value)} placeholder="Patient ID (UUID)" maxLength={36} required /></label>
          <button type="submit">استرجاع</button>
        </fieldset>
      </form>
    </section>
    <section aria-label="تسجيل أساسي"><h2>تسجيل مريض — بيانات أساسية فقط</h2>
      <p>التاريخ المرضي والحالات والزيارات لا تُسجّل من هذه البوابة.</p>
      <form onSubmit={event => { event.preventDefault(); void coordinator.register(registration); }}>
        <fieldset disabled={!doctor || view.busy || view.mutationsBlocked || view.registrationUnconfirmed}>
          <div className="stage6-fields">{(['name','dateOfBirth','profession','phone'] as const).map((key,index) =>
            <label key={key}>{['الاسم','تاريخ الميلاد','المهنة','الهاتف'][index]}
              <input type={key === 'dateOfBirth' ? 'date' : 'text'} maxLength={256} required value={registration[key]}
                onChange={event => setRegistration(current => ({ ...current,[key]:event.target.value }))} />
            </label>)}
            <label>النوع<select value={registration.gender} onChange={event => setRegistration(current => ({ ...current,gender:event.target.value as 'Male' | 'Female' }))}>
              <option value="Male">ذكر</option><option value="Female">أنثى</option></select></label>
          </div><button type="submit">تسجيل</button>
        </fieldset>
      </form>
    </section>
    {view.patient && <section aria-label="نتيجة المريض"><h2>{view.patient.name}</h2>
      <dl>{Object.entries({ 'معرّف المريض':view.patient.patientId,'CPN':view.patient.clinicPatientNumber,
        'تاريخ الميلاد':view.patient.dateOfBirth ?? 'غير مسجل','العمر المشتق':view.patient.age ?? 'غير متاح',
        'المهنة':view.patient.profession,'الهاتف':view.patient.phone,'النوع':view.patient.gender }).map(([key,value]) =>
        <React.Fragment key={key}><dt>{key}</dt><dd>{value}</dd></React.Fragment>)}</dl>
    </section>}
  </main>;
}
