'use strict';

const { AuthError } = require('../auth/errors');
const { PatientRepository } = require('../persistence/patient-repository');
const { registerNewPatient } = require('../../application/services/register-new-patient');
const { retrieveExistingPatient } = require('../../application/services/retrieve-existing-patient');
const { calculateAge } = require('../../domain/patient');
const COOKIE = '__Host-vip_session';
const COOKIE_OPTIONS = '; Path=/; Secure; HttpOnly; SameSite=Strict';

function cookieToken(header) {
  if (header === undefined) return undefined;
  if (typeof header !== 'string' || header.length > 4096) throw new AuthError(401);
  const matches = header.split(';').map(s => s.trim()).filter(s => s.startsWith(COOKIE + '='));
  if (matches.length === 0) return undefined;
  if (matches.length !== 1) throw new AuthError(401);
  return matches[0].slice(COOKIE.length + 1);
}

function registrationBody(body) {
  const keys = ['name', 'dateOfBirth', 'profession', 'phone', 'gender'];
  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(k => !keys.includes(k)) ||
      keys.some(k => typeof body[k] !== 'string' || !body[k].length || body[k].length > 256) ||
      !['Male','Female'].includes(body.gender) || !/^\d{4}-\d{2}-\d{2}$/.test(body.dateOfBirth) ||
      Number.isNaN(Date.parse(body.dateOfBirth)) || new Date(body.dateOfBirth).toISOString().slice(0,10) !== body.dateOfBirth) throw new AuthError(400);
  try { calculateAge(body.dateOfBirth); } catch { throw new AuthError(400); }
  return body;
}

// Deliberately separate from the existing POST-only/dev opt-in composition.
// No global installation, listener, pool creation or frontend role input.
async function composeSecuredPatients(app, { auth, trustedOrigin } = {}) {
  if (!auth?.login || !auth?.current || !auth?.logout || !auth?.withAuthorized ||
      typeof trustedOrigin !== 'string') throw new AuthError(503);
  let parsed;
  try { parsed = new URL(trustedOrigin); } catch { throw new AuthError(503); }
  if (parsed.protocol !== 'https:' || parsed.origin !== trustedOrigin || parsed.username || parsed.password) throw new AuthError(503);
  if (['/auth/login','/auth/session','/auth/logout','/patients','/patients/:patientId'].some(url =>
    app.hasRoute({ method: url === '/auth/session' || url.includes(':') ? 'GET' : 'POST', url }))) throw new AuthError(503);

  await app.register(async scope => {
    scope.addHook('onRequest', async (request, reply) => {
      reply.header('Cache-Control', 'no-store');
      if (request.headers['sec-fetch-site'] === 'cross-site') throw new AuthError(403);
      if (request.method === 'POST') {
        if (request.headers.origin !== trustedOrigin) throw new AuthError(403);
        if (!/^application\/json(?:\s*;.*)?$/i.test(request.headers['content-type'] ?? '')) {
          return reply.code(415).send({ error: 'Invalid request' });
        }
      }
    });
    scope.setErrorHandler((error, request, reply) => {
      const status = error instanceof AuthError ? error.statusCode : error.statusCode === 400 ? 400 : error.statusCode === 413 ? 413 : 503;
      if (status === 429) reply.header('Retry-After', '900');
      reply.code(status).send({ error: error instanceof AuthError ? error.message : status === 503 ? 'Service unavailable' : 'Invalid request' });
    });
    scope.post('/auth/login', { bodyLimit: 4096 }, async (request, reply) => {
      const body = request.body;
      if (!body || typeof body !== 'object' || Array.isArray(body) ||
          Object.keys(body).some(k => !['loginLabel','password'].includes(k))) throw new AuthError(400);
      const result = await auth.login({ loginLabel: body.loginLabel, password: body.password,
        source: request.raw.socket.remoteAddress, priorToken: cookieToken(request.headers.cookie) });
      reply.header('Set-Cookie', `${COOKIE}=${result.token}${COOKIE_OPTIONS}; Expires=${new Date(result.expires).toUTCString()}`);
      return { authenticated: true };
    });
    scope.get('/auth/session', { bodyLimit: 4096 }, async request => auth.current(cookieToken(request.headers.cookie)));
    scope.post('/auth/logout', { bodyLimit: 4096 }, async (request, reply) => {
      if (request.body && Object.keys(request.body).length) throw new AuthError(400);
      await auth.logout(cookieToken(request.headers.cookie), request.headers['x-csrf-token']);
      reply.header('Set-Cookie', `${COOKIE}=${COOKIE_OPTIONS}; Max-Age=0`);
      return reply.code(204).send();
    });
    scope.get('/patients/:patientId', async (request, reply) => {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(request.params.patientId)) throw new AuthError(400);
      const patient = await auth.withAuthorized(cookieToken(request.headers.cookie), 'PATIENT_RETRIEVE', undefined,
        ({ client }) => retrieveExistingPatient({ patientId: request.params.patientId, repository: new PatientRepository(client) }));
      return patient === null ? reply.code(404).send({ error: 'Patient not found' }) : patient;
    });
    scope.post('/patients', { bodyLimit: 4096 }, async (request, reply) => {
      const body = registrationBody(request.body);
      const patient = await auth.withAuthorized(cookieToken(request.headers.cookie), 'PATIENT_REGISTER', request.headers['x-csrf-token'], async ({ client }) => {
        // The existing service owns a nested SAVEPOINT; auth owns the outer COMMIT.
        const nestedClient = {
          query: (sql, params) => client.query(sql === 'BEGIN' ? 'SAVEPOINT vip_patient_registration' :
            sql === 'COMMIT' ? 'RELEASE SAVEPOINT vip_patient_registration' :
            sql === 'ROLLBACK' ? 'ROLLBACK TO SAVEPOINT vip_patient_registration' : sql, params),
          release() {}
        };
        const repository = new PatientRepository(client);
        let persisted;
        // Preserve the service's legacy domain return; transport needs INSERT RETURNING identity.
        const capture = {
          allocateClinicPatientNumber: connection => repository.allocateClinicPatientNumber(connection),
          async createPatient(value, connection) {
            if (persisted) throw new AuthError(503);
            persisted = await repository.createPatient(value, connection);
            return persisted;
          }
        };
        await registerNewPatient({ ...body, repository: capture, pool: { connect: async () => nestedClient } });
        if (!persisted || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(persisted.patient_id)) throw new AuthError(503);
        return {
          patient_id: persisted.patient_id, clinic_patient_number: persisted.clinic_patient_number,
          name: persisted.name, date_of_birth: persisted.date_of_birth,
          profession: persisted.profession, phone: persisted.phone, gender: persisted.gender, age: persisted.age
        };
      });
      return reply.code(201).send(patient);
    });
  });
}

module.exports = { composeSecuredPatients, cookieToken, registrationBody };
