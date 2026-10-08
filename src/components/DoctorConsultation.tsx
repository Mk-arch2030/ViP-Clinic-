import React, { useState } from 'react';
import {
  VisitRecord,
  PatientRecord,
  CaseRecord,
  ActorRole,
  MedicationRegimenItem,
  InvestigationItem,
  InvestigationCategory,
} from '../domain/types';
import { translations, Language } from '../i18n/translations';
import { calculateDetailedAge } from '../domain/patientAge';
import {
  Stethoscope,
  Activity,
  ClipboardList,
  FlaskConical,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  LogOut,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface DoctorConsultationProps {
  visit: VisitRecord;
  patient: PatientRecord;
  caseRecord: CaseRecord;
  actorRole: ActorRole;
  language: Language;
  onUpdateEncounter: (updates: Partial<VisitRecord>) => boolean;
  onAuthorizePrescription: () => void;
  onRecordExit: () => void;
  onCompleteCase: () => void;
  onOpenPrintModal: () => void;
  onGoToDossier: () => void;
}

const COMMON_DRUGS = [
  { name: 'Paracetamol', strength: '500mg', form: 'Tablet', dose: '1-2 tablets', frequency: 'TID as needed (PRN)', route: 'Oral', duration: '3 days', quantity: '20 tablets', instructions: 'Take after meals' },
  { name: 'Amoxicillin / Clavulanate', strength: '1g (875/125mg)', form: 'Tablet', dose: '1 tablet', frequency: 'Every 12 hours (BID)', route: 'Oral', duration: '7 days', quantity: '14 tablets', instructions: 'Complete full course with food' },
  { name: 'Omeprazole', strength: '20mg', form: 'Capsule', dose: '1 capsule', frequency: 'Once daily before breakfast', route: 'Oral', duration: '14 days', quantity: '14 capsules', instructions: 'Take 30 mins before first meal' },
  { name: 'Metformin HCl', strength: '850mg', form: 'Tablet', dose: '1 tablet', frequency: 'Twice daily with meals', route: 'Oral', duration: '30 days', quantity: '60 tablets', instructions: 'Take with main meals' },
  { name: 'Salbutamol Inhaler', strength: '100mcg/puff', form: 'Inhaler', dose: '2 puffs', frequency: 'Every 4-6 hours PRN', route: 'Inhalation', duration: '14 days', quantity: '1 canister', instructions: 'Rinse mouth after inhalation' },
  { name: 'Levothyroxine Sodium', strength: '50mcg', form: 'Tablet', dose: '1 tablet', frequency: 'Once daily on empty stomach', route: 'Oral', duration: '30 days', quantity: '30 tablets', instructions: 'Take with water 1 hour before breakfast' },
  { name: 'Ibuprofen', strength: '400mg', form: 'Tablet', dose: '1 tablet', frequency: 'Every 8 hours with meals', route: 'Oral', duration: '5 days', quantity: '15 tablets', instructions: 'Avoid on empty stomach; discontinue if gastric pain' },
  { name: 'Ceftriaxone', strength: '1g', form: 'Vial (Injection)', dose: '1g', frequency: 'Once daily', route: 'Intramuscular', duration: '3 days', quantity: '3 vials', instructions: 'Skin sensitivity test before administration' },
];

const CATALOG_LABS = [
  'Complete Blood Count (CBC) with Differential',
  'Fasting Blood Glucose (FBG) & HbA1c',
  'Renal Function Panel (Serum Creatinine & Blood Urea)',
  'Liver Function Tests (ALT, AST, Bilirubin, Albumin)',
  'Fasting Lipid Profile (Total Cholesterol, Triglycerides, HDL, LDL)',
  'Serum Electrolytes (Sodium, Potassium, Chloride)',
  'Routine Urine Analysis (Microscopic & Chemical)',
  'C-Reactive Protein (CRP) & ESR',
  'Thyroid Stimulating Hormone (TSH)',
  'Serum Uric Acid',
];

const CATALOG_RADIOLOGY = [
  'Chest X-Ray PA View (Digital)',
  'Plain Abdominal X-Ray (Erect & Supine)',
  'Abdominal & Pelvic Ultrasound (Sonography)',
  'Musculoskeletal / Skeletal Plain X-Ray',
  'CT Scan (Non-Contrast)',
  'CT Scan (With IV Contrast)',
  'MRI (Magnetic Resonance Imaging)',
  'Venous / Arterial Doppler Ultrasound',
];

export const DoctorConsultation: React.FC<DoctorConsultationProps> = ({
  visit,
  patient,
  caseRecord,
  actorRole,
  language,
  onUpdateEncounter,
  onAuthorizePrescription,
  onRecordExit,
  onCompleteCase,
  onOpenPrintModal,
  onGoToDossier,
}) => {
  const t = translations[language];
  const detailedAge = calculateDetailedAge(patient.dateOfBirth);

  const isDoctor = actorRole === 'Doctor';

  // Local state for clinical inputs
  const [complaint, setComplaint] = useState(visit.currentComplaint);
  const [bpSys, setBpSys] = useState(visit.vitals?.bloodPressureSystolic?.toString() || '');
  const [bpDia, setBpDia] = useState(visit.vitals?.bloodPressureDiastolic?.toString() || '');
  const [heartRate, setHeartRate] = useState(visit.vitals?.heartRate?.toString() || '');
  const [respRate, setRespRate] = useState(visit.vitals?.respiratoryRate?.toString() || '');
  const [temp, setTemp] = useState(visit.vitals?.temperatureCelsius?.toString() || '');
  const [spo2, setSpo2] = useState(visit.vitals?.oxygenSaturation?.toString() || '');
  const [examNotes, setExamNotes] = useState(visit.examinationNotes || '');
  const [prelimDx, setPrelimDx] = useState(visit.preliminaryDiagnosis);
  const [finalDx, setFinalDx] = useState(visit.finalDiagnosis);
  const [treatment, setTreatment] = useState(visit.treatmentAdvice);

  // Investigations state
  const [investigations, setInvestigations] = useState<InvestigationItem[]>(
    visit.investigations || []
  );
  const [newInvCategory, setNewInvCategory] = useState<InvestigationCategory>('Laboratory');
  const [newInvName, setNewInvName] = useState(CATALOG_LABS[0]);
  const [newInvNotes, setNewInvNotes] = useState('');

  // Prescription / Rx state
  const [meds, setMeds] = useState<MedicationRegimenItem[]>(
    visit.prescription?.items || []
  );
  const [counseling, setCounseling] = useState(
    visit.prescription?.clinicalCounseling || ''
  );
  const [patientInstructions, setPatientInstructions] = useState(
    visit.prescription?.patientInstructions || ''
  );

  // New med draft
  const [newMedName, setNewMedName] = useState('');
  const [newMedStrength, setNewMedStrength] = useState('');
  const [newMedForm, setNewMedForm] = useState('Tablet');
  const [newMedDose, setNewMedDose] = useState('1 tablet');
  const [newMedFreq, setNewMedFreq] = useState('Once daily');
  const [newMedRoute, setNewMedRoute] = useState('Oral');
  const [newMedDuration, setNewMedDuration] = useState('7 days');
  const [newMedQty, setNewMedQty] = useState('');
  const [newMedInst, setNewMedInst] = useState('');
  const [newMedPrn, setNewMedPrn] = useState(false);

  // Follow-up state
  const [followUpRequired, setFollowUpRequired] = useState(
    visit.followUp?.required || false
  );
  const [followUpDays, setFollowUpDays] = useState(
    visit.followUp?.intervalDays?.toString() || '7'
  );
  const [followUpInst, setFollowUpInst] = useState(
    visit.followUp?.clinicalInstructions || ''
  );

  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleAddInvestigation = () => {
    if (!newInvName.trim()) return;
    const item: InvestigationItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      category: newInvCategory,
      name: newInvName.trim(),
      notes: newInvNotes.trim() || undefined,
    };
    const updated = [...investigations, item];
    setInvestigations(updated);
    setNewInvNotes('');
    onUpdateEncounter({ investigations: updated });
  };

  const handleRemoveInvestigation = (id: string) => {
    const updated = investigations.filter((i) => i.id !== id);
    setInvestigations(updated);
    onUpdateEncounter({ investigations: updated });
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    const newMed: MedicationRegimenItem = {
      id: `RX-M-${Date.now().toString().slice(-4)}`,
      name: newMedName.trim(),
      strength: newMedStrength.trim(),
      form: newMedForm,
      dose: newMedDose.trim(),
      frequency: newMedFreq.trim(),
      route: newMedRoute.trim(),
      duration: newMedDuration.trim(),
      quantity: newMedQty.trim() || undefined,
      instructions: newMedInst.trim(),
      prn: newMedPrn,
    };
    const updated = [...meds, newMed];
    setMeds(updated);
    // Reset form
    setNewMedName('');
    setNewMedStrength('');
    setNewMedInst('');
    setNewMedQty('');
    setNewMedPrn(false);

    onUpdateEncounter({
      prescription: {
        ...visit.prescription,
        items: updated,
        isAuthorized: false, // Reset authorization when prescription modified
        authorizedAt: null,
        authorizedBy: null,
      },
    });
  };

  const handlePickQuickMed = (drug: typeof COMMON_DRUGS[0]) => {
    const newMed: MedicationRegimenItem = {
      id: `RX-M-${Date.now().toString().slice(-4)}`,
      name: drug.name,
      strength: drug.strength,
      form: drug.form,
      dose: drug.dose,
      frequency: drug.frequency,
      route: drug.route,
      duration: drug.duration,
      quantity: drug.quantity,
      instructions: drug.instructions,
      prn: drug.frequency.includes('PRN'),
    };
    const updated = [...meds, newMed];
    setMeds(updated);

    onUpdateEncounter({
      prescription: {
        ...visit.prescription,
        items: updated,
        isAuthorized: false,
        authorizedAt: null,
        authorizedBy: null,
      },
    });
  };

  const handleRemoveMedication = (id: string) => {
    const updated = meds.filter((m) => m.id !== id);
    setMeds(updated);
    onUpdateEncounter({
      prescription: {
        ...visit.prescription,
        items: updated,
        isAuthorized: false,
        authorizedAt: null,
        authorizedBy: null,
      },
    });
  };

  const handleSaveProgress = () => {
    const saved = onUpdateEncounter(isDoctor ? {
      currentComplaint: complaint,
      vitals: {
        bloodPressureSystolic: bpSys ? Number(bpSys) : undefined,
        bloodPressureDiastolic: bpDia ? Number(bpDia) : undefined,
        heartRate: heartRate ? Number(heartRate) : undefined,
        respiratoryRate: respRate ? Number(respRate) : undefined,
        temperatureCelsius: temp ? Number(temp) : undefined,
        oxygenSaturation: spo2 ? Number(spo2) : undefined,
      },
      examinationNotes: examNotes,
      investigations,
      preliminaryDiagnosis: prelimDx,
      finalDiagnosis: finalDx,
      treatmentAdvice: treatment,
      prescription: {
        ...visit.prescription,
        items: meds,
        clinicalCounseling: counseling,
        patientInstructions,
      },
      followUp: {
        required: followUpRequired,
        intervalDays: followUpDays ? Number(followUpDays) : undefined,
        clinicalInstructions: followUpInst,
      },
      operationalStatus: 'WITH_DOCTOR',
    } : {
      currentComplaint: complaint,
      vitals: {
        bloodPressureSystolic: bpSys ? Number(bpSys) : undefined,
        bloodPressureDiastolic: bpDia ? Number(bpDia) : undefined,
        heartRate: heartRate ? Number(heartRate) : undefined,
        respiratoryRate: respRate ? Number(respRate) : undefined,
        temperatureCelsius: temp ? Number(temp) : undefined,
        oxygenSaturation: spo2 ? Number(spo2) : undefined,
      },
    });

    if (!saved) return;
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Patient & Case Master Context Banner */}
      <div className="theme-surface border theme-border rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 theme-surface-nested theme-text-technical rounded border border-[color:var(--theme-border)]">
                {patient.clinicPatientNumber}
              </span>
              <span className="theme-text-muted">·</span>
              <h2 className="text-lg font-bold theme-text-primary font-sans">
                {patient.name}
              </h2>
              <span className="text-xs theme-text-muted font-mono">
                ({detailedAge.years} {t.derivedAgeYears}, {patient.gender === 'Male' ? t.genderMale : t.genderFemale})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs theme-text-muted font-mono">
              <span className="theme-text-technical font-semibold">{caseRecord.id}:</span>
              <span className="theme-text-secondary">{caseRecord.title}</span>
              <span className="theme-text-muted">·</span>
              <span className="theme-text-muted">Visit: {visit.id} ({visit.time})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToDossier}
              className="px-3.5 py-1.5 theme-action-secondary hover:bg-[color:var(--theme-border)] theme-text-secondary rounded-lg text-xs font-medium border theme-border transition-colors"
            >
              {t.inspectDossier}
            </button>

            {visit.prescription.isAuthorized && (
              <button
                type="button"
                onClick={onOpenPrintModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 theme-action-primary hover:bg-[color:var(--theme-border-focus)] theme-text-primary rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printCertifiedRxBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Known Allergies Callout */}
        {patient.pastHistory.knownAllergies.length > 0 && (
          <div className="mt-3 px-3 py-1.5 theme-surface-nested border border-[color:var(--theme-status-warning)] rounded-lg text-xs theme-status-warning flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 theme-status-warning shrink-0" />
            <strong>{t.knownAllergies}:</strong>
            <span>{patient.pastHistory.knownAllergies.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Non-doctor alert banner */}
      {!isDoctor && (
        <div className="p-4 bg-indigo-950/30 border border-indigo-800/50 rounded-xl text-xs text-indigo-200 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            {language === 'ar'
              ? 'أنت تعمل بصفة تمريض (تفويض تنفيذي). القرارات السريرية واعتماد الروشتات وإنهاء الحالات محفوظة للطبيب المشرف.'
              : 'Operating under Nurse delegation. Clinical diagnoses, prescription authorization, and case completion are strictly reserved for the Doctor.'}
          </span>
        </div>
      )}

      {/* Grid: Left Column Clinical Examination, Right Column Rx & Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Complaint, Vitals, Physical Exam, Investigations, Diagnoses */}
        <div className="space-y-6">
          {/* Section 1: Current Complaint & Physical Exam */}
          <div className="theme-surface border theme-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 theme-text-technical text-xs font-bold uppercase tracking-wider">
              <ClipboardList className="w-4 h-4" />
              <span>{t.complaintLabel}</span>
            </div>

            <textarea
              rows={3}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              disabled={!isDoctor}
              className="w-full theme-input border theme-border rounded-lg p-3 text-xs theme-text-primary focus:outline-hidden focus:border-[color:var(--theme-border-focus)] disabled:opacity-70"
            />

            {/* Vital Signs Grid */}
            <div className="border-t theme-border pt-4 space-y-2">
              <div className="flex items-center gap-2 theme-text-secondary text-xs font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4 theme-text-technical" />
                <span>{t.vitalsSection}</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] theme-text-muted mb-1">
                    BP (Sys / Dia)
                  </label>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      type="number"
                      placeholder="120"
                      value={bpSys}
                      onChange={(e) => setBpSys(e.target.value)}
                      disabled={!isDoctor}
                      className="w-full theme-input border theme-border rounded p-1.5 text-center text-xs theme-text-primary"
                    />
                    <span className="theme-text-muted">/</span>
                    <input
                      type="number"
                      placeholder="80"
                      value={bpDia}
                      onChange={(e) => setBpDia(e.target.value)}
                      disabled={!isDoctor}
                      className="w-full theme-input border theme-border rounded p-1.5 text-center text-xs theme-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] theme-text-muted mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    placeholder="75"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    disabled={!isDoctor}
                    className="w-full theme-input border theme-border rounded p-1.5 text-center text-xs theme-text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] theme-text-muted mb-1">
                    Resp Rate (c/m)
                  </label>
                  <input
                    type="number"
                    placeholder="16"
                    value={respRate}
                    onChange={(e) => setRespRate(e.target.value)}
                    disabled={!isDoctor}
                    className="w-full theme-input border theme-border rounded p-1.5 text-center text-xs theme-text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] theme-text-muted mb-1">
                    Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    disabled={!isDoctor}
                    className="w-full theme-input border theme-border rounded p-1.5 text-center text-xs theme-text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] theme-text-muted mb-1">
                    SpO2 (%)
                  </label>
                  <input
                    type="number"
                    placeholder="98"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    disabled={!isDoctor}
                    className="w-full theme-input border theme-border rounded p-1.5 text-center text-xs theme-text-primary font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Physical Exam Findings */}
            <div className="border-t theme-border pt-3">
              <label className="block text-[11px] font-medium theme-text-secondary mb-1">
                {t.doctorExaminationNotes}
              </label>
              <textarea
                rows={2}
                value={examNotes}
                onChange={(e) => setExamNotes(e.target.value)}
                disabled={!isDoctor}
                placeholder="Chest clear, heart sounds normal, abdomen soft..."
                className="w-full theme-input border theme-border rounded-lg p-2.5 text-xs theme-text-primary focus:outline-hidden focus:border-[color:var(--theme-border-focus)] disabled:opacity-70"
              />
            </div>
          </div>

          {/* Section 2: Clinical Investigation Catalog */}
          <div className="theme-surface border theme-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 theme-text-technical text-xs font-bold uppercase tracking-wider">
                <FlaskConical className="w-4 h-4" />
                <span>{t.investigationSection}</span>
              </div>
              <span className="text-[11px] theme-text-muted font-mono">
                {investigations.length} Selected
              </span>
            </div>

            {/* Existing investigations list */}
            {investigations.length > 0 && (
              <div className="space-y-2">
                {investigations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-2.5 theme-input rounded-lg border theme-border text-xs"
                  >
                    <div>
                      <span className="font-semibold theme-text-primary block">
                        {inv.name}
                      </span>
                      <span className="text-[11px] theme-text-muted font-mono">
                        {inv.category === 'Laboratory' ? t.labCategory : t.radiologyCategory}
                        {inv.notes && ` — ${inv.notes}`}
                      </span>
                    </div>

                    {isDoctor && (
                      <button
                        type="button"
                        onClick={() => handleRemoveInvestigation(inv.id)}
                        className="theme-text-muted hover:text-[color:var(--theme-status-danger)] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Investigation Form (Doctor Authority) */}
            {isDoctor && (
              <div className="p-3 theme-surface-nested/80 rounded-lg border theme-border space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] theme-text-muted mb-1">
                      Category
                    </label>
                    <select
                      value={newInvCategory}
                      onChange={(e) => {
                        const cat = e.target.value as InvestigationCategory;
                        setNewInvCategory(cat);
                        setNewInvName(cat === 'Laboratory' ? CATALOG_LABS[0] : CATALOG_RADIOLOGY[0]);
                      }}
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                    >
                      <option value="Laboratory">{t.labCategory}</option>
                      <option value="Radiology">{t.radiologyCategory}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] theme-text-muted mb-1">
                      Investigation
                    </label>
                    <select
                      value={newInvName}
                      onChange={(e) => setNewInvName(e.target.value)}
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                    >
                      {(newInvCategory === 'Laboratory' ? CATALOG_LABS : CATALOG_RADIOLOGY).map(
                        (item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={newInvNotes}
                    onChange={(e) => setNewInvNotes(e.target.value)}
                    placeholder="Specific clinical objective or urgency notes..."
                    className="w-full theme-surface border theme-border rounded p-2 text-xs theme-text-primary"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddInvestigation}
                    className="flex items-center gap-1.5 px-3 py-1.5 theme-action-secondary hover:bg-[color:var(--theme-border)] theme-text-technical rounded text-xs font-medium border theme-border"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addInvestigationBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Clinical Diagnoses & Treatment Advice */}
          <div className="theme-surface border theme-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 theme-text-technical text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.diagnosisSection}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium theme-text-secondary mb-1">
                  {t.preliminaryDiagnosis}
                </label>
                <input
                  type="text"
                  value={prelimDx}
                  onChange={(e) => setPrelimDx(e.target.value)}
                  disabled={!isDoctor}
                  placeholder="e.g. Acute Pharyngitis / Suspected Bronchitis"
                  className="w-full theme-input border theme-border rounded-lg p-2.5 text-xs theme-text-primary disabled:opacity-70 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium theme-text-technical mb-1">
                  {t.finalDiagnosis} (Authoritative)
                </label>
                <input
                  type="text"
                  value={finalDx}
                  onChange={(e) => setFinalDx(e.target.value)}
                  disabled={!isDoctor}
                  placeholder="e.g. Viral Upper Respiratory Tract Infection with Reactive Wheeze"
                  className="w-full theme-input border border-[color:var(--theme-border)] rounded-lg p-2.5 text-xs theme-text-secondary font-semibold disabled:opacity-70 font-sans"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-medium theme-text-secondary mb-1">
                  {t.treatmentSection}
                </label>
                <textarea
                  rows={2}
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  disabled={!isDoctor}
                  placeholder={t.treatmentAdvicePlaceholder}
                  className="w-full theme-input border theme-border rounded-lg p-2.5 text-xs theme-text-primary disabled:opacity-70 font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHORIZED PHARMACOTHERAPY & RX REGIMEN WORKSPACE */}
        <div className="space-y-6">
          <div className="theme-surface border border-[color:var(--theme-border-focus)] rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
            {/* Header with Rx Status Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b theme-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-serif font-black theme-text-technical">
                    ℞
                  </span>
                  <h3 className="text-base font-bold theme-text-primary font-sans">
                    {t.rxWorkspaceTitle}
                  </h3>
                </div>
                <p className="text-[11px] theme-text-muted mt-0.5">
                  {t.rxWorkspaceSubtitle}
                </p>
              </div>

              <div>
                {visit.prescription.isAuthorized ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 theme-surface-nested theme-text-technical border border-[color:var(--theme-border)] rounded-lg text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 theme-text-technical" />
                    <span>{t.rxAuthorizedBadge}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 theme-surface-nested theme-status-warning border border-[color:var(--theme-status-warning)] rounded-lg text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 theme-status-warning" />
                    <span>Pending Authorization</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Medications Formulary Picks */}
            {isDoctor && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold theme-text-muted uppercase tracking-wider block">
                  {t.quickMedPicks}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_DRUGS.map((drug) => (
                    <button
                      key={drug.name}
                      type="button"
                      onClick={() => handlePickQuickMed(drug)}
                      className="px-2.5 py-1 theme-input hover:theme-action-secondary theme-text-technical border theme-border rounded-md text-[11px] font-medium transition-colors"
                    >
                      + {drug.name} {drug.strength}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Prescription Regimen Items */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider theme-text-technical block">
                Prescription Items ({meds.length})
              </span>

              {meds.length === 0 ? (
                <div className="p-6 theme-input rounded-lg border border-dashed theme-border text-center text-xs theme-text-muted">
                  No medications added to the regimen yet.
                </div>
              ) : (
                meds.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-3 theme-input rounded-lg border theme-border space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono theme-text-technical font-bold">
                          {idx + 1}.
                        </span>
                        <strong className="theme-text-primary font-semibold text-sm">
                          {m.name}
                        </strong>
                        <span className="font-mono text-xs px-2 py-0.5 theme-surface rounded theme-text-technical border theme-border">
                          {m.strength}
                        </span>
                        <span className="theme-text-muted">({m.form})</span>
                      </div>

                      {isDoctor && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(m.id)}
                          className="theme-text-muted hover:text-[color:var(--theme-status-danger)] p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 theme-text-secondary text-[11px]">
                      <div>
                        <span className="theme-text-muted">{t.medDose}: </span>
                        <span>{m.dose}</span>
                        <span className="theme-text-muted mx-1">·</span>
                        <span className="theme-text-technical font-medium">{m.frequency}</span>
                      </div>
                      <div>
                        <span className="theme-text-muted">{t.medRoute}: </span>
                        <span>{m.route}</span>
                        <span className="theme-text-muted mx-1">·</span>
                        <span className="theme-text-muted">{t.medDuration}: </span>
                        <span>{m.duration}</span>
                      </div>
                    </div>

                    {m.instructions && (
                      <div className="text-[11px] theme-text-muted italic theme-surface/60 p-1.5 rounded">
                        ↳ {m.instructions}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Custom Medication Entry (Doctor Authority) */}
            {isDoctor && (
              <div className="p-3.5 theme-input rounded-xl border theme-border space-y-3 text-xs">
                <span className="font-bold theme-text-secondary uppercase tracking-wider block text-[11px]">
                  {t.addMedicationBtn}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] theme-text-muted mb-0.5">{t.medName}</label>
                    <input
                      type="text"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      placeholder="Medication name"
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] theme-text-muted mb-0.5">{t.medStrength}</label>
                    <input
                      type="text"
                      value={newMedStrength}
                      onChange={(e) => setNewMedStrength(e.target.value)}
                      placeholder="e.g. 500mg"
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] theme-text-muted mb-0.5">{t.medDose}</label>
                    <input
                      type="text"
                      value={newMedDose}
                      onChange={(e) => setNewMedDose(e.target.value)}
                      placeholder="1 tablet"
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] theme-text-muted mb-0.5">{t.medFrequency}</label>
                    <input
                      type="text"
                      value={newMedFreq}
                      onChange={(e) => setNewMedFreq(e.target.value)}
                      placeholder="e.g. BID every 12h"
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] theme-text-muted mb-0.5">{t.medRoute}</label>
                    <input
                      type="text"
                      value={newMedRoute}
                      onChange={(e) => setNewMedRoute(e.target.value)}
                      placeholder="Oral / Inhalation"
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] theme-text-muted mb-0.5">{t.medDuration}</label>
                    <input
                      type="text"
                      value={newMedDuration}
                      onChange={(e) => setNewMedDuration(e.target.value)}
                      placeholder="7 days"
                      className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] theme-text-muted mb-0.5">{t.medInstructions}</label>
                  <input
                    type="text"
                    value={newMedInst}
                    onChange={(e) => setNewMedInst(e.target.value)}
                    placeholder="e.g. Take with a full glass of water after food"
                    className="w-full theme-surface border theme-border rounded p-1.5 text-xs theme-text-primary"
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <label className="flex items-center gap-2 cursor-pointer theme-text-secondary text-[11px]">
                    <input
                      type="checkbox"
                      checked={newMedPrn}
                      onChange={(e) => setNewMedPrn(e.target.checked)}
                      className="rounded theme-text-technical focus:ring-[color:var(--theme-border-focus)]"
                    />
                    <span>{t.medPrn}</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="px-3.5 py-1.5 theme-action-primary hover:bg-[color:var(--theme-border-focus)] theme-text-primary rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addMedicationBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Clinical Counseling & Patient Guidance */}
            <div className="space-y-3 border-t theme-border pt-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium theme-text-secondary mb-1">
                  {t.clinicalCounseling}
                </label>
                <textarea
                  rows={2}
                  value={counseling}
                  onChange={(e) => setCounseling(e.target.value)}
                  disabled={!isDoctor}
                  placeholder="Medication interactions, warning signs, counseling on inhaler technique..."
                  className="w-full theme-input border theme-border rounded-lg p-2.5 text-xs theme-text-primary disabled:opacity-70 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium theme-text-secondary mb-1">
                  {t.patientGuidance}
                </label>
                <textarea
                  rows={2}
                  value={patientInstructions}
                  onChange={(e) => setPatientInstructions(e.target.value)}
                  disabled={!isDoctor}
                  placeholder="Storage instructions, avoidance of sun, hydration requirements..."
                  className="w-full theme-input border theme-border rounded-lg p-2.5 text-xs theme-text-primary disabled:opacity-70 font-sans"
                />
              </div>
            </div>

            {/* DOCTOR EXPLICIT AUTHORIZATION ACTION */}
            <div className="border-t theme-border pt-4">
              {!visit.prescription.isAuthorized ? (
                <div className="space-y-3">
                  <div className="p-3 theme-surface-nested border border-[color:var(--theme-status-warning)] rounded-lg text-xs theme-status-warning flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 theme-status-warning shrink-0 mt-0.5" />
                    <p>{t.rxNotAuthorizedWarning}</p>
                  </div>

                  <button
                    type="button"
                    onClick={onAuthorizePrescription}
                    disabled={!isDoctor}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs ${
                      isDoctor
                        ? 'theme-action-primary hover:bg-[color:var(--theme-border-focus)] theme-text-primary'
                        : 'theme-action-secondary theme-text-muted cursor-not-allowed border theme-border'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.authorizeRxBtn}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 theme-surface-nested border border-[color:var(--theme-border)] rounded-lg">
                  <div className="text-xs theme-text-technical">
                    <strong className="block font-semibold">
                      {visit.prescription.authorizedBy}
                    </strong>
                    <span className="font-mono text-[10px] theme-text-muted">
                      {visit.prescription.authorizedAt
                        ? new Date(visit.prescription.authorizedAt).toLocaleString()
                        : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenPrintModal}
                    className="flex items-center gap-1.5 px-4 py-2 theme-action-primary hover:bg-[color:var(--theme-border-focus)] theme-text-primary rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t.printCertifiedRxBtn}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Follow-up Decision Card */}
          <div className="theme-surface border theme-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 theme-text-technical text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>{t.followUpSection}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer theme-text-secondary">
                <input
                  type="checkbox"
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                  disabled={!isDoctor}
                  className="rounded theme-text-technical focus:ring-[color:var(--theme-border-focus)]"
                />
                <span className="font-medium">{t.followUpRequired}</span>
              </label>

              {followUpRequired && (
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="block text-[11px] theme-text-muted mb-1">
                      {t.followUpInterval}
                    </label>
                    <input
                      type="number"
                      value={followUpDays}
                      onChange={(e) => setFollowUpDays(e.target.value)}
                      disabled={!isDoctor}
                      className="w-32 theme-input border theme-border rounded p-1.5 text-xs theme-text-primary font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] theme-text-muted mb-1">
                      {t.followUpInstructions}
                    </label>
                    <input
                      type="text"
                      value={followUpInst}
                      onChange={(e) => setFollowUpInst(e.target.value)}
                      disabled={!isDoctor}
                      placeholder="e.g. Bring laboratory report on day 7"
                      className="w-full theme-input border theme-border rounded p-2 text-xs theme-text-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Bottom Actions Bar */}
      <div className="theme-surface border theme-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          {saveSuccessNotice && (
            <span className="text-xs theme-status-success font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Encounter records saved successfully.</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveProgress}
            className="px-5 py-2.5 theme-action-secondary hover:bg-[color:var(--theme-border)] theme-text-primary rounded-lg text-xs font-semibold transition-colors border theme-border"
          >
            {language === 'ar' ? 'حفظ التقدم السريري' : 'Save Encounter'}
          </button>

          <button
            type="button"
            onClick={onRecordExit}
            className="flex items-center gap-1.5 px-4 py-2.5 theme-input hover:bg-[color:var(--theme-action-destructive)] theme-text-secondary hover:text-[color:var(--theme-text-primary)] border theme-border hover:border-[color:var(--theme-status-danger)] rounded-lg text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.exitVisitBtn}</span>
          </button>

          {isDoctor && caseRecord.state !== 'Completed' && (
            <button
              type="button"
              onClick={onCompleteCase}
              className="flex items-center gap-1.5 px-4 py-2.5 theme-status-success hover:bg-[color:var(--theme-status-success)] theme-text-primary rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.completeCaseAction}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
