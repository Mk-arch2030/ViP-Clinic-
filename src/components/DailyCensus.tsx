import React, { useState } from 'react';
import { VisitRecord, PatientRecord, CaseRecord, ActorRole } from '../domain/types';
import { translations, Language } from '../i18n/translations';
import {
  Users,
  Clock,
  Stethoscope,
  LogOut,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';

interface DailyCensusProps {
  visits: VisitRecord[];
  patients: PatientRecord[];
  cases: CaseRecord[];
  actorRole: ActorRole;
  language: Language;
  onSelectVisitForConsultation: (visitId: string) => void;
  onInspectDossier: (patientId: string) => void;
  onRecordExit: (visitId: string) => void;
  onGoToIntake: () => void;
}

export const DailyCensus: React.FC<DailyCensusProps> = ({
  visits,
  patients,
  cases,
  actorRole,
  language,
  onSelectVisitForConsultation,
  onInspectDossier,
  onRecordExit,
  onGoToIntake,
}) => {
  const t = translations[language];
  const [filter, setFilter] = useState<'ALL' | 'AWAITING_DOCTOR' | 'WITH_DOCTOR' | 'EXITED'>('ALL');

  const awaitingDoctorCount = visits.filter(
    (v) => v.operationalStatus === 'AWAITING_DOCTOR'
  ).length;
  const withDoctorCount = visits.filter(
    (v) => v.operationalStatus === 'WITH_DOCTOR'
  ).length;
  const exitedCount = visits.filter(
    (v) => v.operationalStatus === 'EXITED' || v.operationalStatus === 'COMPLETED'
  ).length;

  const filteredVisits = visits.filter((v) => {
    if (filter === 'ALL') return true;
    if (filter === 'AWAITING_DOCTOR') return v.operationalStatus === 'AWAITING_DOCTOR';
    if (filter === 'WITH_DOCTOR') return v.operationalStatus === 'WITH_DOCTOR';
    if (filter === 'EXITED') return v.operationalStatus === 'EXITED' || v.operationalStatus === 'COMPLETED';
    return true;
  });

  const getPatientForVisit = (patientId: string) =>
    patients.find((p) => p.patientId === patientId);

  const getCaseForVisit = (caseId: string) =>
    cases.find((c) => c.id === caseId);

  return (
    <div className="space-y-6">
      {/* Top Banner & Intake CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white font-sans">
              {t.censusSummary}
            </h2>
            <span className="font-mono text-xs text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/40">
              {visits.length} {t.recordedVisits}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {language === 'ar'
              ? 'متابعة تدفق المرضى اليومي: من وصول المريض وتسجيل التمريض إلى كشف الطبيب والروشتة والمغادرة.'
              : 'Daily patient flow oversight: from arrival registration to clinical examination, Rx authorization, and exit.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToIntake}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.startVisitForPatient}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`p-4 rounded-xl border text-left rtl:text-right transition-all ${
            filter === 'ALL'
              ? 'bg-slate-800 border-teal-500/50 ring-1 ring-teal-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{t.allVisits}</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {visits.length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('AWAITING_DOCTOR')}
          className={`p-4 rounded-xl border text-left rtl:text-right transition-all ${
            filter === 'AWAITING_DOCTOR'
              ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300">{t.awaitingDoctor}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            {awaitingDoctorCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('WITH_DOCTOR')}
          className={`p-4 rounded-xl border text-left rtl:text-right transition-all ${
            filter === 'WITH_DOCTOR'
              ? 'bg-teal-950/30 border-teal-500/50 ring-1 ring-teal-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-teal-300">{t.withDoctor}</span>
            <Stethoscope className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-teal-400">
            {withDoctorCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('EXITED')}
          className={`p-4 rounded-xl border text-left rtl:text-right transition-all ${
            filter === 'EXITED'
              ? 'bg-slate-800 border-slate-600 ring-1 ring-slate-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">{t.awaitingFollowUp}</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-200">
            {exitedCount}
          </div>
        </button>
      </div>

      {/* Visits List */}
      <div className="space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-10 text-center">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">{t.noVisitsFound}</p>
          </div>
        ) : (
          filteredVisits.map((visit) => {
            const patient = getPatientForVisit(visit.patientId);
            const caseRecord = getCaseForVisit(visit.caseId);

            const isAwaiting = visit.operationalStatus === 'AWAITING_DOCTOR';
            const isWithDoctor = visit.operationalStatus === 'WITH_DOCTOR';
            const isExited = visit.operationalStatus === 'EXITED' || visit.operationalStatus === 'COMPLETED';

            return (
              <div
                key={visit.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Patient & Encounter Context */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-teal-300 rounded border border-slate-700">
                        {visit.id}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-teal-950 text-teal-300 rounded border border-teal-800/50">
                        {patient?.clinicPatientNumber || 'CPN'}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono text-xs text-slate-400">
                        {visit.time}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">
                        {visit.visitType}
                      </span>

                      {/* Status indicator */}
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          isAwaiting
                            ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                            : isWithDoctor
                            ? 'bg-teal-950/70 text-teal-300 border border-teal-800/50'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isAwaiting
                          ? t.awaitingDoctor
                          : isWithDoctor
                          ? t.withDoctor
                          : t.awaitingFollowUp}
                      </span>
                    </div>

                    {/* Patient Name & Case */}
                    <div>
                      <h3 className="text-base font-bold text-white font-sans">
                        {patient?.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-slate-300 font-medium">
                          {caseRecord?.id}: {caseRecord?.title}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span>
                          {t.visitCardCondition}:{' '}
                          <strong
                            className={
                              visit.arrivalCondition === 'Severely Unwell'
                                ? 'text-rose-400'
                                : visit.arrivalCondition === 'Moderately Unwell'
                                ? 'text-amber-400'
                                : 'text-slate-300'
                            }
                          >
                            {visit.arrivalCondition === 'Normal'
                              ? t.conditionNormal
                              : visit.arrivalCondition === 'Moderately Unwell'
                              ? t.conditionModerate
                              : t.conditionSevere}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Current Complaint Snippet */}
                    <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 font-sans">
                      <span className="text-slate-500 font-medium">{t.complaintLabel}: </span>
                      <span>{visit.currentComplaint}</span>
                    </div>

                    {/* Rx status if committed */}
                    {visit.prescription?.isAuthorized && (
                      <div className="flex items-center gap-1.5 text-xs text-teal-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.rxAuthorizedBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInspectDossier(visit.patientId)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t.inspectDossier}</span>
                    </button>

                    {actorRole === 'Doctor' ? (
                      <button
                        type="button"
                        onClick={() => onSelectVisitForConsultation(visit.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{t.enterConsultation}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectVisitForConsultation(visit.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{language === 'ar' ? 'عرض تفاصيل الزيارة' : 'View Visit Data'}</span>
                      </button>
                    )}

                    {!isExited && (
                      <button
                        type="button"
                        onClick={() => onRecordExit(visit.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-medium transition-colors border border-slate-800 hover:border-rose-900"
                        title={t.recordExit}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.recordExit}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
