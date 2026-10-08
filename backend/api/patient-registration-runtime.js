'use strict';

const {
  buildServer,
  resolveHost,
  resolvePort,
} = require('../server');
const {
  composePatientRegistration,
} = require('./patient-registration-composition');

async function buildPatientRegistrationRuntime(options = {}) {
  const app = options.app || buildServer();

  try {
    await composePatientRegistration(app, options.composition || {});
    return app;
  } catch (error) {
    try { await app.close(); } catch {}
    throw error;
  }
}

async function startPatientRegistrationRuntime(options = {}) {
  const app = await buildPatientRegistrationRuntime(options);

  try {
    const address = await app.listen({
      host: options.host === undefined ? resolveHost() : options.host,
      port: options.port === undefined ? resolvePort() : options.port,
    });

    return { app, address };
  } catch (error) {
    try { await app.close(); } catch {}
    throw error;
  }
}

async function main() {
  let runtime;

  try {
    runtime = await startPatientRegistrationRuntime();

    const shutdown = async () => {
      try {
        await runtime.app.close();
        process.exitCode = 0;
      } catch (error) {
        process.stderr.write(String(error.message) + '\n');
        process.exitCode = 1;
      }
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    process.stderr.write(String(error.message) + '\n');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildPatientRegistrationRuntime,
  startPatientRegistrationRuntime,
};
