export interface BasicPatient {
  readonly patientId: string;
  readonly clinicPatientNumber: string;
  readonly name: string;
  readonly dateOfBirth: string | null;
  readonly profession: string;
  readonly phone: string;
  readonly gender: 'Male' | 'Female';
  readonly age: number | null;
}
export interface Registration {
  name: string; dateOfBirth: string; profession: string; phone: string; gender: 'Male' | 'Female';
}
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid response');
  return value as Record<string, unknown>;
}
export function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}
export function parsePatient(value: unknown): BasicPatient {
  const row = record(value);
  const keys = ['patient_id','clinic_patient_number','name','date_of_birth','profession','phone','gender','age'];
  if (Object.keys(row).some(key => !keys.includes(key)) || typeof row.patient_id !== 'string' || !UUID.test(row.patient_id) ||
      typeof row.clinic_patient_number !== 'string' || !/^CPN-[0-9]+$/.test(row.clinic_patient_number) ||
      !['name','profession','phone'].every(key => typeof row[key] === 'string' && (row[key] as string).length > 0 && (row[key] as string).length <= 256) ||
      !['Male','Female'].includes(String(row.gender)) || (row.date_of_birth !== null && !validDate(row.date_of_birth)) ||
      (row.date_of_birth === null ? row.age !== null : !Number.isSafeInteger(row.age) || Number(row.age) < 0)) throw new Error('Invalid response');
  return Object.freeze({ patientId: row.patient_id, clinicPatientNumber: row.clinic_patient_number,
    name: row.name as string, dateOfBirth: row.date_of_birth as string | null, profession: row.profession as string,
    phone: row.phone as string, gender: row.gender as 'Male' | 'Female', age: row.age as number | null });
}
export function parseRegistration(value: unknown): Registration {
  const row = record(value);
  const keys = ['name','dateOfBirth','profession','phone','gender'];
  if (Object.keys(row).length !== keys.length || Object.keys(row).some(key => !keys.includes(key)) ||
      !keys.every(key => typeof row[key] === 'string' && (row[key] as string).length > 0 && (row[key] as string).length <= 256) ||
      !validDate(row.dateOfBirth) || row.dateOfBirth > new Date().toISOString().slice(0,10) || !['Male','Female'].includes(String(row.gender))) throw new Error('Invalid request');
  return { name: row.name as string, dateOfBirth: row.dateOfBirth, profession: row.profession as string,
    phone: row.phone as string, gender: row.gender as 'Male' | 'Female' };
}
