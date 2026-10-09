'use strict';

const { Actor } = require('../../domain/actor');
const { AuthError } = require('./errors');
const CAPABILITIES = Object.freeze(['ARRIVAL', 'PATIENT_DATA_RECORDING', 'EXIT', 'DOCTOR_NOTIFICATION']);
const PATIENT_OPERATIONS = Object.freeze(['PATIENT_REGISTER', 'PATIENT_RETRIEVE']);

function resolveActor(row) {
  if (!row || typeof row.actor_id !== 'string' || !row.actor_id || !['DOCTOR', 'NURSE'].includes(row.actor_role) || row.lifecycle_state !== 'ACTIVE') throw new AuthError(401);
  return new Actor({ actorIdentityReference: row.actor_id,
    role: row.actor_role === 'DOCTOR' ? 'Doctor' : 'Nurse', lifecycle: row.lifecycle_state });
}

function authorize(actor, operation, context) {
  if (![...CAPABILITIES, ...PATIENT_OPERATIONS].includes(operation)) throw new AuthError(403);
  if (actor.lifecycle !== 'ACTIVE') throw new AuthError(401);
  if (!['DOCTOR_ONLY', 'DOCTOR_NURSE'].includes(context?.mode)) throw new AuthError(403);
  if (actor.role === 'Doctor') return;
  const d = context?.delegation;
  if (actor.role !== 'Nurse' || !CAPABILITIES.includes(operation) || context?.mode !== 'DOCTOR_NURSE' ||
      !d || d.nurse_id !== actor.actorIdentityReference || context.grantor?.actor_role !== 'DOCTOR' ||
      context.grantor?.actor_id !== d.doctor_id || context.grantor?.lifecycle_state !== 'ACTIVE' ||
      !['FULL', 'LIMITED'].includes(d.mode) || !Array.isArray(d.capabilities) ||
      new Set(d.capabilities).size !== d.capabilities.length || d.capabilities.some(c => !CAPABILITIES.includes(c)) ||
      (d.mode === 'LIMITED' && !d.capabilities.includes(operation))) throw new AuthError(403);
}

module.exports = { CAPABILITIES, resolveActor, authorize };
