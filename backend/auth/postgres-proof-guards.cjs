'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const DATABASE = 'roby_auth_proof_stage5';
const PROTECTED = Object.freeze(['src/index.css',
  'ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md',
  'backend/api/routes/register-new-patient-route.js', 'src/components/PatientIntake.tsx.pre-light-migration']);

function parseArgs(args) {
  assert.equal(args.length, 3, 'Explicit mode, token and full expected HEAD required');
  const [mode, token, head] = args;
  assert.ok(['prepare', 'prove'].includes(mode), 'Unknown execution mode');
  assert.equal(token, mode === 'prepare' ? 'ROBY_STAGE5_AUTH_PREPARE' : 'ROBY_STAGE5_AUTH_PROVE', 'Execution token mismatch');
  assert.match(head, /^[0-9a-f]{40}$/, 'Full expected commit required');
  return { mode, head };
}

function clusterPaths(home, prefix) {
  const root = path.resolve(home, 'vip-retrieve-proof-isolated');
  const data = path.join(root, 'data');
  const socket = path.join(root, 'socket');
  const historical = path.resolve(prefix, 'var/lib/postgresql');
  assert.notEqual(data, historical, 'Historical path prohibited');
  return { root, data, socket, port: 55439, database: DATABASE };
}

function validateMetadata(metadata, expected) {
  const lines = metadata.trimEnd().split('\n');
  assert.ok(/^[1-9][0-9]*$/.test(lines[0]), 'Invalid postmaster PID');
  assert.equal(lines[1], expected.data, 'Data directory mismatch');
  assert.equal(lines[3], String(expected.port), 'Port mismatch');
  assert.equal(lines[4], expected.socket, 'Socket mismatch');
  assert.equal(lines[5], '', 'TCP listener prohibited');
  assert.equal(lines[7]?.trim(), 'ready', 'Postmaster not ready');
  return lines[0];
}

function preflightCluster(expected) {
  for (const p of [expected.root, expected.data, expected.socket]) {
    assert.equal(fs.lstatSync(p).isSymbolicLink(), false, 'Proof directories cannot be symlinks');
    assert.equal(fs.realpathSync(p), p, 'Unexpected resolved proof path');
  }
  assert.equal(fs.readFileSync(path.join(expected.data, 'PG_VERSION'), 'utf8').trim(), '18');
  return validateMetadata(fs.readFileSync(path.join(expected.data, 'postmaster.pid'), 'utf8'), expected);
}

function validateIdentity(row, expected, database) {
  assert.equal(row.database, database);
  assert.equal(row.data_directory, expected.data);
  assert.equal(row.socket_directories, expected.socket);
  assert.equal(row.port, String(expected.port));
  assert.equal(row.listen_addresses, '');
  assert.equal(row.address, null);
  assert.equal(row.search_path, 'pg_catalog, public');
  assert.ok(Number(row.version) >= 180000 && Number(row.version) < 190000, 'PostgreSQL 18 required');
  assert.match(row.system_identifier, /^[0-9]+$/);
  return row.system_identifier;
}

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function git(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], { env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }, encoding: 'utf8' }).trimEnd();
}

function snapshot(repo) {
  return { head: git(repo, ['rev-parse','HEAD']), status: git(repo, ['status','--porcelain=v1','-z','--untracked-files=all']),
    diff: hash(git(repo, ['diff','--binary'])),
    index: hash(fs.readFileSync(path.resolve(repo, git(repo, ['rev-parse','--git-path','index'])))),
    protected: PROTECTED.map(p => [p, hash(fs.readFileSync(path.join(repo,p)))]) };
}

function preflightSource(repo, head) {
  assert.equal(git(repo, ['branch','--show-current']), 'main');
  assert.ok(['git@github.com:Mk-arch2030/ViP-Clinic-.git','https://github.com/Mk-arch2030/ViP-Clinic-.git',
    'ssh://git@github.com/Mk-arch2030/ViP-Clinic-.git'].includes(git(repo,['remote','get-url','origin'])), 'Repository origin mismatch');
  assert.equal(git(repo, ['rev-parse','HEAD']), head, 'HEAD mismatch');
  assert.equal(git(repo, ['diff','--cached','--name-only']), '', 'Staged changes prohibited');
  const files = git(repo, ['ls-tree','-r','--name-only',head]).split('\n').filter(p =>
    p.startsWith('backend/auth/') || ['backend/persistence/auth-schema.sql','backend/persistence/auth-repository.js',
      'backend/api/secured-patient-composition.js','backend/persistence/schema.sql','backend/persistence/patient-repository.js',
      'application/services/register-new-patient.js','application/services/retrieve-existing-patient.js',
      'domain/actor.js','domain/patient.js','backend/package.json','application/package.json','domain/package.json'].includes(p));
  assert.ok(files.includes('backend/auth/postgres-proof.cjs'), 'Proof runner must be committed');
  for (const p of files) {
    const committed = execFileSync('git', ['-C', repo,'show',head + ':' + p]);
    assert.equal(hash(fs.readFileSync(path.join(repo,p))), hash(committed), 'Source bytes mismatch: ' + p);
  }
}

module.exports = { DATABASE, PROTECTED, parseArgs, clusterPaths, validateMetadata, preflightCluster, validateIdentity,
  snapshot, preflightSource, hash };
