'use strict';
const { createCaseService } = require('../../application/services/create-case');
function registerCaseCreateRoutes(scope, { auth, cookieToken }) {
  const service = createCaseService(auth);
  const context = request => ({ token: cookieToken(request.headers.cookie), csrf: request.headers['x-csrf-token'] });
  scope.post('/clinical/cases', { bodyLimit: 16384 }, async request =>
    service.create(context(request), request.body));
  // POST keeps operation IDs out of URLs/access logs and requires existing origin/CSRF checks.
  scope.post('/clinical/cases/receipt', { bodyLimit: 1024 }, async request =>
    service.recover(context(request), request.body));
}
module.exports = { registerCaseCreateRoutes };
