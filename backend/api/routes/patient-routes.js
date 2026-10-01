const {
  registerNewPatientController,
} = require('../controllers/register-new-patient-controller');
const {
  retrieveExistingPatientController,
} = require('../controllers/retrieve-existing-patient-controller');

async function patientRoutes(app) {
  app.post('/patients', registerNewPatientController);
  app.get('/patients/:patientId', retrieveExistingPatientController);
}

module.exports = { patientRoutes };
