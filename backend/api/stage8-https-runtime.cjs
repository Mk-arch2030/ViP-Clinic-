'use strict';

// Stage 8 synthetic acceptance HTTPS runtime.
// No automatic listener, database migration, seeding or deployment.
const assert = require('node:assert/strict');
const Fastify = require('fastify');
const { verifyStage8Database } = require('./stage8-database-guard.cjs');
const { verifyStage8Tls } = require('./stage8-tls-guard.cjs');
const { verifyStage8Assets } = require('./stage8-assets-guard.cjs');
const { composeSecuredPatients } = require('./secured-patient-composition');
const { clearRejectedSession } = require('./expired-session-cookie.cjs');

const ORIGIN = 'https://127.0.0.1:3443';
const HOST = '127.0.0.1';
const PORT = 3443;

// Only successfully built Stage 8 apps may reach the listener.
const approvedApps = new WeakSet();

async function buildStage8HttpsRuntime({
  pool,
  auth,
  databasePaths,
  tlsDirectory,
  assetsDirectory
} = {}) {
  assert.ok(pool && typeof pool.connect === 'function');
  assert.ok(auth &&
    typeof auth.login === 'function' &&
    typeof auth.current === 'function' &&
    typeof auth.logout === 'function' &&
    typeof auth.withAuthorized === 'function');

  // Fail closed before creating a server.
  const https = verifyStage8Tls(tlsDirectory);
  const routes = verifyStage8Assets(assetsDirectory);
  await verifyStage8Database(pool, databasePaths);

  const app = Fastify({
    https,
    logger: false,
    trustProxy: false,
    bodyLimit: 4096,
    requestTimeout: 15000,
    connectionTimeout: 15000,
    keepAliveTimeout: 5000
  });

  try {
    app.addHook('onRequest', async (request, reply) => {
      if (request.raw.socket.encrypted !== true) {
        return reply.code(403).send({
          error: 'Protected transport required'
        });
      }

      if (request.headers.host !== `${HOST}:${PORT}`) {
        return reply.code(400).send({
          error: 'Invalid request'
        });
      }

      reply.header('X-Content-Type-Options', 'nosniff');
      reply.header('Cache-Control', 'no-store');
      reply.header('Content-Security-Policy',
        "default-src 'self'; script-src 'self'; " +
        "style-src 'self'; connect-src 'self'; " +
        "img-src 'self'; object-src 'none'; " +
        "base-uri 'none'; frame-ancestors 'none'; " +
        "form-action 'self'");
    });

    app.addHook('onSend', clearRejectedSession);

    await composeSecuredPatients(app, {
      auth,
      trustedOrigin: ORIGIN,
      enableCaseCreate: true
    });

    for (const [url, asset] of routes) {
      app.get(url, async (_request, reply) =>
        reply.type(asset.type).send(asset.bytes)
      );
    }

    app.setNotFoundHandler((_request, reply) =>
      reply.code(404).send({ error: 'Not found' })
    );

    app.setErrorHandler((_error, _request, reply) =>
      reply.code(503).send({ error: 'Service unavailable' })
    );

    await app.ready();
    approvedApps.add(app);
    return app;
  } catch (error) {
    await app.close().catch(() => {});
    throw error;
  }
}

async function listenStage8HttpsRuntime(app, token) {
  assert.equal(token, 'ROBY_STAGE8_HTTPS_ACCEPTANCE_LISTEN');
  assert.ok(app && typeof app.listen === 'function');
  assert.ok(approvedApps.has(app),
    'Listener requires a successfully guarded Stage 8 app');
  approvedApps.delete(app);

  return app.listen({
    host: HOST,
    port: PORT
  });
}

module.exports = {
  ORIGIN,
  HOST,
  PORT,
  buildStage8HttpsRuntime,
  listenStage8HttpsRuntime
};
