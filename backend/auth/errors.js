'use strict';

class AuthError extends Error {
  constructor(statusCode) {
    super(({ 400: 'Invalid request', 401: 'Authentication required',
      403: 'Permission denied', 429: 'Try again later', 503: 'Service unavailable' })[statusCode]);
    this.statusCode = statusCode;
  }
}

module.exports = { AuthError };
