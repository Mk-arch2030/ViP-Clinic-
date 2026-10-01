const {
  retrieveExistingPatient,
} = require('../../../application/services/retrieve-existing-patient');

async function retrieveExistingPatientController(request, reply) {
  const patient = await retrieveExistingPatient({
    patientId: request.params.patientId,
    repository: request.server.patientRepository,
  });

  if (patient === null) {
    return reply.code(404).send({ error: 'Patient not found' });
  }

  return reply.code(200).send(patient);
}

module.exports = { retrieveExistingPatientController };
