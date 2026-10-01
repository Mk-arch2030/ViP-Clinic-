async function retrieveExistingPatient({ patientId, repository }) {
  return repository.findByTechnicalId(patientId);
}

module.exports = { retrieveExistingPatient };
