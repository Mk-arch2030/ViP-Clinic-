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
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  serverMode?: boolean;
  serverRole?: ActorRole | null;
  serverChecking?: boolean;
  currentDay: ClinicDayRecord;
  actorRole: ActorRole;
  operatingMode: OperatingMode;
  onSetActorRole: (role: ActorRole) => void;
  onSetOperatingMode: (mode: OperatingMode) => void;
  onCloseClinicDay: () => void;
  onOpenClinicDay: () => void;
  language: Language;
  onToggleLanguage: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  dailyVisitsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  serverMode = false,
  serverRole = null,
  serverChecking = false,
  currentDay,
  actorRole,
  operatingMode,
  onSetActorRole,
  onSetOperatingMode,
  onCloseClinicDay,
  onOpenClinicDay,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  dailyVisitsCount,
}) => {
  const t = translations[language];

  return (
    <header className="border-b theme-border theme-surface backdrop-blur-md sticky top-0 z-40">
      {/* Top Identity & Controls Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Clinic Authority */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[color:var(--theme-action-primary)]/10 border border-[color:var(--theme-action-primary)]/30 flex items-center justify-center text-[color:var(--theme-authority)] shadow-inner">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight theme-text-primary font-sans">
                  {t.appTitle}
                </h1>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[color:var(--theme-action-primary)]/10 text-[color:var(--theme-text-technical)] border border-[color:var(--theme-action-primary)]/30">
                  EMR & Practice
                </span>
              </div>
              <p className="text-xs theme-text-secondary">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Actor Switcher, Mode, Language, Clinic Day */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            {serverMode ? (
              <div className="flex items-center gap-2 p-2 theme-surface-nested rounded-lg border theme-border">
                <Shield className="w-4 h-4 theme-text-technical" />
                <span>{serverChecking ? (language === 'ar' ? 'جار التحقق من هوية الخادم…' : 'Checking server identity…') : serverRole ? (language === 'ar' ? 'هوية الخادم: ' : 'Server identity: ') + serverRole : (language === 'ar' ? 'تسجيل الدخول مطلوب' : 'Sign in required')}</span>
              </div>
            ) : <>
            {/* Actor Switcher Segmented Control */}
            <div className="flex items-center p-1 theme-surface-nested rounded-lg border theme-border">
              <button
                type="button"
                onClick={() => onSetActorRole('Doctor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  actorRole === 'Doctor'
                    ? 'theme-action-primary shadow-xs'
                    : 'theme-text-muted hover:text-[color:var(--theme-text-primary)]'
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
                      ? 'bg-[color:var(--theme-status-info)] text-white shadow-xs'
                      : 'theme-text-muted hover:text-[color:var(--theme-text-primary)]'
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
              <div className="flex items-center p-1 theme-surface-nested rounded-lg border theme-border">
                <button
                  type="button"
                  onClick={() =>
                    onSetOperatingMode(
                      operatingMode === 'DOCTOR_ONLY'
                        ? 'DOCTOR_NURSE'
                        : 'DOCTOR_ONLY'
                    )
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1.5 theme-text-secondary hover:text-[color:var(--theme-text-primary)] transition-colors"
                  title="Toggle Doctor Only / Doctor + Nurse operational modes"
                >
                  <Users className="w-3.5 h-3.5 theme-text-muted" />
                  <span>
                    {operatingMode === 'DOCTOR_ONLY'
                      ? t.doctorOnlyMode
                      : t.doctorNurseMode}
                  </span>
                </button>
              </div>
            )}

            </>}

            {/* Theme Switch — Presentation Preference */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 theme-surface-nested hover:bg-[color:var(--theme-border)] theme-text-secondary border theme-border rounded-lg font-medium transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-[color:var(--theme-status-warning)]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[color:var(--theme-status-info)]" />
              )}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Language Switch */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 theme-surface-nested hover:bg-[color:var(--theme-border)] theme-text-secondary border theme-border rounded-lg font-medium transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-[color:var(--theme-authority)]" />
              <span>{t.switchLanguage}</span>
            </button>
          </div>
        </div>

        {/* Clinic Day Context Bar — demonstration context only */}
      {!serverMode && (
        <div className="mt-3 pt-3 border-t theme-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 theme-text-secondary">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[color:var(--theme-authority)]" />
              <span className="font-semibold text-white">{currentDay.id}</span>
              <span className="theme-text-muted">({currentDay.workingDate})</span>
            </div>

            <span className="theme-text-muted">|</span>

            <div className="flex items-center gap-1.5">
              {currentDay.status === 'OPEN' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[color:var(--theme-status-success)] animate-pulse" />
                  <span className="theme-status-success font-medium">
                    {t.openDayStatus}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[color:var(--theme-status-warning)]" />
                  <span className="theme-status-warning font-medium">
                    {t.closedDayStatus}
                  </span>
                </>
              )}
            </div>

            <span className="theme-text-muted">|</span>

            <div className="flex items-center gap-1 theme-text-muted">
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
                    ? 'theme-surface-nested hover:bg-[color:var(--theme-status-danger)]/10 hover:text-[color:var(--theme-status-danger)] hover:border-[color:var(--theme-status-danger)]/50 theme-text-secondary border theme-border'
                    : 'opacity-50 cursor-not-allowed theme-surface theme-text-muted border theme-border'
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
                className="flex items-center gap-1.5 px-3 py-1.5 theme-action-primary hover:brightness-110 text-white rounded-lg font-medium transition-colors border border-[color:var(--theme-action-primary)]"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{t.openClinicDay}</span>
              </button>
            )}
          </div>
        </div>
      )}
      </div>
    </header>
  );
};
