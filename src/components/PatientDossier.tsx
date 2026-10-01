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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Identity & Derived Age */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold font-sans text-lg shrink-0">
              {patient.name.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-white font-sans">
                  {patient.name}
                </h2>
                {/* Authoritative CPN */}
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60 shadow-xs">
                  {patient.clinicPatientNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {patient.gender === 'Male' ? t.genderMale : t.genderFemale}
                </span>
              </div>

              {/* Authoritative DOB and Derived Age */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">{t.dateOfBirth}:</span>
                  <span className="font-mono font-medium text-slate-200">{patient.dateOfBirth}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">{t.derivedAge}:</span>
                  <strong className="font-mono text-teal-300 font-semibold">
                    {detailedAge.years} {t.derivedAgeYears}, {detailedAge.months} {t.derivedAgeMonths} ({detailedAge.days} {t.derivedAgeDays})
                  </strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-200">{patient.profession}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-300">{patient.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Case Summary Stats */}
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
            <div className="text-center px-3 border-r border-slate-800 rtl:border-r-0 rtl:border-l">
              <span className="text-slate-500 block">Total Cases</span>
              <strong className="text-base font-mono text-white">{cases.length}</strong>
            </div>
            <div className="text-center px-3">
              <span className="text-slate-500 block">Cumulative Visits</span>
              <strong className="text-base font-mono text-teal-400">{visits.length}</strong>
            </div>
          </div>
        </div>

        {/* Known Allergies Highlight */}
        {patient.pastHistory.knownAllergies.length > 0 && (
          <div className="mt-4 px-3.5 py-2 bg-amber-950/30 border border-amber-800/40 rounded-lg text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{t.knownAllergies}:</span>
            <span>{patient.pastHistory.knownAllergies.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Dossier Navigation Tabs */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('CASES')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'CASES'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
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
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
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
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'ar' ? 'مسارات الحالات السريرية' : 'Clinical Cases'}
              </h3>
              <span className="text-xs text-slate-500 font-mono">{cases.length}</span>
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
                        ? 'bg-slate-800 border-teal-500 ring-1 ring-teal-500/30'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-teal-400">
                        {c.id}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-teal-950 text-teal-300 border border-teal-800/40'
                        }`}
                      >
                        {c.state}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-1.5 font-sans line-clamp-2">
                      {c.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
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
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
                {/* Case Header with Doctor Complete Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-teal-400">
                        {selectedCase.id}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">
                        Opened on {selectedCase.openedDate}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5 font-sans">
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
                            ? 'bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-slate-700'
                            : 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                        title={actorRole === 'Doctor' ? t.completeCaseAction : t.completeCaseDoctorOnly}
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.completeCaseAction}</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded-lg text-xs font-semibold">
                        <CheckCircle2Icon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.caseCompletedBadge}</span>
                      </span>
                    )}

                    {selectedCase.state !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => onStartNewVisitForCase(patient.patientId, selectedCase.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
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
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                      {t.visitsUnderCase}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {visitsForSelectedCase.length} Encounters
                    </span>
                  </div>

                  {visitsForSelectedCase.length === 0 ? (
                    <div className="p-6 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-500">
                      {t.noPastVisits}
                    </div>
                  ) : (
                    visitsForSelectedCase.map((v, index) => (
                      <div
                        key={v.id}
                        className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3"
                      >
                        {/* Visit Card Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-teal-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {v.id}
                            </span>
                            <span className="font-mono text-slate-400">{v.date} · {v.time}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-400 font-sans">{v.visitType}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {v.prescription?.isAuthorized && (
                              <button
                                type="button"
                                onClick={() => onPrintPrescription(v, selectedCase)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-teal-950 text-teal-300 border border-teal-800/60 rounded text-[11px] font-medium transition-colors"
                              >
                                <Printer className="w-3 h-3 text-teal-400" />
                                <span>{t.printCertifiedRxBtn}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onOpenConsultation(v.id)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 rounded text-[11px] font-semibold transition-colors"
                            >
                              <Stethoscope className="w-3 h-3" />
                              <span>{t.enterConsultation}</span>
                            </button>
                          </div>
                        </div>

                        {/* Complaint & Vitals Summary */}
                        <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                          <span className="text-slate-500 font-medium block mb-0.5">{t.complaintLabel}:</span>
                          <p>{v.currentComplaint}</p>
                        </div>

                        {v.vitals && (
                          <div className="flex flex-wrap gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
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
                          <div className="text-xs border-t border-slate-900 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {v.finalDiagnosis && (
                              <div>
                                <span className="text-teal-400 font-semibold block">{t.finalDiagnosis}:</span>
                                <span className="text-slate-200">{v.finalDiagnosis}</span>
                              </div>
                            )}
                            {v.preliminaryDiagnosis && (
                              <div>
                                <span className="text-amber-400 font-semibold block">{t.preliminaryDiagnosis}:</span>
                                <span className="text-slate-300">{v.preliminaryDiagnosis}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Prescribed Medications Chips */}
                        {v.prescription?.items && v.prescription.items.length > 0 && (
                          <div className="pt-2 border-t border-slate-900">
                            <span className="text-[11px] text-slate-500 font-medium block mb-1.5 flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-teal-400" />
                              <span>{t.rxWorkspaceTitle}:</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {v.prescription.items.map((m) => (
                                <span
                                  key={m.id}
                                  className="text-[11px] px-2 py-0.5 bg-slate-900 text-teal-200 rounded border border-teal-900/50"
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
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
                No active case selected.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAST MEDICAL HISTORY */}
      {activeTab === 'PAST_HISTORY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-sans">
              {t.pastHistorySection}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.pastHistoryHelp}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                {t.chronicIllnesses}
              </span>
              {patient.pastHistory.chronicIllnesses.length === 0 ? (
                <span className="text-xs text-slate-500">None reported</span>
              ) : (
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {patient.pastHistory.chronicIllnesses.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {t.knownAllergies}
              </span>
              {patient.pastHistory.knownAllergies.length === 0 ? (
                <span className="text-xs text-slate-500">No known allergies</span>
              ) : (
                <ul className="text-xs text-amber-200 space-y-1 list-disc list-inside">
                  {patient.pastHistory.knownAllergies.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t.surgicalHistory}
              </span>
              {patient.pastHistory.surgicalHistory.length === 0 ? (
                <span className="text-xs text-slate-500">None</span>
              ) : (
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {patient.pastHistory.surgicalHistory.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t.familyHistory}
              </span>
              {patient.pastHistory.familyHistory.length === 0 ? (
                <span className="text-xs text-slate-500">Non-contributory</span>
              ) : (
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {patient.pastHistory.familyHistory.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.lifestyleNotes}
            </span>
            <p className="text-xs text-slate-300 font-sans">
              {patient.pastHistory.lifestyleNotes || 'No specific habits recorded.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: LONGITUDINAL TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-sans">
              {t.longitudinalTimelineTab}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ar'
                ? 'مسار تراكمي زمني متسلسل لجميع الزيارات والقرارات السريرية للمريض عبر الأيام والحالات.'
                : 'Cumulative chronological continuum of all patient visits and clinical decisions across clinic days.'}
            </p>
          </div>

          <div className="relative border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-800 ml-4 rtl:ml-0 rtl:mr-4 space-y-8 pl-6 rtl:pl-0 rtl:pr-6">
            {sortedPatientVisits.map((v) => {
              const caseRecord = cases.find((c) => c.id === v.caseId);
              return (
                <div key={v.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] rtl:-left-auto rtl:-right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 border-4 border-slate-900" />

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {v.id}
                        </span>
                        <span className="font-mono text-xs text-slate-300 font-semibold">{v.date}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400">{caseRecord?.id}: {caseRecord?.title}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenConsultation(v.id)}
                        className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                      >
                        <span>{t.enterConsultation}</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-sans">
                      <strong className="text-slate-400 font-medium">{t.complaintLabel}: </strong>
                      {v.currentComplaint}
                    </p>

                    {(v.finalDiagnosis || v.preliminaryDiagnosis) && (
                      <div className="text-xs text-teal-300 bg-teal-950/30 p-2.5 rounded border border-teal-800/40">
                        <strong className="text-teal-400 block mb-0.5">
                          {v.finalDiagnosis ? t.finalDiagnosis : t.preliminaryDiagnosis}:
                        </strong>
                        <span>{v.finalDiagnosis || v.preliminaryDiagnosis}</span>
                      </div>
                    )}

                    {v.prescription?.items && v.prescription.items.length > 0 && (
                      <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-300">{t.rxWorkspaceTitle}:</span>
                        {v.prescription.items.map((m) => (
                          <span
                            key={m.id}
                            className="font-mono text-[11px] px-2 py-0.5 bg-slate-900 text-teal-300 rounded border border-slate-800"
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
