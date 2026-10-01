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
  patients: PatientRecord[];
  cases: CaseRecord[];
  visits: VisitRecord[];
  language: Language;
  onInspectDossier: (patientId: string) => void;
  onStartVisit: (patientId: string) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
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
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.clinicPatientNumber.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.profession.toLowerCase().includes(q)
    );
  }, [patients, query]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white font-sans">
              {t.tabPatientDirectory}
            </h2>
            <span className="font-mono text-xs text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/40">
              {patients.length} Registered Patients
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {language === 'ar'
              ? 'السجل الشامل والدائم لجميع مرضى العيادة مع إمكانية الوصول الفوري للملف السريري التراكمي.'
              : 'Persistent registry of all clinic patients with direct access to longitudinal dossiers.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPatientPlaceholder}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-9 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500"
          />
        </div>
      </div>

      {/* Patients Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
            {t.noPatientFound}
          </div>
        ) : (
          filteredPatients.map((p) => {
            const detailedAge = calculateDetailedAge(p.dateOfBirth);
            const patientCases = cases.filter((c) => c.patientId === p.patientId);
            const patientVisits = visits.filter((v) => v.patientId === p.patientId);

            return (
              <div
                key={p.patientId}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                      {p.clinicPatientNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {p.gender === 'Male' ? t.genderMale : t.genderFemale}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans mt-2">
                    {p.name}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.derivedAge}:</span>
                      <strong className="text-slate-200 font-mono">
                        {detailedAge.years} {t.derivedAgeYears} ({p.dateOfBirth})
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono">{p.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{p.profession}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{patientCases.length} Clinical Cases</span>
                    <span>{patientVisits.length} Visits</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => onInspectDossier(p.patientId)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.inspectDossier}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartVisit(p.patientId)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded-lg text-xs font-medium transition-colors border border-teal-500/30"
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
