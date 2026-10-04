const Fastify = require('fastify');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;

function resolveHost() {
  return process.env.HOST || DEFAULT_HOST;
}

function resolvePort() {
  const rawPort = process.env.PORT;
  if (rawPort === undefined || rawPort === '') return DEFAULT_PORT;

  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
  }

  return port;
}

function buildServer() {
  return Fastify({ logger: false });
}

async function startServer() {
  const server = buildServer();

  const address = await server.listen({
    host: resolveHost(),
    port: resolvePort(),
  });

  return { server, address };
}

async function main() {
  let runtime;

  try {
    runtime = await startServer();

    const shutdown = async () => {
      try {
        await runtime.server.close();
        process.exit(0);
      } catch {
        process.exitCode = 1;
        process.exit(1);
      }
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    process.exitCode = 1;
    process.stderr.write(`${error.message}\n`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  DEFAULT_HOST,
  DEFAULT_PORT,
  resolveHost,
  resolvePort,
  buildServer,
  startServer,
};
