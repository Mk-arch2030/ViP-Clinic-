'use strict';
const { AuthError } = require('../auth/errors');
const { PatientRepository } = require('../persistence/patient-repository');
const { PatientIntakeRepository, LISTS } = require('../persistence/patient-intake-repository');
const { registerNewPatient } = require('../../application/services/register-new-patient');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function historyBody(value) {
  const keys = [...LISTS, 'lifestyleNotes'];
  const text = s => typeof s === 'string' && s.length <= 2000 && !/[\u0000]/.test(s);
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== keys.length ||
      Object.keys(value).some(k => !keys.includes(k)) || !text(value.lifestyleNotes) ||
      LISTS.some(k => !Array.isArray(value[k]) || value[k].length > 32 || value[k].some(s => !text(s) || !s.trim() || s.length > 500))) throw new AuthError(400);
  return value;
}
function intakeBody(body, registrationBody) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new AuthError(400);
  const { pastHistory, ...basic } = body;
  // The original form permits an empty profession. Preserve this explicitly.
  if (typeof basic.profession !== 'string') throw new AuthError(400);
  registrationBody(basic, { allowEmptyProfession: true });
  if (!basic.name.trim() || !basic.phone.trim() || basic.dateOfBirth > new Date().toISOString().slice(0, 10)) throw new AuthError(400);
  return { ...basic, pastHistory: historyBody(pastHistory) };
}
function registerIntakeRoutes(scope, { auth, cookieToken, registrationBody }) {
  scope.post('/patients/intake', { bodyLimit: 300000 }, async (request, reply) => {
    const { pastHistory, ...basic } = intakeBody(request.body, registrationBody);
    const patient = await auth.withAuthorized(cookieToken(request.headers.cookie), 'PATIENT_REGISTER', request.headers['x-csrf-token'], async ({ client }) => {
      const repository = new PatientRepository(client);
      const history = new PatientIntakeRepository(client);
      let saved;
      const nestedClient = { query: (sql, params) => client.query(sql === 'BEGIN' ? 'SAVEPOINT vip_patient_intake' :
        sql === 'COMMIT' ? 'RELEASE SAVEPOINT vip_patient_intake' : sql === 'ROLLBACK' ? 'ROLLBACK TO SAVEPOINT vip_patient_intake' : sql, params), release() {} };
      await registerNewPatient({ ...basic, pool: { connect: async () => nestedClient }, repository: {
        allocateClinicPatientNumber: connection => repository.allocateClinicPatientNumber(connection),
        async createPatient(value, connection) {
          saved = await repository.createPatient(value, connection);
          if (!saved || !UUID.test(saved.patient_id)) throw new AuthError(503);
          await history.create(saved.patient_id, pastHistory);
          return saved;
        }
      } });
      // Read the persisted values rather than echo the submitted history.
      const result = await history.find(saved.patient_id);
      if (!result?.pastHistory) throw new AuthError(503);
      return result;
    });
    return reply.code(201).send(patient);
  });
  scope.get('/patients/:patientId/intake', async (request, reply) => {
    if (!UUID.test(request.params.patientId)) throw new AuthError(400);
    const patient = await auth.withAuthorized(cookieToken(request.headers.cookie), 'PATIENT_RETRIEVE', undefined,
      ({ client }) => new PatientIntakeRepository(client).find(request.params.patientId));
    return patient === null ? reply.code(404).send({ error: 'Patient not found' }) : patient;
  });
}
module.exports = { registerIntakeRoutes, intakeBody, historyBody };
