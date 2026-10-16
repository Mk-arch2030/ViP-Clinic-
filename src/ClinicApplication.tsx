/**
 * Dr. Roby Clinic — Clinical EMR & Practice System
 * Core Application Surface
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { ClinicBoundary, ClinicData, ClinicPatient } from './integration/clinic-boundary';
import type { Registration } from './integration/basic-patient';
import { translations, Language } from './i18n/translations';
import { Header } from './components/Header';
import { DailyCensus } from './components/DailyCensus';
import { PatientIntake } from './components/PatientIntake';
import { PatientDossier } from './components/PatientDossier';
import { DoctorConsultation } from './components/DoctorConsultation';
import { PatientDirectory } from './components/PatientDirectory';
import { PrintPrescriptionModal } from './components/PrintPrescriptionModal';
import { VisitRecord, CaseRecord, PatientRecord } from './domain/types';
import {
  CalendarDays,
  UserPlus,
  FolderOpen,
  Stethoscope,
  Users,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

type MainTab = 'CENSUS' | 'INTAKE' | 'DOSSIER' | 'CONSULTATION' | 'DIRECTORY';

export function ClinicApplication({ boundary, casePanel }: { boundary: ClinicBoundary; casePanel?: (patient: ClinicPatient | null, language: Language) => React.ReactNode }) {
  const protectedMode = boundary.protectedMode;
  const [storeState, setStoreState] = useState<ClinicData>(() =>
    boundary.getState()
  );
  const [activeTab, setActiveTab] = useState<MainTab>(() => protectedMode ? 'INTAKE' : 'CENSUS');
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => boundary.subscribe?.(() => setStoreState(boundary.getState())), [boundary]);
  const blocked = boundary.blocked();
  const failure = boundary.failure();
  const failureMessages: Record<string, [string, string]> = {
    'not-found': ['المريض غير موجود.', 'Patient not found.'],
    invalid: ['راجع البيانات المدخلة.', 'Check the entered details.'],
    forbidden: ['العملية غير مسموحة لهذا الحساب.', 'This account cannot perform this operation.'],
    unauthorized: ['انتهت الجلسة؛ أعد الدخول من البوابة الخارجية.', 'Session expired; sign in through the external gate.'],
    unavailable: ['الخادم غير متاح؛ لم يتم تأكيد العملية.', 'Server unavailable; the operation was not confirmed.'],
    throttled: ['محاولات كثيرة؛ انتظر قبل المحاولة التالية.', 'Too many attempts; wait before trying again.'],
    busy: ['الطلب قيد التنفيذ.', 'Request in progress.'],
    'outcome-unknown': ['نتيجة التسجيل غير مؤكدة؛ لا تكرره قبل مراجعة النتيجة.', 'Registration outcome uncertain; reconcile it before another attempt.'],
  };
  const clinicalUnavailable = protectedMode;
  const unsupportedNotice = casePanel ? (language === 'ar' ? 'الزيارات والاستشارة والوصفات واليوم السريري غير متاحة للكتابة؛ إنشاء الحالة مستقل عنها.' : 'Visits, consultations, prescriptions and Clinic Day writes remain unavailable; Case creation is independent.') : language === 'ar' ? 'الحالات والزيارات والاستشارة والوصفات واليوم السريري لم تتصل بالخادم بعد؛ الكتابة عليها غير متاحة.' : 'Cases, visits, consultations, prescriptions and clinic days are not connected to the server yet; writes are unavailable.';

  // Active selection pointers
  const [activePatientId, setActivePatientId] = useState<string>(
    storeState.patients[0]?.patientId || ''
  );
  const [activeVisitId, setActiveVisitId] = useState<string>(
    storeState.visits[0]?.id || ''
  );

  // Print Prescription Modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printVisit, setPrintVisit] = useState<VisitRecord | null>(null);
  const [printCase, setPrintCase] = useState<CaseRecord | null>(null);

  // Status feedback toast
  const [feedback, setFeedback] = useState<string | null>(null);

  const t = translations[language];

  // Sync RTL, language, and presentation theme with document root
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = theme;
  }, [language, theme]);

  const refreshState = () => {
    setStoreState({ ...boundary.getState() });
  };

  const currentDay = useMemo(() => {
    return boundary.getCurrentClinicDay();
  }, [storeState]);

  const dailyVisits = useMemo(() => {
    return storeState.visits.filter((v) => v.clinicDayId === currentDay?.id);
  }, [storeState.visits, currentDay?.id]);

  const selectedPatient = useMemo(() => {
    return (
      storeState.patients.find((p) => p.patientId === activePatientId && (!protectedMode || storeState.retrievedPatientId === activePatientId)) ||
      (!protectedMode ? storeState.patients[0] : null) ||
      null
    );
  }, [storeState.patients, activePatientId]);

  const selectedPatientCases = useMemo(() => {
    if (!selectedPatient) return [];
    return storeState.cases.filter((c) => c.patientId === selectedPatient.patientId);
  }, [storeState.cases, selectedPatient]);

  const selectedPatientVisits = useMemo(() => {
    if (!selectedPatient) return [];
    return storeState.visits.filter((v) => v.patientId === selectedPatient.patientId);
  }, [storeState.visits, selectedPatient]);

  const activeConsultationVisit = useMemo(() => {
    return (
      storeState.visits.find((v) => v.id === activeVisitId) ||
      (!protectedMode ? storeState.visits[0] : null) ||
      null
    );
  }, [storeState.visits, activeVisitId]);

  const activeConsultationPatient = useMemo(() => {
    if (!activeConsultationVisit) return null;
    return (
      storeState.patients.find(
        (p) => p.patientId === activeConsultationVisit.patientId
      ) || null
    );
  }, [storeState.patients, activeConsultationVisit]);

  const activeConsultationCase = useMemo(() => {
    if (!activeConsultationVisit) return null;
    return (
      storeState.cases.find(
        (c) => c.id === activeConsultationVisit.caseId
      ) || null
    );
  }, [storeState.cases, activeConsultationVisit]);

  // Actions
  const handleSetActorRole = (role: 'Doctor' | 'Nurse') => {
    boundary.setActorRole(role);
    refreshState();
    showToast(
      language === 'ar'
        ? `تم التبديل إلى دور: ${role === 'Doctor' ? t.doctorRole : t.nurseRole}`
        : `Switched actor role to: ${role}`
    );
  };

  const handleSetOperatingMode = (mode: 'DOCTOR_ONLY' | 'DOCTOR_NURSE') => {
    boundary.setOperatingMode(mode);
    refreshState();
    showToast(
      language === 'ar'
        ? `تم تغيير نمط العمل إلى: ${mode === 'DOCTOR_ONLY' ? t.doctorOnlyMode : t.doctorNurseMode}`
        : `Operating mode set to: ${mode}`
    );
  };

  const handleCloseClinicDay = () => {
    try {
      boundary.closeClinicDay(storeState.actorRole);
      refreshState();
      showToast(
        language === 'ar'
          ? 'تم إغلاق يوم العيادة وحماية سجلات الزيارات بنجاح.'
          : 'Clinic Day closed and visits protected successfully.'
      );
    } catch (err: any) {
      alert(err.message || 'Failed to close clinic day');
    }
  };

  const handleOpenClinicDay = () => {
    try {
      boundary.openNewClinicDay(storeState.actorRole);
      refreshState();
      showToast(
        language === 'ar'
          ? 'تم فتح يوم عيادة سريري جديد.'
          : 'New Clinic Day opened successfully.'
      );
    } catch (err: any) {
      alert(err.message || 'Failed to open clinic day');
    }
  };

  const handleRegisterPatient = async (params: Registration): Promise<ClinicPatient | null> => {
    const created = await boundary.registerPatient(params);
    if (!created) return null;
    refreshState();
    setActivePatientId(created.patientId);
    showToast(
      language === 'ar'
        ? `تم تسجيل المريض ${created.name} وتخصيص ${created.clinicPatientNumber}`
        : `Patient ${created.name} registered with ${created.clinicPatientNumber}`
    );
    return created;
  };

  const handleRecordArrival = (params: any) => {
    try {
      const visit = boundary.recordArrivalAndVisit(params);
      refreshState();
      setActiveVisitId(visit.id);
      setActivePatientId(params.patientId);
      showToast(
        language === 'ar'
          ? `تم تسجيل وصول المريض وحجز الزيارة ${visit.id}`
          : `Arrival recorded for visit ${visit.id}`
      );
      setActiveTab('CENSUS');
    } catch (err: any) {
      alert(err.message || 'Failed to record arrival');
    }
  };

  const handleSelectVisitForConsultation = (visitId: string) => {
    setActiveVisitId(visitId);
    const visit = storeState.visits.find((v) => v.id === visitId);
    if (visit) {
      setActivePatientId(visit.patientId);
    }
    setActiveTab('CONSULTATION');
  };

  const handleInspectDossier = async (patientId: string) => {
    if (boundary.retrieve && !(await boundary.retrieve(patientId))) return;
    refreshState();
    setActivePatientId(patientId);
    setActiveTab('DOSSIER');
  };

  const handleRecordExit = (visitId: string) => {
    try {
      boundary.recordVisitExit(visitId, storeState.actorRole);
      refreshState();
      showToast(t.visitEndedNotice);
    } catch (err: any) {
      alert(err.message || 'Failed to record exit');
    }
  };

  const handleUpdateEncounter = (updates: any): boolean => {
    if (!activeConsultationVisit) return false;
    try {
      boundary.updateEncounter(
        activeConsultationVisit.id,
        updates,
        storeState.actorRole
      );
      refreshState();
      return true;
    } catch (err: any) {
      alert(err.message || 'Failed to update encounter');
      return false;
    }
  };

  const handleAuthorizePrescription = () => {
    if (!activeConsultationVisit) return;
    try {
      boundary.authorizePrescription(
        activeConsultationVisit.id,
        storeState.actorRole
      );
      refreshState();
      showToast(t.rxAuthorizedNotice);
    } catch (err: any) {
      alert(err.message || 'Failed to authorize prescription');
    }
  };

  const handleCompleteCase = (caseId: string) => {
    try {
      boundary.completeCase(caseId, storeState.actorRole);
      refreshState();
      showToast(
        language === 'ar'
          ? 'تم اعتماد اكتمال الحالة السريرية وإغلاقها بواسطة الطبيب.'
          : 'Case completion authorized by Doctor.'
      );
    } catch (err: any) {
      alert(err.message || 'Failed to complete case');
    }
  };

  const handleStartNewVisitForCase = (patientId: string, caseId: string) => {
    setActivePatientId(patientId);
    setActiveTab('INTAKE');
  };

  const handleOpenPrintModalForVisit = (
    visit: VisitRecord,
    caseRecord: CaseRecord
  ) => {
    setPrintVisit(visit);
    setPrintCase(caseRecord);
    setPrintModalOpen(true);
  };

  const handleResetToBaseline = () => {
    if (
      window.confirm(
        language === 'ar'
          ? 'هل تريد استعادة البيانات السريرية النموذجية الأولية؟'
          : 'Reset to initial seeded clinical baseline?'
      )
    ) {
      boundary.resetToSeed();
      refreshState();
      showToast(
        language === 'ar'
          ? 'تم استعادة البيانات السريرية الأولية.'
          : 'Reset to baseline completed.'
      );
    }
  };

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  return (
    <div className="min-h-screen theme-canvas flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentDay={currentDay}
        serverMode={protectedMode}
        serverRole={storeState.actorRole}
        serverChecking={blocked}
        actorRole={storeState.actorRole}
        operatingMode={storeState.operatingMode}
        onSetActorRole={handleSetActorRole}
        onSetOperatingMode={handleSetOperatingMode}
        onCloseClinicDay={handleCloseClinicDay}
        onOpenClinicDay={handleOpenClinicDay}
        language={language}
        onToggleLanguage={() =>
          setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'))
        }
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
        }
        dailyVisitsCount={dailyVisits.length}
      />

      {/* Main Navigation Bar */}
      <nav className="no-print border-b theme-border theme-surface sticky top-[73px] z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
            <button
              type="button"
              disabled={blocked}
              onClick={() => setActiveTab('CENSUS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'CENSUS'
                  ? 'theme-action-primary text-white shadow-xs'
                  : 'theme-text-muted hover:text-[color:var(--theme-text-primary)] hover:bg-[color:var(--theme-border)]/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>{t.tabDailyCensus}</span>
              {!protectedMode && <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[color:var(--theme-action-primary)]/10 text-[color:var(--theme-text-technical)]">
                {dailyVisits.length}
              </span>}
            </button>

            <button
              type="button"
              disabled={blocked}
              onClick={() => setActiveTab('INTAKE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'INTAKE'
                  ? 'theme-action-primary text-white shadow-xs'
                  : 'theme-text-muted hover:text-[color:var(--theme-text-primary)] hover:bg-[color:var(--theme-border)]/60'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.tabPatientIntake}</span>
            </button>

            <button
              type="button"
              disabled={blocked}
              onClick={() => setActiveTab('DOSSIER')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'DOSSIER'
                  ? 'theme-action-primary text-white shadow-xs'
                  : 'theme-text-muted hover:text-[color:var(--theme-text-primary)] hover:bg-[color:var(--theme-border)]/60'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>{t.tabPatientChart}</span>
              {selectedPatient && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[color:var(--theme-border)]/60 theme-text-secondary">
                  {selectedPatient.clinicPatientNumber}
                </span>
              )}
            </button>

            <button
              type="button"
              disabled={blocked}
              onClick={() => setActiveTab('CONSULTATION')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'CONSULTATION'
                  ? 'theme-action-primary text-white shadow-xs'
                  : 'theme-text-muted hover:text-[color:var(--theme-text-primary)] hover:bg-[color:var(--theme-border)]/60'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>{t.tabDoctorConsultation}</span>
              {!protectedMode && activeConsultationVisit?.prescription?.isAuthorized && (
                <span className="w-2 h-2 rounded-full bg-[color:var(--theme-status-active)]" />
              )}
            </button>

            <button
              type="button"
              disabled={blocked}
              onClick={() => setActiveTab('DIRECTORY')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'DIRECTORY'
                  ? 'theme-action-primary text-white shadow-xs'
                  : 'theme-text-muted hover:text-[color:var(--theme-text-primary)] hover:bg-[color:var(--theme-border)]/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.tabPatientDirectory}</span>
              {!protectedMode && <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[color:var(--theme-border)]/60 theme-text-muted">
                {storeState.patients.length}
              </span>}
            </button>
          </div>
        </div>
      </nav>

      <div className="no-print theme-surface-nested theme-text-secondary px-4 py-2 text-center text-xs" role="status">
        {protectedMode ? (language === 'ar' ? 'سجلات المرضى محفوظة بالخادم — هوية موحدة' : 'Patient records on the server — one identity') : (language === 'ar' ? 'نسخة عرض ببيانات نموذجية محفوظة بالمتصفح' : 'Demonstration clinic — sample records in browser storage')}
      </div>

      {/* Toast notification banner */}
      {feedback && (
        <div className="no-print bg-[color:var(--theme-action-primary)]/10 border-b border-[color:var(--theme-action-primary)]/30 px-4 py-2 text-center text-xs theme-text-secondary flex items-center justify-center gap-2 transition-all">
          <CheckCircle className="w-3.5 h-3.5 text-[color:var(--theme-status-active)]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {protectedMode && casePanel?.(selectedPatient, language)}
        {failure && <p role="alert" className="theme-status-danger mb-4">{failureMessages[failure]?.[language === 'ar' ? 0 : 1] ?? (language === 'ar' ? 'تعذر إتمام الطلب.' : 'Request did not complete.')}</p>}
        {protectedMode && <p role="status" className="theme-text-muted text-xs mb-4">{unsupportedNotice}</p>}
        {activeTab === 'CENSUS' && (
          <fieldset disabled={clinicalUnavailable}>
          <DailyCensus
            unavailable={clinicalUnavailable}
            visits={dailyVisits}
            patients={storeState.patients}
            cases={storeState.cases}
            actorRole={storeState.actorRole}
            language={language}
            onSelectVisitForConsultation={handleSelectVisitForConsultation}
            onInspectDossier={handleInspectDossier}
            onRecordExit={handleRecordExit}
            onGoToIntake={() => setActiveTab('INTAKE')}
          />
          </fieldset>
        )}

        {activeTab === 'INTAKE' && (
          <PatientIntake
            patients={storeState.patients}
            cases={storeState.cases}
            actorRole={storeState.actorRole}
            language={language}
            serverRegistration={protectedMode}
            registrationDisabled={blocked}
            clinicalDisabled={clinicalUnavailable}
            onSearchPatients={boundary.search}
            onRetrievePatient={boundary.retrieve}
            searchPending={blocked}
            searchHasMore={boundary.hasMore()}
            onRegisterPatient={handleRegisterPatient}
            onRecordArrival={handleRecordArrival}
            onSelectPatientDossier={handleInspectDossier}
          />
        )}

        {activeTab === 'DOSSIER' && selectedPatient && (
          <PatientDossier
            clinicalUnavailable={clinicalUnavailable}
            patient={selectedPatient}
            cases={selectedPatientCases}
            visits={selectedPatientVisits}
            actorRole={storeState.actorRole}
            language={language}
            onOpenConsultation={handleSelectVisitForConsultation}
            onCompleteCase={handleCompleteCase}
            onStartNewVisitForCase={handleStartNewVisitForCase}
            onPrintPrescription={handleOpenPrintModalForVisit}
          />
        )}

        {activeTab === 'CONSULTATION' && protectedMode && <div className="theme-surface border theme-border rounded-xl p-6">{unsupportedNotice}</div>}
        {activeTab === 'DOSSIER' && !selectedPatient && <p role="status">{language === 'ar' ? 'اختر مريضًا من البحث أو دليل المرضى لفتح ملفه.' : 'Select a patient through intake lookup or the directory to open the dossier.'}</p>}
        {activeTab === 'CONSULTATION' && !protectedMode &&
          activeConsultationVisit &&
          activeConsultationPatient &&
          activeConsultationCase && (
            <DoctorConsultation
              visit={activeConsultationVisit}
              patient={activeConsultationPatient as PatientRecord}
              caseRecord={activeConsultationCase}
              actorRole={storeState.actorRole}
              language={language}
              onUpdateEncounter={handleUpdateEncounter}
              onAuthorizePrescription={handleAuthorizePrescription}
              onRecordExit={() => handleRecordExit(activeConsultationVisit.id)}
              onCompleteCase={() =>
                handleCompleteCase(activeConsultationCase.id)
              }
              onOpenPrintModal={() =>
                handleOpenPrintModalForVisit(
                  activeConsultationVisit,
                  activeConsultationCase
                )
              }
              onGoToDossier={() =>
                handleInspectDossier(activeConsultationPatient.patientId)
              }
            />
          )}

        {activeTab === 'DIRECTORY' && (
          <PatientDirectory
            serverMode={protectedMode}
            searchPending={blocked}
            searchHasMore={boundary.hasMore()}
            onSearchPatients={boundary.search}
            clinicalDisabled={clinicalUnavailable}
            patients={storeState.patients}
            cases={storeState.cases}
            visits={storeState.visits}
            language={language}
            onInspectDossier={handleInspectDossier}
            onStartVisit={(patientId) => {
              setActivePatientId(patientId);
              setActiveTab('INTAKE');
            }}
          />
        )}
      </main>

      {/* Certified Printable Prescription Modal */}
      {!protectedMode && printVisit && printCase && (
        <PrintPrescriptionModal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          visit={printVisit}
          patient={
            storeState.patients.find((p) => p.patientId === printVisit.patientId)! as PatientRecord
          }
          caseRecord={printCase}
          lang={language}
        />
      )}

      {/* Clinical Integrity & Audit Footer */}
      <footer className="no-print border-t theme-border theme-canvas py-4 text-xs theme-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[color:var(--theme-authority)]/60" />
            <span>
              {'Dr.Roby Clinic EMR · Longitudinal Record Architecture · Patient → Case → Visit → Clinic Day'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] theme-text-muted">
              {protectedMode ? 'PostgreSQL · Server identity · Patient registration and retrieval' : 'Demonstration clinic · Browser persistence'}
            </span>

            {!protectedMode && <button
              type="button"
              onClick={handleResetToBaseline}
              className="theme-text-muted hover:text-[color:var(--theme-text-secondary)] transition-colors flex items-center gap-1"
              title="Reset sample data to initial baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>}
          </div>
        </div>
      </footer>
    </div>
  );
}
