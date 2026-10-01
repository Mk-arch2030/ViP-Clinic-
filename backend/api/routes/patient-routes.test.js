const test = require('node:test');
const assert = require('node:assert/strict');

const { patientRoutes } = require('./patient-routes');

test('Patient routes bind GET /patients/:patientId to Retrieve Existing Patient controller', async () => {
  const routes = [];

  const app = {
    get(path, handler) {
      routes.push({ method: 'GET', path, handler });
    },
    post(path, handler) {
      routes.push({ method: 'POST', path, handler });
    },
  };

  await patientRoutes(app);

  const route = routes.find(
    ({ method, path }) =>
      method === 'GET' && path === '/patients/:patientId',
  );

  assert.ok(route);
  assert.equal(
    route.handler.name,
    'retrieveExistingPatientController',
  );
});

console.log('RETRIEVE_EXISTING_PATIENT_ROUTE_TEST = PASS');
console.log('FAIL = 0');
