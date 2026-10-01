import React from 'react';
import { ClinicDayRecord, ActorRole, OperatingMode } from '../domain/types';
import { translations, Language } from '../i18n/translations';
import {
  Stethoscope,
  UserCheck,
  Calendar,
  Lock,
  Unlock,
  Languages,
  Users,
  Shield,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  currentDay: ClinicDayRecord;
  actorRole: ActorRole;
  operatingMode: OperatingMode;
  onSetActorRole: (role: ActorRole) => void;
  onSetOperatingMode: (mode: OperatingMode) => void;
  onCloseClinicDay: () => void;
  onOpenClinicDay: () => void;
  language: Language;
  onToggleLanguage: () => void;
  dailyVisitsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  actorRole,
  operatingMode,
  onSetActorRole,
  onSetOperatingMode,
  onCloseClinicDay,
  onOpenClinicDay,
  language,
  onToggleLanguage,
  dailyVisitsCount,
}) => {
  const t = translations[language];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Identity & Controls Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Clinic Authority */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white font-sans">
                  {t.appTitle}
                </h1>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                  EMR & Practice
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Actor Switcher, Mode, Language, Clinic Day */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            {/* Actor Switcher Segmented Control */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => onSetActorRole('Doctor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  actorRole === 'Doctor'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={t.doctorAuthorityBadge}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t.doctorRole}</span>
              </button>

              {operatingMode === 'DOCTOR_NURSE' && (
                <button
                  type="button"
                  onClick={() => onSetActorRole('Nurse')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                    actorRole === 'Nurse'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={t.nurseDelegatedBadge}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t.nurseRole}</span>
                </button>
              )}
            </div>

            {/* Operating Mode Toggle (Only Doctor can change operating mode) */}
            {actorRole === 'Doctor' && (
              <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    onSetOperatingMode(
                      operatingMode === 'DOCTOR_ONLY'
                        ? 'DOCTOR_NURSE'
                        : 'DOCTOR_ONLY'
                    )
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-300 hover:text-white transition-colors"
                  title="Toggle Doctor Only / Doctor + Nurse operational modes"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {operatingMode === 'DOCTOR_ONLY'
                      ? t.doctorOnlyMode
                      : t.doctorNurseMode}
                  </span>
                </button>
              </div>
            )}

            {/* Language Switch */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg font-medium transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.switchLanguage}</span>
            </button>
          </div>
        </div>

        {/* Clinic Day Context Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-white">{currentDay.id}</span>
              <span className="text-slate-500">({currentDay.workingDate})</span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-1.5">
              {currentDay.status === 'OPEN' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-medium">
                    {t.openDayStatus}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 font-medium">
                    {t.closedDayStatus}
                  </span>
                </>
              )}
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {t.recordedVisits}: <strong className="text-white font-mono">{dailyVisitsCount}</strong>
              </span>
            </div>
          </div>

          {/* Clinic Day Action (Doctor Authority) */}
          <div>
            {currentDay.status === 'OPEN' ? (
              <button
                type="button"
                onClick={onCloseClinicDay}
                disabled={actorRole !== 'Doctor'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  actorRole === 'Doctor'
                    ? 'bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-700/50 text-slate-300 border border-slate-700'
                    : 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-500 border border-slate-800'
                }`}
                title={actorRole === 'Doctor' ? t.closeClinicDay : t.cannotCloseDayNurse}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.closeClinicDay}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenClinicDay}
                disabled={actorRole !== 'Doctor'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors border border-teal-600"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{t.openClinicDay}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
