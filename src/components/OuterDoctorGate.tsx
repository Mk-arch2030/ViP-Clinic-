import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { LockKeyhole, ShieldCheck, Stethoscope, Users, AlertTriangle, LogOut } from 'lucide-react';
import { ConnectedPatientSession } from '../integration/connected-patient-session';
import { DoctorSessionProvider } from '../integration/doctor-session-context';
import { createWebApi, TEST_ORIGIN } from '../integration/web-api-client';
import type { SessionView } from '../integration/session-coordinator';
import { browserRegistrationJournal } from '../integration/registration-uncertainty';

/** No browser-stored identity or role is accepted as a clinic entrance credential. */
export function mayEnterDoctorClinic(view: SessionView): boolean {
  return view.state === 'authenticated' &&
    view.session?.role === 'Doctor' &&
    view.session.lifecycle === 'ACTIVE' &&
    !view.logoutUnconfirmed &&
    !view.registrationUnconfirmed;
}

export function OuterDoctorGate({ children }: { children: React.ReactNode }) {
  // Outside the protected origin, retain the existing offline/demo application unchanged.
  if (window.location.origin !== TEST_ORIGIN) return <>{children}</>;
  return <ProtectedDoctorEntrance>{children}</ProtectedDoctorEntrance>;
}

function ProtectedDoctorEntrance({ children }: { children: React.ReactNode }) {
  const model = useMemo(() => new ConnectedPatientSession(createWebApi({ origin: window.location.origin }), browserRegistrationJournal()), []);
  const snapshot = useSyncExternalStore(model.subscribe, model.getSnapshot, model.getSnapshot);
  const view = snapshot.session;
  const [loginLabel, setLoginLabel] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const ar = language === 'ar';
  const tr = (a: string, e: string) => ar ? a : e;
  useEffect(() => {
    void model.refresh();
    const reconcile = () => { if (document.visibilityState === 'visible') void model.refresh(); };
    window.addEventListener('focus', reconcile);
    window.addEventListener('pageshow', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    return () => {
      window.removeEventListener('focus', reconcile);
      window.removeEventListener('pageshow', reconcile);
      document.removeEventListener('visibilitychange', reconcile);
      model.dispose();
    };
  }, [model]);
  useEffect(() => {
    if (view.state !== 'authenticated') setPassword('');
  }, [view.state]);
  if (mayEnterDoctorClinic(view)) {
    return <DoctorSessionProvider model={model}><div data-roby-gate="inside">
      <div className="no-print theme-surface border-b theme-border px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 theme-text-primary text-sm font-semibold">
          <ShieldCheck className="w-5 h-5" />
          {tr('العيادة تحت ولاية الدكتور روبي — جلسة موثقة', 'Dr. Roby Clinic — verified doctor session')}
        </div>
        <button type="button" disabled={view.busy || view.registrationUnconfirmed}
          onClick={() => void model.logout()}
          className="theme-action-primary rounded-lg px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50">
          <LogOut className="w-4 h-4" />{tr('إغلاق العيادة والخروج', 'Lock clinic and sign out')}
        </button>
      </div>
      {children}
    </div></DoctorSessionProvider>;
  }
  const waiting = view.state === 'checking';
  const unavailable = view.state === 'unavailable';
  return <main data-roby-gate="outside" dir={ar ? 'rtl' : 'ltr'} className="min-h-screen theme-canvas theme-text-primary flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-lg">
      <header className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-2xl theme-surface border theme-border flex items-center justify-center mb-5">
          <Stethoscope className="w-8 h-8" aria-hidden="true" />
        </div>
        <p className="text-xs tracking-widest theme-text-muted font-mono">ROBY CLINIC · OUTER DOCTOR GATE</p>
        <h1 className="text-3xl font-bold mt-3">{tr('عيادة الدكتور روبي', 'Dr. Roby Clinic')}</h1>
        <p className="theme-text-secondary mt-3">{tr('العيادة جاهزة وبانتظار مفتاح الطبيب', 'The clinic is ready for its doctor')}</p>
      </header>
      <section className="theme-surface border theme-border rounded-2xl p-6 sm:p-8 shadow-lg" aria-label={tr('بوابة الدخول الخارجية', 'External entrance gate')}>
        <div className="flex items-center gap-3 mb-6">
          <LockKeyhole className="w-6 h-6" aria-hidden="true" />
          <div>
            <h2 className="font-bold">{tr('مفتاح الدخول', 'Entrance key')}</h2>
            <p className="text-xs theme-text-secondary">{tr('الهوية تُثبت بواسطة الخادم', 'Identity verified by server authority')}</p>
          </div>
        </div>
        {waiting && <p role="status" className="theme-text-secondary">{tr('جار التحقق من الجلسة…', 'Checking session…')}</p>}
        {unavailable && <p role="alert" className="theme-status-danger flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{tr('الخادم غير متاح. العيادة مغلقة.', 'Server unavailable. Clinic locked.')}</p>}
        {view.logoutUnconfirmed && <p role="alert" className="theme-status-danger">{tr('إبطال الجلسة غير مؤكد؛ العيادة مغلقة محليًا.', 'Server logout unconfirmed; clinic locked locally.')}</p>}
        {view.registrationUnconfirmed && <p role="alert" className="theme-status-danger">{tr('نتيجة تسجيل سابق غير مؤكدة؛ راجعها قبل متابعة العمل.', 'Prior registration outcome uncertain; reconcile before continuing.')}</p>}
        {view.state === 'authenticated' && view.session?.role !== 'Doctor' && <p role="alert" className="theme-status-danger">{tr('تم التعرف على الحساب، لكن دخول الطبيب غير مسموح لهذا الدور.', 'Account recognized; doctor entrance is not available to this role.')}</p>}
        {view.failure && !unavailable && <p role="alert" className="theme-status-danger">{tr('لم تكتمل المصادقة. راجع بيانات الدخول أو حالة الخادم.', 'Authentication was not completed.')}</p>}
        {view.state === 'unauthenticated' && !view.logoutUnconfirmed && <form className="space-y-4" onSubmit={e => {
          e.preventDefault();
          const submitted = password;
          setPassword('');
          void model.login(loginLabel, submitted);
        }}>
          <label className="block text-sm font-semibold">{tr('اسم الدخول', 'Login name')}
            <input className="block mt-2 w-full theme-input border theme-border rounded-lg p-3" dir="ltr" autoComplete="username" required maxLength={64} value={loginLabel} onChange={e => setLoginLabel(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold">{tr('كلمة المرور', 'Password')}
            <input className="block mt-2 w-full theme-input border theme-border rounded-lg p-3" dir="ltr" type="password" autoComplete="current-password" required maxLength={1024} value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <button type="submit" disabled={view.busy} className="w-full theme-action-primary rounded-lg py-3 font-bold disabled:opacity-50">
            {tr('افتح العيادة', 'Unlock clinic')}
          </button>
        </form>}
        {view.state === 'authenticated' && view.session?.role !== 'Doctor' && !view.busy && <button type="button" className="theme-action-primary rounded-lg px-4 py-2 mt-4" onClick={() => void model.logout()}>{tr('تسجيل الخروج', 'Sign out')}</button>}
        {unavailable && <button type="button" disabled={view.busy || view.logoutUnconfirmed} className="theme-action-primary rounded-lg px-4 py-2 mt-4 disabled:opacity-50" onClick={() => void model.refresh()}>{tr('إعادة فحص الجلسة', 'Recheck session')}</button>}
      </section>
      <div className="flex justify-between items-center mt-6 gap-3 text-xs theme-text-muted">
        <span className="flex items-center gap-2"><Users className="w-4 h-4" />{tr('الطاقم والتفويض: وفق صلاحيات الخادم', 'Staff delegation: server-governed')}</span>
        <button type="button" className="underline" onClick={() => setLanguage(ar ? 'en' : 'ar')}>{ar ? 'English' : 'العربية'}</button>
      </div>
      <p className="text-center text-xs theme-text-muted mt-5">Authenticate Outside · Enter Inside · Lock on Exit</p>
    </div>
  </main>;
}
