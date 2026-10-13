'use strict';

class AuthError extends Error {
  constructor(statusCode) {
    super(({ 400: 'Invalid request', 401: 'Authentication required',
      403: 'Permission denied', 404: 'Patient not found', 409: 'Operation identity conflict', 429: 'Try again later', 503: 'Service unavailable' })[statusCode]);
    this.statusCode = statusCode;
  }
}

module.exports = { AuthError };
