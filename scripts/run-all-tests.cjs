'use strict';

const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HISTORICAL = 'src/services/clinic-authority-p37a.test.ts';
function selectTests(tracked) {
  return tracked.split('\0').filter(name => /test\.(js|cjs|ts|tsx)$/.test(name) && name !== HISTORICAL).sort();
}

function run() {
  let directory;
  try {
    if (process.argv.length !== 2) throw new Error('Unexpected arguments');
    const root = path.resolve(__dirname, '..');
    const options = { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } };
    const gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], options).trim();
    if (fs.realpathSync(gitRoot) !== fs.realpathSync(root)) throw new Error('Repository root mismatch');
    const tests = selectTests(execFileSync('git', ['ls-files', '-z'], options));
    if (!tests.length) throw new Error('No tracked test files found');
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'roby-run-all-'));
    const log = path.join(directory, 'tests.log');
    const fd = fs.openSync(log, 'wx', 0o600);
    let result;
    try {
      result = spawnSync(process.execPath, ['--import', 'tsx', '--test', '--test-reporter=tap', ...tests], {
        cwd: root, stdio: ['ignore', fd, fd], env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }
      });
    } finally { fs.closeSync(fd); }
    const summary = fs.readFileSync(log, 'utf8').split(/\r?\n/).filter(line => /^# (tests|pass|fail|cancelled|skipped|todo|duration_ms) /.test(line));
    for (const line of summary) console.log(line.replace(/^# /, 'ℹ '));
    const code = result.error || result.signal || result.status === null ? 1 : result.status;
    const complete = summary.some(line => /^# tests [1-9]\d*$/.test(line));
    const exit = code || (complete ? 0 : 1);
    console.log('RUN_ALL=' + (exit === 0 ? 'PASS' : 'FAILED'));
    console.log('REGRESSION_EXIT=' + exit);
    console.log('EXCLUDED_HISTORICAL=' + HISTORICAL);
    console.log('FULL_LOG=' + log);
    process.exitCode = exit;
  } catch (error) {
    console.error('RUN_ALL=STOPPED');
    console.error('ERROR=' + error.message);
    if (directory) console.error('LOG_DIRECTORY=' + directory);
    process.exitCode = 1;
  }
}

module.exports = { selectTests, run };
if (require.main === module) run();
