const { registerNewPatient } = require('../../../application/services/register-new-patient');

async function registerNewPatientController(request, reply) {
  const patient = await registerNewPatient({
    ...request.body,
    repository: request.server.patientRepository,
    pool: request.server.dbPool,
  });

  return reply.code(201).send(patient);
}

module.exports = { registerNewPatientController };
