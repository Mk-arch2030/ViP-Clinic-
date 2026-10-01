import React, { useState, useMemo } from 'react';
import { PatientRecord, CaseRecord, ArrivalCondition, ActorRole } from '../domain/types';
import { translations, Language } from '../i18n/translations';
import { calculateDetailedAge, DetailedAge } from '../domain/patientAge';
import {
  UserPlus,
  Search,
  CheckCircle,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
  User,
  Phone,
  Briefcase,
  Calendar,
  HeartPulse,
} from 'lucide-react';

interface PatientIntakeProps {
  patients: PatientRecord[];
  cases: CaseRecord[];
  actorRole: ActorRole;
  language: Language;
  onRegisterPatient: (params: {
    name: string;
    dateOfBirth: string;
    profession: string;
    phone: string;
    gender: 'Male' | 'Female';
    pastHistory?: {
      chronicIllnesses?: string[];
      knownAllergies?: string[];
      surgicalHistory?: string[];
      familyHistory?: string[];
      lifestyleNotes?: string;
    };
  }) => PatientRecord;
  onRecordArrival: (params: {
    patientId: string;
    caseId?: string;
    newCaseTitle?: string;
    currentComplaint: string;
    arrivalCondition: ArrivalCondition;
  }) => void;
  onSelectPatientDossier: (patientId: string) => void;
}

