import React, { useState, useMemo } from 'react';
import {
  PatientRecord,
  CaseRecord,
  VisitRecord,
  ActorRole,
} from '../domain/types';
import { translations, Language } from '../i18n/translations';
import { calculateDetailedAge } from '../domain/patientAge';
import {
  User,
  Calendar,
  Phone,
  Briefcase,
  AlertCircle,
  FileCheck2,
  Clock,
  Stethoscope,
  Pill,
  ChevronRight,
  ShieldCheck,
  Printer,
  PlusCircle,
  History,
  FolderOpen,
} from 'lucide-react';

interface PatientDossierProps {
  patient: PatientRecord;
  cases: CaseRecord[];
  visits: VisitRecord[];
  actorRole: ActorRole;
  language: Language;
  onOpenConsultation: (visitId: string) => void;
  onCompleteCase: (caseId: string) => void;
  onStartNewVisitForCase: (patientId: string, caseId: string) => void;
  onPrintPrescription: (visit: VisitRecord, caseRecord: CaseRecord) => void;
}

export const PatientDossier: React.FC<PatientDossierProps> = ({
  patient,
  cases,
  visits,
  actorRole,
  language,
  onOpenConsultation,
  onCompleteCase,
  onStartNewVisitForCase,
  onPrintPrescription,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'CASES' | 'PAST_HISTORY' | 'TIMELINE'>('CASES');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    cases.length > 0 ? cases[cases.length - 1].id : ''
  );

  const detailedAge = useMemo(
    () => calculateDetailedAge(patient.dateOfBirth),
    [patient.dateOfBirth]
  );

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) || cases[0] || null,
    [cases, selectedCaseId]
  );

  const visitsForSelectedCase = useMemo(() => {
    if (!selectedCase) return [];
    return visits.filter((v) => v.caseId === selectedCase.id);
  }, [visits, selectedCase]);

  // Longitudinal timeline of all visits for this patient sorted chronologically
  const sortedPatientVisits = useMemo(() => {
    return [...visits].sort((a, b) => {
      const dateA = `${a.date}T${a.time}`;
      const dateB = `${b.date}T${b.time}`;
      return dateB.localeCompare(dateA);
    });
  }, [visits]);

  return (
    <div className="space-y-6">
      {/* Patient Dossier Master Header */}
      <div className="theme-surface border theme-border rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Identity & Derived Age */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[color:var(--theme-action-primary)]/10 border border-[color:var(--theme-action-primary)]/30 flex items-center justify-center text-[color:var(--theme-status-active)] font-bold font-sans text-lg shrink-0">
              {patient.name.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold theme-text-primary font-sans">
                  {patient.name}
                </h2>
                {/* Authoritative CPN */}
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[color:var(--theme-action-primary)]/10 text-[color:var(--theme-text-technical)] border border-[color:var(--theme-action-primary)]/30 shadow-xs">
                  {patient.clinicPatientNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded theme-surface-nested theme-text-secondary border theme-border">
                  {patient.gender === 'Male' ? t.genderMale : t.genderFemale}
                </span>
              </div>

              {/* Authoritative DOB and Derived Age */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs theme-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 theme-text-muted" />
                  <span className="theme-text-secondary">{t.dateOfBirth}:</span>
                  <span className="font-mono font-medium theme-text-primary">{patient.dateOfBirth}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="theme-text-secondary">{t.derivedAge}:</span>
                  <strong className="font-mono text-[color:var(--theme-status-active)] font-semibold">
                    {detailedAge.years} {t.derivedAgeYears}, {detailedAge.months} {t.derivedAgeMonths} ({detailedAge.days} {t.derivedAgeDays})
                  </strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 theme-text-muted" />
                  <span className="theme-text-primary">{patient.profession}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 theme-text-muted" />
                  <span className="font-mono theme-text-secondary">{patient.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Case Summary Stats */}
          <div className="flex items-center gap-3 theme-surface-input p-3 rounded-lg border theme-border text-xs">
            <div className="text-center px-3 border-r theme-border rtl:border-r-0 rtl:border-l">
              <span className="theme-text-muted block">Total Cases</span>
              <strong className="text-base font-mono theme-text-primary">{cases.length}</strong>
            </div>
            <div className="text-center px-3">
              <span className="theme-text-muted block">Cumulative Visits</span>
              <strong className="text-base font-mono text-[color:var(--theme-status-active)]">{visits.length}</strong>
            </div>
          </div>
        </div>

        {/* Known Allergies Highlight */}
        {patient.pastHistory.knownAllergies.length > 0 && (
          <div className="mt-4 px-3.5 py-2 bg-[color:var(--theme-status-warning)]/10 border border-[color:var(--theme-status-warning)]/30 rounded-lg text-xs text-[color:var(--theme-status-warning)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[color:var(--theme-status-warning)] shrink-0" />
            <span className="font-semibold">{t.knownAllergies}:</span>
            <span>{patient.pastHistory.knownAllergies.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Dossier Navigation Tabs */}
      <div className="flex p-1 theme-surface border theme-border rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('CASES')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'CASES'
              ? 'theme-action-primary text-white shadow-xs'
              : 'theme-text-secondary hover:theme-text-primary'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>{t.clinicalCasesTab} ({cases.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PAST_HISTORY')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'PAST_HISTORY'
              ? 'theme-action-primary text-white shadow-xs'
              : 'theme-text-secondary hover:theme-text-primary'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t.pastHistoryTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TIMELINE')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'TIMELINE'
              ? 'theme-action-primary text-white shadow-xs'
              : 'theme-text-secondary hover:theme-text-primary'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t.longitudinalTimelineTab} ({visits.length})</span>
        </button>
      </div>

      {/* TAB 1: CLINICAL CASES & ENCOUNTERS */}
      {activeTab === 'CASES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider theme-text-secondary">
                {language === 'ar' ? 'مسارات الحالات السريرية' : 'Clinical Cases'}
              </h3>
              <span className="text-xs theme-text-muted font-mono">{cases.length}</span>
            </div>

            <div className="space-y-2">
              {cases.map((c) => {
                const caseVisitsCount = visits.filter((v) => v.caseId === c.id).length;
                const isSelected = selectedCase?.id === c.id;
                const isCompleted = c.state === 'Completed';

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full p-4 rounded-xl border text-left rtl:text-right transition-all ${
                      isSelected
                        ? 'theme-surface-nested border-[color:var(--theme-status-active)] ring-1 ring-[color:var(--theme-status-active)]/30'
                        : 'theme-surface border theme-border hover:bg-[color:var(--theme-border)]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[color:var(--theme-status-active)]">
                        {c.id}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'theme-surface-nested theme-text-secondary'
                            : 'bg-[color:var(--theme-status-active)]/10 text-[color:var(--theme-status-active)] border border-[color:var(--theme-status-active)]/30'
                        }`}
                      >
                        {c.state}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold theme-text-primary mt-1.5 font-sans line-clamp-2">
                      {c.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between text-[11px] theme-text-muted font-mono">
                      <span>{c.openedDate}</span>
                      <span>{caseVisitsCount} {t.recordedVisits}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visits Under Selected Case Column */}
          <div className="lg:col-span-2 space-y-4">
            {selectedCase ? (
              <div className="theme-surface border theme-border rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
                {/* Case Header with Doctor Complete Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b theme-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[color:var(--theme-status-active)]">
                        {selectedCase.id}
                      </span>
                      <span className="theme-text-muted">·</span>
                      <span className="text-xs theme-text-secondary">
                        Opened on {selectedCase.openedDate}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold theme-text-primary mt-0.5 font-sans">
                      {selectedCase.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCase.state !== 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => onCompleteCase(selectedCase.id)}
                        disabled={actorRole !== 'Doctor'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          actorRole === 'Doctor'
                            ? 'theme-action-secondary hover:bg-[color:var(--theme-status-success)]/10 hover:text-[color:var(--theme-status-success)] text-white border theme-border'
                            : 'opacity-50 cursor-not-allowed theme-surface theme-text-muted border theme-border'
                        }`}
                        title={actorRole === 'Doctor' ? t.completeCaseAction : t.completeCaseDoctorOnly}
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-[color:var(--theme-status-success)]" />
                        <span>{t.completeCaseAction}</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 bg-[color:var(--theme-status-success)]/10 text-[color:var(--theme-status-success)] border border-[color:var(--theme-status-success)]/30 rounded-lg text-xs font-semibold">
                        <CheckCircle2Icon className="w-3.5 h-3.5 text-[color:var(--theme-status-success)]" />
                        <span>{t.caseCompletedBadge}</span>
                      </span>
                    )}

                    {selectedCase.state !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => onStartNewVisitForCase(patient.patientId, selectedCase.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 theme-action-primary hover:brightness-110 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تسجيل زيارة جديدة للحالة' : 'New Visit for Case'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Visits Chronological Stream for this Case */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--theme-status-active)]">
                      {t.visitsUnderCase}
                    </span>
                    <span className="text-[11px] font-mono theme-text-muted">
                      {visitsForSelectedCase.length} Encounters
                    </span>
                  </div>

                  {visitsForSelectedCase.length === 0 ? (
                    <div className="p-6 theme-surface-input rounded-lg border theme-border text-center text-xs theme-text-muted">
                      {t.noPastVisits}
                    </div>
                  ) : (
                    visitsForSelectedCase.map((v, index) => (
                      <div
                        key={v.id}
                        className="p-4 theme-surface-input rounded-xl border theme-border space-y-3"
                      >
                        {/* Visit Card Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-[color:var(--theme-status-active)] theme-surface px-2 py-0.5 rounded border theme-border">
                              {v.id}
                            </span>
                            <span className="font-mono theme-text-secondary">{v.date} · {v.time}</span>
                            <span className="theme-text-muted">·</span>
                            <span className="theme-text-secondary font-sans">{v.visitType}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {v.prescription?.isAuthorized && (
                              <button
                                type="button"
                                onClick={() => onPrintPrescription(v, selectedCase)}
                                className="flex items-center gap-1 px-2.5 py-1 theme-surface hover:bg-[color:var(--theme-action-primary)]/10 text-[color:var(--theme-text-technical)] border border-[color:var(--theme-action-primary)]/30 rounded text-[11px] font-medium transition-colors"
                              >
                                <Printer className="w-3 h-3 text-[color:var(--theme-status-active)]" />
                                <span>{t.printCertifiedRxBtn}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onOpenConsultation(v.id)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-[color:var(--theme-status-active)]/10 hover:bg-[color:var(--theme-status-active)] text-[color:var(--theme-status-active)] hover:text-white border border-[color:var(--theme-status-active)]/30 rounded text-[11px] font-semibold transition-colors"
                            >
                              <Stethoscope className="w-3 h-3" />
                              <span>{t.enterConsultation}</span>
                            </button>
                          </div>
                        </div>

                        {/* Complaint & Vitals Summary */}
                        <div className="text-xs theme-text-secondary theme-surface p-2.5 rounded border theme-border">
                          <span className="theme-text-muted font-medium block mb-0.5">{t.complaintLabel}:</span>
                          <p>{v.currentComplaint}</p>
                        </div>

                        {v.vitals && (
                          <div className="flex flex-wrap gap-3 text-[11px] font-mono theme-text-secondary pt-0.5">
                            {v.vitals.bloodPressureSystolic && (
                              <span>BP: {v.vitals.bloodPressureSystolic}/{v.vitals.bloodPressureDiastolic} mmHg</span>
                            )}
                            {v.vitals.heartRate && <span>HR: {v.vitals.heartRate} bpm</span>}
                            {v.vitals.temperatureCelsius && <span>Temp: {v.vitals.temperatureCelsius}°C</span>}
                            {v.vitals.oxygenSaturation && <span>SpO2: {v.vitals.oxygenSaturation}%</span>}
                          </div>
                        )}

                        {/* Diagnoses & Treatment */}
                        {(v.finalDiagnosis || v.preliminaryDiagnosis) && (
                          <div className="text-xs border-t theme-border pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {v.finalDiagnosis && (
                              <div>
                                <span className="text-[color:var(--theme-status-active)] font-semibold block">{t.finalDiagnosis}:</span>
                                <span className="theme-text-primary">{v.finalDiagnosis}</span>
                              </div>
                            )}
                            {v.preliminaryDiagnosis && (
                              <div>
                                <span className="text-[color:var(--theme-status-warning)] font-semibold block">{t.preliminaryDiagnosis}:</span>
                                <span className="theme-text-secondary">{v.preliminaryDiagnosis}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Prescribed Medications Chips */}
                        {v.prescription?.items && v.prescription.items.length > 0 && (
                          <div className="pt-2 border-t theme-border">
                            <span className="text-[11px] theme-text-muted font-medium block mb-1.5 flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-[color:var(--theme-status-active)]" />
                              <span>{t.rxWorkspaceTitle}:</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {v.prescription.items.map((m) => (
                                <span
                                  key={m.id}
                                  className="text-[11px] px-2 py-0.5 theme-surface text-[color:var(--theme-text-technical)] rounded border border-[color:var(--theme-action-primary)]/30"
                                >
                                  {m.name} {m.strength} ({m.dose} · {m.frequency})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="theme-surface border theme-border rounded-xl p-8 text-center theme-text-muted text-xs">
                No active case selected.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAST MEDICAL HISTORY */}
      {activeTab === 'PAST_HISTORY' && (
        <div className="theme-surface border theme-border rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold theme-text-primary font-sans">
              {t.pastHistorySection}
            </h3>
            <p className="text-xs theme-text-secondary mt-1">
              {t.pastHistoryHelp}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 theme-surface-input rounded-xl border theme-border space-y-2">
              <span className="text-xs font-bold text-[color:var(--theme-status-active)] uppercase tracking-wider block">
                {t.chronicIllnesses}
              </span>
              {patient.pastHistory.chronicIllnesses.length === 0 ? (
                <span className="text-xs theme-text-muted">None reported</span>
              ) : (
                <ul className="text-xs theme-text-secondary space-y-1 list-disc list-inside">
                  {patient.pastHistory.chronicIllnesses.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 theme-surface-input rounded-xl border theme-border space-y-2">
              <span className="text-xs font-bold text-[color:var(--theme-status-warning)] uppercase tracking-wider block">
                {t.knownAllergies}
              </span>
              {patient.pastHistory.knownAllergies.length === 0 ? (
                <span className="text-xs theme-text-muted">No known allergies</span>
              ) : (
                <ul className="text-xs text-[color:var(--theme-status-warning)] space-y-1 list-disc list-inside">
                  {patient.pastHistory.knownAllergies.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 theme-surface-input rounded-xl border theme-border space-y-2">
              <span className="text-xs font-bold theme-text-secondary uppercase tracking-wider block">
                {t.surgicalHistory}
              </span>
              {patient.pastHistory.surgicalHistory.length === 0 ? (
                <span className="text-xs theme-text-muted">None</span>
              ) : (
                <ul className="text-xs theme-text-secondary space-y-1 list-disc list-inside">
                  {patient.pastHistory.surgicalHistory.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 theme-surface-input rounded-xl border theme-border space-y-2">
              <span className="text-xs font-bold theme-text-secondary uppercase tracking-wider block">
                {t.familyHistory}
              </span>
              {patient.pastHistory.familyHistory.length === 0 ? (
                <span className="text-xs theme-text-muted">Non-contributory</span>
              ) : (
                <ul className="text-xs theme-text-secondary space-y-1 list-disc list-inside">
                  {patient.pastHistory.familyHistory.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="p-4 theme-surface-input rounded-xl border theme-border space-y-2">
            <span className="text-xs font-bold theme-text-secondary uppercase tracking-wider block">
              {t.lifestyleNotes}
            </span>
            <p className="text-xs theme-text-secondary font-sans">
              {patient.pastHistory.lifestyleNotes || 'No specific habits recorded.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: LONGITUDINAL TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="theme-surface border theme-border rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold theme-text-primary font-sans">
              {t.longitudinalTimelineTab}
            </h3>
            <p className="text-xs theme-text-secondary mt-1">
              {language === 'ar'
                ? 'مسار تراكمي زمني متسلسل لجميع الزيارات والقرارات السريرية للمريض عبر الأيام والحالات.'
                : 'Cumulative chronological continuum of all patient visits and clinical decisions across clinic days.'}
            </p>
          </div>

          <div className="relative border-l-2 rtl:border-l-0 rtl:border-r-2 theme-border ml-4 rtl:ml-0 rtl:mr-4 space-y-8 pl-6 rtl:pl-0 rtl:pr-6">
            {sortedPatientVisits.map((v) => {
              const caseRecord = cases.find((c) => c.id === v.caseId);
              return (
                <div key={v.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] rtl:-left-auto rtl:-right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[color:var(--theme-status-active)] border-4 border-[color:var(--theme-canvas)]" />

                  <div className="theme-surface-input p-4 rounded-xl border theme-border space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[color:var(--theme-status-active)] theme-surface px-2 py-0.5 rounded border theme-border">
                          {v.id}
                        </span>
                        <span className="font-mono text-xs theme-text-secondary font-semibold">{v.date}</span>
                        <span className="theme-text-muted">·</span>
                        <span className="text-xs theme-text-secondary">{caseRecord?.id}: {caseRecord?.title}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenConsultation(v.id)}
                        className="text-xs text-[color:var(--theme-status-active)] hover:text-[color:var(--theme-status-active)] font-medium flex items-center gap-1"
                      >
                        <span>{t.enterConsultation}</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>

                    <p className="text-xs theme-text-secondary font-sans">
                      <strong className="theme-text-secondary font-medium">{t.complaintLabel}: </strong>
                      {v.currentComplaint}
                    </p>

                    {(v.finalDiagnosis || v.preliminaryDiagnosis) && (
                      <div className="text-xs text-[color:var(--theme-status-active)] bg-[color:var(--theme-status-active)]/10 p-2.5 rounded border border-[color:var(--theme-status-active)]/30">
                        <strong className="text-[color:var(--theme-status-active)] block mb-0.5">
                          {v.finalDiagnosis ? t.finalDiagnosis : t.preliminaryDiagnosis}:
                        </strong>
                        <span>{v.finalDiagnosis || v.preliminaryDiagnosis}</span>
                      </div>
                    )}

                    {v.prescription?.items && v.prescription.items.length > 0 && (
                      <div className="text-xs theme-text-secondary flex items-center gap-2 flex-wrap">
                        <span className="font-medium theme-text-secondary">{t.rxWorkspaceTitle}:</span>
                        {v.prescription.items.map((m) => (
                          <span
                            key={m.id}
                            className="font-mono text-[11px] px-2 py-0.5 theme-surface text-[color:var(--theme-status-active)] rounded border theme-border"
                          >
                            {m.name} {m.strength}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
