import { parsePatient, parseRegistration, record, type BasicPatient, type Registration } from './basic-patient';
import type { PastHistory } from '../domain/types';
const lists = ['chronicIllnesses', 'knownAllergies', 'surgicalHistory', 'familyHistory'] as const;
export function parseHistory(value: unknown): PastHistory {
  const row = record(value);
  const keys = [...lists, 'lifestyleNotes'];
  const text = (s: unknown): s is string => typeof s === 'string' && s.length <= 2000 && !/\u0000/.test(s);
  if (Object.keys(row).length !== keys.length || Object.keys(row).some(k => !keys.includes(k)) || !text(row.lifestyleNotes) ||
      lists.some(k => !Array.isArray(row[k]) || row[k].length > 32 || row[k].some((s: unknown) => !text(s) || !s.trim() || s.length > 500))) throw new Error('Invalid history');
  return { chronicIllnesses: [...row.chronicIllnesses as string[]], knownAllergies: [...row.knownAllergies as string[]],
    surgicalHistory: [...row.surgicalHistory as string[]], familyHistory: [...row.familyHistory as string[]], lifestyleNotes: row.lifestyleNotes as string };
}
export function parseIntakeRegistration(value: unknown): Registration {
  const { pastHistory, ...basic } = record(value);
  if (typeof basic.profession !== 'string') throw new Error('Invalid profession');
  const result = parseRegistration(basic, { allowEmptyProfession: true });
  if (!result.name.trim() || !result.phone.trim()) throw new Error('Invalid request');
  return { ...result, profession: basic.profession, pastHistory: parseHistory(pastHistory) };
}
export function parseIntakePatient(value: unknown): BasicPatient {
  const row = record(value);
  if (!Object.hasOwn(row, 'pastHistory') || typeof row.profession !== 'string') throw new Error('Incomplete intake response');
  const { pastHistory, ...basic } = row;
  const patient = parsePatient(basic);
  return Object.freeze({ ...patient, profession: row.profession, pastHistory: pastHistory === null ? null : parseHistory(pastHistory) });
}
