'use strict';

// Stage 8 synthetic acceptance database identity guard.
// Read-only. Never creates, migrates, resets or seeds a database.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');


function loadStage8Identity() {
  const vaultPath = path.join(
    require('os').homedir(),
    '.roby-stage8-private',
    'acceptance-identity.json'
  );

  const directory = path.dirname(vaultPath);
  const dirStat = fs.lstatSync(directory);
  const stat = fs.lstatSync(vaultPath);

  assert.ok(dirStat.isDirectory() && !dirStat.isSymbolicLink());
  assert.equal(dirStat.mode & 0o077, 0);
  assert.ok(stat.isFile() && !stat.isSymbolicLink());
  assert.equal(stat.mode & 0o077, 0);

  const identity = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
  const fields = ['database', 'systemId', 'port', 'doctorId'];

  assert.deepEqual(Object.keys(identity).sort(), fields.sort());

  for (const field of fields) {
    assert.equal(typeof identity[field], 'string');
    assert.ok(identity[field].length > 0);
  }

  return Object.freeze(identity);
}

const EXPECTED = loadStage8Identity();

async function verifyStage8Database(pool, paths) {
  assert.ok(pool && typeof pool.connect === 'function');
  assert.ok(paths && typeof paths === 'object');

  for (const name of ['dataDirectory', 'socketDirectory']) {
    const value = paths[name];
    assert.equal(typeof value, 'string');
    assert.ok(path.isAbsolute(value));
    assert.ok(!fs.lstatSync(value).isSymbolicLink());
    assert.equal(fs.realpathSync(value), value);
  }

  const client = await pool.connect();
  let begun = false;

  try {
    await client.query('BEGIN READ ONLY');
    begun = true;

    const result = await client.query(`
      SELECT current_database() AS database,
        current_setting('data_directory') AS data_directory,
        current_setting('unix_socket_directories') AS socket_directory,
        current_setting('port') AS port,
        current_setting('listen_addresses') AS listen_addresses,
        inet_server_addr()::text AS tcp_address,
        (pg_control_system()).system_identifier::text AS system_id
    `);

    assert.equal(result.rows.length, 1);
    const state = result.rows[0];

    assert.equal(state.database, EXPECTED.database);
    assert.equal(state.system_id, EXPECTED.systemId);
    assert.equal(state.port, EXPECTED.port);
    assert.equal(state.listen_addresses, '');
    assert.equal(state.tcp_address, null);
    assert.equal(
      fs.realpathSync(state.data_directory),
      paths.dataDirectory
    );
    assert.equal(state.socket_directory, paths.socketDirectory);

    const doctor = await client.query(`
      SELECT a.actor_id::text AS actor_id,
        a.actor_role, a.lifecycle_state,
        count(c.actor_id)::integer AS enabled_credentials
      FROM public.actors a
      LEFT JOIN vip_auth.credentials c
        ON c.actor_id = a.actor_id AND c.enabled = true
      WHERE a.actor_id = $1
      GROUP BY a.actor_id, a.actor_role, a.lifecycle_state
    `, [EXPECTED.doctorId]);

    assert.equal(doctor.rows.length, 1);
    assert.equal(doctor.rows[0].actor_id, EXPECTED.doctorId);
    assert.equal(doctor.rows[0].actor_role, 'DOCTOR');
    assert.equal(doctor.rows[0].lifecycle_state, 'ACTIVE');
    assert.equal(doctor.rows[0].enabled_credentials, 1);

    const tables = await client.query(`
      SELECT
        to_regclass('vip_clinical.cases') IS NOT NULL AS cases,
        to_regclass('vip_clinical.operation_receipts') IS NOT NULL AS receipts,
        to_regclass('vip_clinical.visits') IS NOT NULL AS visits,
        to_regclass('vip_auth.sessions') IS NOT NULL AS sessions
    `);

    assert.deepEqual(tables.rows[0], {
      cases: true,
      receipts: true,
      visits: true,
      sessions: true
    });

    await client.query('COMMIT');
    begun = false;

    return Object.freeze({
      database: state.database,
      systemId: state.system_id,
      doctorId: EXPECTED.doctorId
    });
  } finally {
    if (begun) {
      await client.query('ROLLBACK').catch(() => {});
    }
    client.release();
  }
}

module.exports = { EXPECTED, verifyStage8Database };
