import type { ClinicPatient } from '../integration/clinic-boundary';
import React, { useState, useMemo } from 'react';
import { PatientRecord, CaseRecord, VisitRecord } from '../domain/types';
import { translations, Language } from '../i18n/translations';
import { calculateDetailedAge } from '../domain/patientAge';
import {
  Users,
  Search,
  FolderOpen,
  Calendar,
  Phone,
  Briefcase,
  PlusCircle,
  FileText,
} from 'lucide-react';

interface PatientDirectoryProps {
  serverMode?: boolean;
  clinicalDisabled?: boolean;
  searchPending?: boolean;
  searchHasMore?: boolean;
  onSearchPatients?: (query: string) => Promise<void>;
  patients: ClinicPatient[];
  cases: CaseRecord[];
  visits: VisitRecord[];
  language: Language;
  onInspectDossier: (patientId: string) => void;
  onStartVisit: (patientId: string) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  serverMode = false,
  clinicalDisabled = false,
  searchPending = false,
  searchHasMore = false,
  onSearchPatients,
  patients,
  cases,
  visits,
  language,
  onInspectDossier,
  onStartVisit,
}) => {
  const t = translations[language];
  const [query, setQuery] = useState('');

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (onSearchPatients || !q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.clinicPatientNumber.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.profession.toLowerCase().includes(q)
    );
  }, [patients, query, onSearchPatients]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 theme-surface border theme-border rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold theme-text-primary font-sans">
              {t.tabPatientDirectory}
            </h2>
            <span className="font-mono text-xs theme-text-technical theme-surface-nested px-2 py-0.5 rounded border theme-border/40">
              {patients.length} {serverMode ? (language === 'ar' ? 'نتيجة بحث' : 'Search results') : 'Registered Patients'}
            </span>
          </div>
          <p className="text-xs theme-text-muted mt-1 max-w-xl">
            {serverMode ? (language === 'ar' ? 'ابحث بالاسم أو CPN؛ هذه نتائج البحث وليست قائمة كاملة بكل المرضى.' : 'Search by name or CPN; these are search results, not the complete registry.') : language === 'ar'
              ? 'السجل الشامل والدائم لجميع مرضى العيادة مع إمكانية الوصول الفوري للملف السريري التراكمي.'
              : 'Persistent registry of all clinic patients with direct access to longitudinal dossiers.'}
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={event => { event.preventDefault(); void onSearchPatients?.(query); }} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 theme-text-muted absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            disabled={searchPending}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={serverMode ? (language === 'ar' ? 'اسم المريض أو CPN' : 'Patient name or CPN') : t.searchPatientPlaceholder}
            className="w-full theme-input border theme-border rounded-lg py-2 px-9 text-xs theme-text-primary placeholder:text-[color:var(--theme-text-muted)] focus:outline-hidden focus:border-[color:var(--theme-border-focus)]"
          />
          {onSearchPatients && <button type="submit" disabled={searchPending} className="mt-2 theme-action-primary rounded-lg px-4 py-2 text-xs">{language === 'ar' ? 'بحث' : 'Search'}</button>}
        </form>
      </div>

      {searchHasMore && <p role="status" className="text-xs theme-text-muted">{language === 'ar' ? 'أول 25 نتيجة؛ حدّد الاسم أكثر.' : 'First 25 matches; refine the name.'}</p>}
      {/* Patients Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full theme-surface border theme-border rounded-xl p-8 text-center text-xs theme-text-muted">
            {t.noPatientFound}
          </div>
        ) : (
          filteredPatients.map((p) => {
            const detailedAge = p.dateOfBirth ? calculateDetailedAge(p.dateOfBirth) : null;
            const patientCases = cases.filter((c) => c.patientId === p.patientId);
            const patientVisits = visits.filter((v) => v.patientId === p.patientId);

            return (
              <div
                key={p.patientId}
                className="theme-surface border theme-border rounded-xl p-5 hover:theme-border transition-colors shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded theme-surface-nested theme-text-technical border theme-border/60">
                      {p.clinicPatientNumber}
                    </span>
                    <span className="text-[11px] theme-text-muted font-mono">
                      {p.gender === 'Male' ? t.genderMale : t.genderFemale}
                    </span>
                  </div>

                  <h3 className="text-base font-bold theme-text-primary font-sans mt-2">
                    {p.name}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs theme-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 theme-text-muted" />
                      <span>{t.derivedAge}:</span>
                      <strong className="theme-text-secondary font-mono">
                        {detailedAge?.years ?? (language === 'ar' ? 'غير مسجل' : 'Not recorded')} {t.derivedAgeYears} ({p.dateOfBirth})
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 theme-text-muted" />
                      <span className="font-mono">{p.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 theme-text-muted" />
                      <span>{p.profession}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t theme-border/80 flex items-center justify-between text-[11px] font-mono theme-text-muted">
                    <span>{clinicalDisabled ? (language === 'ar' ? 'الحالات غير متاحة' : 'Cases unavailable') : `${patientCases.length} Clinical Cases`}</span>
                    <span>{clinicalDisabled ? (language === 'ar' ? 'الزيارات غير متاحة' : 'Visits unavailable') : `${patientVisits.length} Visits`}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t theme-border">
                  <button
                    type="button"
                    disabled={searchPending}
                    onClick={() => onInspectDossier(p.patientId)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 theme-action-secondary hover:bg-slate-700 theme-text-secondary rounded-lg text-xs font-medium transition-colors border theme-border"
                  >
                    <FolderOpen className="w-3.5 h-3.5 theme-text-technical" />
                    <span>{t.inspectDossier}</span>
                  </button>

                  <button
                    type="button"
                    disabled={clinicalDisabled || searchPending}
                    onClick={() => onStartVisit(p.patientId)}
                    className="flex items-center justify-center gap-1 px-3 py-2 theme-action-primary/20 hover:theme-action-primary theme-text-technical hover:theme-text-primary rounded-lg text-xs font-medium transition-colors border border-[color:var(--theme-border-focus)]/30"
                    title={t.startVisitForPatient}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Visit</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