export const PatientIntake: React.FC<PatientIntakeProps> = ({
  patients,
  cases,
  actorRole,
  language,
  onRegisterPatient,
  onRecordArrival,
  onSelectPatientDossier,
}) => {
  const t = translations[language];

  const [mode, setMode] = useState<'NEW' | 'LOOKUP'>('NEW');

  // New Patient Form state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profession, setProfession] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [chronic, setChronic] = useState('');
  const [allergies, setAllergies] = useState('');
  const [surgeries, setSurgeries] = useState('');
  const [family, setFamily] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [intakeSuccessPatient, setIntakeSuccessPatient] = useState<PatientRecord | null>(null);

  // Existing Patient Lookup state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('NEW');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [currentComplaint, setCurrentComplaint] = useState('');
  const [arrivalCondition, setArrivalCondition] = useState<ArrivalCondition>('Normal');
  const [arrivalSuccess, setArrivalSuccess] = useState<boolean>(false);

  // Derived age calculation in real-time
  const derivedAgeInfo: DetailedAge | null = useMemo(() => {
    if (!dateOfBirth) return null;
    try {
      return calculateDetailedAge(dateOfBirth);
    } catch {
      return null;
    }
  }, [dateOfBirth]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.clinicPatientNumber.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [patients, searchQuery]);

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.patientId === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  const patientCases = useMemo(() => {
    if (!selectedPatientId) return [];
    return cases.filter((c) => c.patientId === selectedPatientId);
  }, [cases, selectedPatientId]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dateOfBirth || !phone.trim()) {
      alert('Please fill in Name, Date of Birth, and Phone.');
      return;
    }

    const chronicList = chronic
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const allergyList = allergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const surgeryList = surgeries
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const familyList = family
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created = onRegisterPatient({
      name,
      dateOfBirth,
      profession,
      phone,
      gender,
      pastHistory: {
        chronicIllnesses: chronicList,
        knownAllergies: allergyList,
        surgicalHistory: surgeryList,
        familyHistory: familyList,
        lifestyleNotes: lifestyle,
      },
    });

    setIntakeSuccessPatient(created);
    setSelectedPatientId(created.patientId);
  };

  const handleArrivalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    onRecordArrival({
      patientId: selectedPatientId,
      caseId: selectedCaseId === 'NEW' ? undefined : selectedCaseId,
      newCaseTitle: selectedCaseId === 'NEW' ? newCaseTitle : undefined,
      currentComplaint,
      arrivalCondition,
    });

    setArrivalSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode Selector Segmented Tabs */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setMode('NEW');
            setIntakeSuccessPatient(null);
            setArrivalSuccess(false);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'NEW'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.intakeModeNew}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('LOOKUP');
            setIntakeSuccessPatient(null);
            setArrivalSuccess(false);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'LOOKUP'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{t.intakeModeLookup}</span>
        </button>
      </div>

      {/* MODE 1: NEW PATIENT REGISTRATION */}
      {mode === 'NEW' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs">
          {intakeSuccessPatient ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-sans">
                  {language === 'ar' ? 'تم إنشاء ملف المريض بنجاح' : 'Patient Registered Successfully'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.cpnHelp}
                </p>
                <div className="inline-block mt-3 px-4 py-2 bg-teal-950 border border-teal-700 rounded-lg">
                  <span className="text-xs text-teal-400 block">{t.cpnLabel}</span>
                  <span className="font-mono text-xl font-bold text-white tracking-wider">
                    {intakeSuccessPatient.clinicPatientNumber}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-left rtl:text-right max-w-md mx-auto text-xs space-y-1">
                <div>
                  <span className="text-slate-500">{t.patientName}: </span>
                  <strong className="text-slate-200">{intakeSuccessPatient.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">{t.dateOfBirth}: </span>
                  <span className="text-slate-300 font-mono">{intakeSuccessPatient.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-slate-500">{t.phone}: </span>
                  <span className="text-slate-300 font-mono">{intakeSuccessPatient.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOOKUP');
                    setSelectedPatientId(intakeSuccessPatient.patientId);
                    setIntakeSuccessPatient(null);
                  }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>{t.startVisitForPatient}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectPatientDossier(intakeSuccessPatient.patientId)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                >
                  {t.inspectDossier}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white font-sans">
                  {t.intakeModeNew}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'ar'
                    ? 'يتم إصدار رقم ملف المريض CPN تسلسلياً ودائماً، والعمر يتم حسابه تلقائياً من تاريخ الميلاد وفق المبدأ السريري المعتمد.'
                    : 'CPN is allocated sequentially and persistently; age is strictly derived from date of birth.'}
                </p>
              </div>

              {/* Personal Demographic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.patientName} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم الثلاثي أو الرباعي' : 'Full Name'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-9 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.phone} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+20 100 000 0000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-9 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.dateOfBirth} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-9 text-xs text-slate-100 font-mono focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  {/* Derived Age Feedback Preview */}
                  {derivedAgeInfo && (
                    <div className="mt-1.5 p-2 bg-teal-950/40 border border-teal-800/40 rounded text-xs text-teal-300 font-mono flex items-center justify-between">
                      <span>{t.derivedAge}:</span>
                      <strong className="text-teal-200">
                        {derivedAgeInfo.years} {t.derivedAgeYears}, {derivedAgeInfo.months} {t.derivedAgeMonths}, {derivedAgeInfo.days} {t.derivedAgeDays}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.gender}
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                    >
                      <option value="Male">{t.genderMale}</option>
                      <option value="Female">{t.genderFemale}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.profession}
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="Engineer, Teacher..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-9 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Past History Section (Patient-level background) */}
              <div className="border-t border-slate-800 pt-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    {t.pastHistorySection}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t.pastHistoryHelp}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.chronicIllnesses}
                    </label>
                    <input
                      type="text"
                      value={chronic}
                      onChange={(e) => setChronic(e.target.value)}
                      placeholder="e.g. Hypertension, Diabetes Type 2"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.knownAllergies}
                    </label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, Sulfa, NSAIDs"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.surgicalHistory}
                    </label>
                    <input
                      type="text"
                      value={surgeries}
                      onChange={(e) => setSurgeries(e.target.value)}
                      placeholder="e.g. Cholecystectomy (2018)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.familyHistory}
                    </label>
                    <input
                      type="text"
                      value={family}
                      onChange={(e) => setFamily(e.target.value)}
                      placeholder="e.g. Family history of coronary artery disease"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.lifestyleNotes}
                  </label>
                  <input
                    type="text"
                    value={lifestyle}
                    onChange={(e) => setLifestyle(e.target.value)}
                    placeholder="e.g. Smoker 10 pack-years, sedentary office lifestyle"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.registerPatientBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* MODE 2: EXISTING PATIENT LOOKUP & VISIT ARRIVAL */}
      {mode === 'LOOKUP' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
            <label className="block text-xs font-medium text-slate-300 mb-2">
              {language === 'ar' ? 'البحث عن ملف المريض' : 'Search Patient Registry'}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPatientPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-9 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            {/* Quick Result Suggestions */}
            {searchQuery.trim() && (
              <div className="mt-3 divide-y divide-slate-800 bg-slate-950 rounded-lg border border-slate-800 max-h-56 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500 text-center">
                    {t.noPatientFound}
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.patientId}
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(p.patientId);
                        setSearchQuery('');
                        setArrivalSuccess(false);
                      }}
                      className="w-full p-3 text-left rtl:text-right hover:bg-slate-900 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-xs text-white block">{p.name}</strong>
                        <span className="text-[11px] text-slate-400">
                          {p.phone} · {p.profession}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/50">
                        {p.clinicPatientNumber}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Patient Arrival Context Card */}
          {selectedPatient && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
              {arrivalSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-sans">
                    {language === 'ar' ? 'تم تسجيل وصول المريض بنجاح' : 'Patient Arrival Recorded'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {language === 'ar'
                      ? 'تمت إضافة الزيارة إلى قائمة اليوم بانتظار الطبيب المعالج.'
                      : 'Visit added to today’s census awaiting physician encounter.'}
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectPatientDossier(selectedPatient.patientId)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700"
                    >
                      {t.inspectDossier}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(null);
                        setArrivalSuccess(false);
                      }}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold"
                    >
                      {language === 'ar' ? 'تسجيل وصول آخر' : 'Record Another Arrival'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleArrivalSubmit} className="space-y-6">
                  {/* Patient Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block">{t.patientName}</span>
                      <strong className="text-white text-sm font-semibold">{selectedPatient.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t.cpnLabel}</span>
                      <strong className="text-teal-300 font-mono">{selectedPatient.clinicPatientNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t.dateOfBirth}</span>
                      <strong className="text-slate-300 font-mono">{selectedPatient.dateOfBirth}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectPatientDossier(selectedPatient.patientId)}
                      className="text-xs text-teal-400 hover:underline font-medium"
                    >
                      {t.inspectDossier} →
                    </button>
                  </div>

                  {/* Case Selection or Creation */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-teal-400">
                      {t.selectOrCreateCase}
                    </label>

                    <div className="space-y-2">
                      {/* Option to create a new case */}
                      <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="caseOption"
                          value="NEW"
                          checked={selectedCaseId === 'NEW'}
                          onChange={() => setSelectedCaseId('NEW')}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <div className="flex-1">
                          <strong className="text-xs text-white block">
                            {t.createNewCaseBtn}
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            {language === 'ar' ? 'لحالة مرضية أو مشكلة جديدة' : 'For a newly presenting problem or condition'}
                          </span>
                        </div>
                      </label>

                      {/* Existing active cases */}
                      {patientCases.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="caseOption"
                            value={c.id}
                            checked={selectedCaseId === c.id}
                            onChange={() => setSelectedCaseId(c.id)}
                            className="text-teal-600 focus:ring-teal-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-teal-400">{c.id}</span>
                              <strong className="text-xs text-white">{c.title}</strong>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {t.caseStatusLabel}: {c.state} · {language === 'ar' ? 'تاريخ البدء' : 'Opened'}: {c.openedDate}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* New Case Title input if selected NEW */}
                    {selectedCaseId === 'NEW' && (
                      <div className="pt-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          {t.newCaseTitle} <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newCaseTitle}
                          onChange={(e) => setNewCaseTitle(e.target.value)}
                          placeholder="e.g. Acute Lower Back Pain / Routine Health Check"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Visit Arrival Details */}
                  <div className="border-t border-slate-800 pt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {t.arrivalComplaint} <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={currentComplaint}
                        onChange={(e) => setCurrentComplaint(e.target.value)}
                        placeholder="e.g. Fever and productive cough for 3 days, worsening at night..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {t.arrivalConditionPrompt}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Normal', 'Moderately Unwell', 'Severely Unwell'] as ArrivalCondition[]).map(
                          (cond) => (
                            <button
                              key={cond}
                              type="button"
                              onClick={() => setArrivalCondition(cond)}
                              className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                                arrivalCondition === cond
                                  ? cond === 'Severely Unwell'
                                    ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                                    : cond === 'Moderately Unwell'
                                    ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                                    : 'bg-teal-950/60 border-teal-500 text-teal-200'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {cond === 'Normal'
                                ? t.conditionNormal
                                : cond === 'Moderately Unwell'
                                ? t.conditionModerate
                                : t.conditionSevere}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{t.recordArrivalBtn}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
