import React from 'react';
import { VisitRecord, PatientRecord, CaseRecord } from '../domain/types';
import { translations, Language } from '../i18n/translations';
import { calculateDetailedAge } from '../domain/patientAge';
import { Printer, X, ShieldCheck, Stethoscope } from 'lucide-react';

interface PrintPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: VisitRecord;
  patient: PatientRecord;
  caseRecord: CaseRecord;
  lang: Language;
}

export const PrintPrescriptionModal: React.FC<PrintPrescriptionModalProps> = ({
  isOpen,
  onClose,
  visit,
  patient,
  caseRecord,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const detailedAge = calculateDetailedAge(patient.dateOfBirth);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-slate-100 text-sm">
              {t.printCertifiedRxBtn} · {patient.clinicPatientNumber}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printNow}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div id="printable-prescription" className="p-8 bg-white text-slate-900 min-h-[700px] flex flex-col justify-between">
          <div>
            {/* Clinic Letterhead Header */}
            <div className="border-b-2 border-teal-800 pb-5 mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-teal-800">
                  <Stethoscope className="w-6 h-6 stroke-[2.5]" />
                  <h1 className="text-2xl font-bold tracking-tight font-serif text-teal-950">
                    {t.rxPrintHeader}
                  </h1>
                </div>
                <p className="text-sm font-semibold text-teal-700 mt-1">
                  {t.rxDoctorCredentials}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  {t.rxLicenseInfo} · Attending Physician Authority
                </p>
              </div>

              <div className="text-right rtl:text-left font-mono text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="font-bold text-teal-900 text-sm">{patient.clinicPatientNumber}</div>
                <div>{t.visitCardCase}: {caseRecord.id}</div>
                <div>{visit.date} · {visit.time}</div>
              </div>
            </div>

            {/* Patient Demographic Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-100/80 rounded-lg border border-slate-200 text-xs mb-6 font-sans">
              <div>
                <span className="text-slate-500 block">{t.patientName}</span>
                <strong className="text-slate-900 font-semibold text-sm">{patient.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">{t.derivedAge}</span>
                <strong className="text-slate-800 font-mono">
                  {detailedAge.years} {t.derivedAgeYears} ({patient.dateOfBirth})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">{t.gender} / {t.profession}</span>
                <strong className="text-slate-800">
                  {patient.gender === 'Male' ? t.genderMale : t.genderFemale} · {patient.profession}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">{t.phone}</span>
                <strong className="text-slate-800 font-mono">{patient.phone}</strong>
              </div>
            </div>

            {/* Known Allergies Warning if present */}
            {patient.pastHistory.knownAllergies.length > 0 && (
              <div className="mb-5 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center gap-2">
                <strong className="font-semibold uppercase tracking-wider">{t.knownAllergies}:</strong>
                <span>{patient.pastHistory.knownAllergies.join(', ')}</span>
              </div>
            )}

            {/* Diagnosis Summary */}
            {visit.finalDiagnosis || visit.preliminaryDiagnosis ? (
              <div className="mb-5 text-xs text-slate-700 bg-teal-50/50 p-3 rounded border border-teal-100">
                <span className="font-semibold text-teal-900 block mb-0.5">
                  {t.finalDiagnosis || t.preliminaryDiagnosis}:
                </span>
                <p className="font-medium text-slate-800">
                  {visit.finalDiagnosis || visit.preliminaryDiagnosis}
                </p>
              </div>
            ) : null}

            {/* Rx Symbol & Medication Regimen */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-serif font-black text-teal-800 select-none">
                  {t.rxSymbol}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                  {t.rxWorkspaceTitle}
                </span>
              </div>

              {visit.prescription.items.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-4 text-center border border-dashed border-slate-200 rounded">
                  No medications entered for this prescription.
                </div>
              ) : (
                <div className="space-y-3">
                  {visit.prescription.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 border-b border-slate-200 last:border-b-0 hover:bg-slate-50/60 rounded transition-colors"
                    >
                      <div className="flex justify-between items-baseline">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-xs text-slate-400 font-semibold">
                            {idx + 1}.
                          </span>
                          <strong className="text-base text-slate-900 font-semibold">
                            {item.name}
                          </strong>
                          <span className="text-xs px-2 py-0.5 bg-slate-200/80 rounded font-mono text-slate-700">
                            {item.strength}
                          </span>
                          <span className="text-xs text-slate-600">
                            ({item.form})
                          </span>
                        </div>
                        {item.quantity && (
                          <span className="text-xs font-mono text-slate-500">
                            Qty: {item.quantity}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 pl-5 rtl:pr-5 text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        <div>
                          <span className="text-slate-500">{t.medDose}: </span>
                          <span className="font-medium">{item.dose}</span>
                          <span className="text-slate-400 mx-1">·</span>
                          <span className="font-medium text-teal-800">{item.frequency}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{t.medRoute}: </span>
                          <span>{item.route}</span>
                          <span className="text-slate-400 mx-1">·</span>
                          <span className="text-slate-500">{t.medDuration}: </span>
                          <span>{item.duration}</span>
                        </div>
                      </div>

                      {item.instructions && (
                        <div className="mt-1 pl-5 rtl:pr-5 text-xs text-slate-600 italic">
                          ↳ {item.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clinical Counseling & Patient Instructions */}
            {(visit.prescription.clinicalCounseling || visit.prescription.patientInstructions) && (
              <div className="mb-6 p-3.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                {visit.prescription.clinicalCounseling && (
                  <div>
                    <strong className="text-teal-900 font-semibold block mb-0.5">
                      {t.clinicalCounseling}:
                    </strong>
                    <p className="text-slate-700">{visit.prescription.clinicalCounseling}</p>
                  </div>
                )}
                {visit.prescription.patientInstructions && (
                  <div>
                    <strong className="text-slate-800 font-semibold block mb-0.5">
                      {t.patientGuidance}:
                    </strong>
                    <p className="text-slate-600">{visit.prescription.patientInstructions}</p>
                  </div>
                )}
              </div>
            )}

            {/* Follow-up Note */}
            {visit.followUp.required && (
              <div className="mb-6 text-xs text-slate-600 p-2.5 bg-teal-50/40 rounded border border-teal-100 flex items-center gap-2">
                <span className="font-semibold text-teal-900">{t.followUpSection}:</span>
                <span>
                  {visit.followUp.intervalDays ? `${visit.followUp.intervalDays} ${t.derivedAgeDays}` : ''}
                  {visit.followUp.clinicalInstructions ? ` — ${visit.followUp.clinicalInstructions}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Footer & Signature Representation */}
          <div className="border-t-2 border-slate-200 pt-5 mt-6">
            <div className="flex justify-between items-end">
              <div className="text-xs text-slate-500 max-w-sm">
                <div className="flex items-center gap-1.5 text-teal-800 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>{t.rxCertifiedStamp}</span>
                </div>
                <p className="text-[11px] leading-tight">
                  {t.rxPrintFooter}
                </p>
                <div className="mt-1 font-mono text-[10px] text-slate-400">
                  Prescription ID: {visit.prescription.id} · Certified by {visit.prescription.authorizedBy || 'Dr. Roby, MD'}
                </div>
              </div>

              <div className="text-center">
                <div className="w-48 border-b-2 border-slate-900 pb-1 mb-1">
                  <div className="font-serif italic font-bold text-teal-900 text-lg">
                    Dr. Roby, MD
                  </div>
                  <div className="text-[10px] text-slate-500 tracking-wider">
                    {visit.prescription.authorizedAt ? new Date(visit.prescription.authorizedAt).toLocaleDateString() : visit.date}
                  </div>
                </div>
                <span className="text-[11px] text-slate-600 font-medium">
                  {t.rxSignatureLine}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
