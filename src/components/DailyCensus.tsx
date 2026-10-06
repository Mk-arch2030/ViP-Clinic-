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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 theme-surface border theme-border rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold theme-text-primary font-sans">
              {t.censusSummary}
            </h2>
            <span className="font-mono text-xs text-[color:var(--theme-text-technical)] bg-[color:var(--theme-action-primary)]/10 px-2 py-0.5 rounded border border-[color:var(--theme-action-primary)]/30">
              {visits.length} {t.recordedVisits}
            </span>
          </div>
          <p className="text-xs theme-text-secondary mt-1 max-w-xl">
            {language === 'ar'
              ? 'متابعة تدفق المرضى اليومي: من وصول المريض وتسجيل التمريض إلى كشف الطبيب والروشتة والمغادرة.'
              : 'Daily patient flow oversight: from arrival registration to clinical examination, Rx authorization, and exit.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToIntake}
          className="flex items-center gap-2 px-4 py-2 theme-action-primary hover:brightness-110 theme-text-primary rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
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
              ? 'theme-surface-nested border-[color:var(--theme-status-active)]/50 ring-1 ring-[color:var(--theme-status-active)]/30'
              : 'theme-surface border theme-border hover:bg-[color:var(--theme-border)]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs theme-text-muted">{t.allVisits}</span>
            <Users className="w-4 h-4 theme-text-muted" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono theme-text-primary">
            {visits.length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('AWAITING_DOCTOR')}
          className={`p-4 rounded-xl border text-left rtl:text-right transition-all ${
            filter === 'AWAITING_DOCTOR'
              ? 'bg-[color:var(--theme-status-warning)]/10 border-[color:var(--theme-status-warning)]/50 ring-1 ring-[color:var(--theme-status-warning)]/30'
              : 'theme-surface border theme-border hover:bg-[color:var(--theme-border)]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[color:var(--theme-status-warning)]">{t.awaitingDoctor}</span>
            <Clock className="w-4 h-4 text-[color:var(--theme-status-warning)]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[color:var(--theme-status-warning)]">
            {awaitingDoctorCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('WITH_DOCTOR')}
          className={`p-4 rounded-xl border text-left rtl:text-right transition-all ${
            filter === 'WITH_DOCTOR'
              ? 'bg-[color:var(--theme-status-active)]/10 border-[color:var(--theme-status-active)]/50 ring-1 ring-[color:var(--theme-status-active)]/30'
              : 'theme-surface border theme-border hover:bg-[color:var(--theme-border)]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[color:var(--theme-status-active)]">{t.withDoctor}</span>
            <Stethoscope className="w-4 h-4 text-[color:var(--theme-status-active)]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[color:var(--theme-status-active)]">
            {withDoctorCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('EXITED')}
          className={`p-4 rounded-xl border text-left rtl:text-right transition-all ${
            filter === 'EXITED'
              ? 'theme-surface-nested border-[color:var(--theme-border)] ring-1 ring-[color:var(--theme-text-muted)]/30'
              : 'theme-surface border theme-border hover:bg-[color:var(--theme-border)]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs theme-text-secondary">{t.awaitingFollowUp}</span>
            <CheckCircle2 className="w-4 h-4 theme-text-muted" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono theme-text-primary">
            {exitedCount}
          </div>
        </button>
      </div>

      {/* Visits List */}
      <div className="space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="theme-surface border theme-border rounded-xl p-10 text-center">
            <AlertCircle className="w-8 h-8 theme-text-muted mx-auto mb-2" />
            <p className="text-sm theme-text-muted">{t.noVisitsFound}</p>
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
                className="theme-surface border theme-border rounded-xl p-4 sm:p-5 hover:border-[color:var(--theme-text-muted)] transition-colors shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Patient & Encounter Context */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 theme-surface-nested text-[color:var(--theme-status-active)] rounded border theme-border">
                        {visit.id}
                      </span>
                      <span className="theme-text-muted">·</span>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[color:var(--theme-action-primary)]/10 text-[color:var(--theme-status-active)] rounded border border-[color:var(--theme-action-primary)]/30">
                        {patient?.clinicPatientNumber || 'CPN'}
                      </span>
                      <span className="theme-text-muted">·</span>
                      <span className="font-mono text-xs theme-text-muted">
                        {visit.time}
                      </span>
                      <span className="theme-text-muted">·</span>
                      <span className="text-xs theme-text-muted">
                        {visit.visitType}
                      </span>

                      {/* Status indicator */}
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          isAwaiting
                            ? 'bg-[color:var(--theme-status-warning)]/10 text-[color:var(--theme-status-warning)] border border-[color:var(--theme-status-warning)]/30'
                            : isWithDoctor
                            ? 'bg-[color:var(--theme-status-active)]/10 text-[color:var(--theme-status-active)] border border-[color:var(--theme-status-active)]/30'
                            : 'theme-surface-nested theme-text-secondary border theme-border'
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
                      <h3 className="text-base font-bold theme-text-primary font-sans">
                        {patient?.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs theme-text-muted mt-0.5">
                        <span className="theme-text-secondary font-medium">
                          {caseRecord?.id}: {caseRecord?.title}
                        </span>
                        <span className="theme-text-muted">·</span>
                        <span>
                          {t.visitCardCondition}:{' '}
                          <strong
                            className={
                              visit.arrivalCondition === 'Severely Unwell'
                                ? 'text-[color:var(--theme-status-danger)]'
                                : visit.arrivalCondition === 'Moderately Unwell'
                                ? 'text-[color:var(--theme-status-warning)]'
                                : 'theme-text-secondary'
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
                    <div className="text-xs theme-text-secondary theme-surface-input p-2.5 rounded-lg border theme-border font-sans">
                      <span className="theme-text-muted font-medium">{t.complaintLabel}: </span>
                      <span>{visit.currentComplaint}</span>
                    </div>

                    {/* Rx status if committed */}
                    {visit.prescription?.isAuthorized && (
                      <div className="flex items-center gap-1.5 text-xs text-[color:var(--theme-status-active)] font-medium">
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
                      className="flex items-center gap-1.5 px-3 py-2 theme-action-secondary hover:brightness-110 text-white rounded-lg text-xs font-medium transition-colors border theme-border"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[color:var(--theme-status-active)]" />
                      <span>{t.inspectDossier}</span>
                    </button>

                    {actorRole === 'Doctor' ? (
                      <button
                        type="button"
                        onClick={() => onSelectVisitForConsultation(visit.id)}
                        className="flex items-center gap-1.5 px-3 py-2 theme-action-primary hover:brightness-110 theme-text-primary rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{t.enterConsultation}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectVisitForConsultation(visit.id)}
                        className="flex items-center gap-1.5 px-3 py-2 theme-action-secondary hover:brightness-110 text-white rounded-lg text-xs font-medium transition-colors border theme-border"
                      >
                        <FileText className="w-3.5 h-3.5 text-[color:var(--theme-status-info)]" />
                        <span>{language === 'ar' ? 'عرض تفاصيل الزيارة' : 'View Visit Data'}</span>
                      </button>
                    )}

                    {!isExited && (
                      <button
                        type="button"
                        onClick={() => onRecordExit(visit.id)}
                        className="flex items-center gap-1.5 px-3 py-2 theme-surface hover:bg-[color:var(--theme-status-danger)]/10 theme-text-muted hover:text-[color:var(--theme-status-danger)] rounded-lg text-xs font-medium transition-colors border theme-border hover:border-[color:var(--theme-status-danger)]/50"
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
