const test = require('node:test');
const assert = require('node:assert/strict');
const { parseArgs, clusterPaths, validateMetadata, validateIdentity, DATABASE } = require('./postgres-proof-guards.cjs');
const expected = clusterPaths('/synthetic/home', '/synthetic/usr');
const metadata = ['1234',expected.data,'1800000000','55439',expected.socket,'','12345','ready',''].join('\n');
const identity = { database: DATABASE, data_directory: expected.data, socket_directories: expected.socket,
  port: '55439', listen_addresses: '', address: null, search_path: 'pg_catalog, public', version: '180004', system_identifier: '123456789' };

test('explicit mode, matching token and full HEAD are required', () => {
  assert.equal(parseArgs(['prove','ROBY_STAGE5_AUTH_PROVE','a'.repeat(40)]).mode, 'prove');
  assert.equal(parseArgs(['resume-empty','ROBY_STAGE5_AUTH_RESUME_EMPTY','a'.repeat(40)]).mode, 'resume-empty');
  assert.throws(() => parseArgs(['resume-empty','ROBY_STAGE5_AUTH_PREPARE','a'.repeat(40)]));
  for (const args of [[], ['prove'], ['prove','ROBY_STAGE5_AUTH_PREPARE','a'.repeat(40)], ['prove','ROBY_STAGE5_AUTH_PROVE','short'],
    ['prove','ROBY_STAGE5_AUTH_PROVE','a'.repeat(40),'extra']]) assert.throws(() => parseArgs(args));
});

const emptyState = { current_user_owns_database: true, public_create_allowed: true, auth_schema_exists: false,
  public_relations: 0, public_functions: 0, public_types: 0, other_user_schemas: 0, unexpected_extensions: 0 };

test('empty resume rejects existing auth, any user object, unexpected extension or missing owner/privilege', () => {
  const { validateEmptyAuthDatabase } = require('./postgres-proof-guards.cjs');
  validateEmptyAuthDatabase(emptyState);
  for (const [key,value] of Object.entries(emptyState)) {
    const invalid = typeof value === 'boolean' ? !value : 1;
    assert.throws(() => validateEmptyAuthDatabase({ ...emptyState, [key]: invalid }));
    assert.throws(() => validateEmptyAuthDatabase({ ...emptyState, [key]: undefined }));
  }
});

test('synthetic initialization guards before DDL and targets public only for the unchanged base schema', async () => {
  const { initializeSyntheticDatabase } = require('./postgres-proof.cjs');
  const calls = [];
  const client = { async query(sql, params) {
    calls.push({ sql, params });
    return { rows: sql.includes('AS current_user_owns_database') ? [emptyState] : [] };
  } };
  const readSchema = filename => filename.endsWith('/auth-schema.sql') ? 'AUTH_DDL' : 'BASE_DDL';
  await initializeSyntheticDatabase(client,'/repo','a'.repeat(40),'7694773229923891271',readSchema);
  const queries = calls.map(call => call.sql);
  assert.deepEqual(queries.slice(3,7), ['SET LOCAL search_path = public','BASE_DDL',
    'SET LOCAL search_path = pg_catalog, public','AUTH_DDL']);
  assert.equal(queries[0],'BEGIN');
  assert.equal(queries[1],'SELECT pg_advisory_xact_lock(76551005)');
  assert.match(queries[2], /AS current_user_owns_database/);
  assert.equal(queries.at(-1),'COMMIT');
  assert.deepEqual(calls.find(call => call.sql.startsWith('INSERT INTO vip_auth.proof_manifest')).params,
    ['a'.repeat(40),'7694773229923891271']);
  assert.ok(queries.every(sql => !/DROP|GRANT|TRUNCATE|ALTER ROLE|ALTER DATABASE/.test(sql)));
});

test('nonempty state rolls back before DDL; DDL or fixture failure rolls back without committing', async () => {
  const { initializeSyntheticDatabase } = require('./postgres-proof.cjs');
  for (const failure of ['guard','BASE_DDL','AUTH_DDL','INSERT INTO public.actors']) {
    const queries = [];
    const client = { async query(sql) {
      queries.push(sql);
      if (failure !== 'guard' && sql.startsWith(failure)) throw new Error('synthetic failure');
      return { rows: sql.includes('AS current_user_owns_database') ?
        [{ ...emptyState, public_relations: failure === 'guard' ? 1 : 0 }] : [] };
    } };
    await assert.rejects(initializeSyntheticDatabase(client,'/repo','a'.repeat(40),'7694773229923891271',
      filename => filename.endsWith('/auth-schema.sql') ? 'AUTH_DDL' : 'BASE_DDL'));
    assert.equal(queries.at(-1),'ROLLBACK');
    assert.ok(!queries.includes('COMMIT'));
    if (failure === 'guard') assert.ok(!queries.some(sql => sql.startsWith('SET LOCAL')));
  }
});

test('cluster paths are fixed to the prior isolated cluster and a new database', () => {
  assert.equal(expected.database, 'roby_auth_proof_stage5');
  assert.notEqual(expected.database, 'roby_retrieve_proof_c');
  assert.equal(expected.port, 55439);
  assert.equal(expected.data, '/synthetic/home/vip-retrieve-proof-isolated/data');
});

test('ready metadata is accepted; historical/wrong directory, TCP, socket and port reject', () => {
  assert.equal(validateMetadata(metadata, expected), '1234');
  for (const [index, value] of [[1,'/synthetic/usr/var/lib/postgresql'],[3,'5432'],[4,'/tmp'],[5,'*'],[7,'starting']]) {
    const lines = metadata.split('\n'); lines[index] = value;
    assert.throws(() => validateMetadata(lines.join('\n'), expected));
  }
});

test('server identity requires the exact isolated Unix connection and PostgreSQL 18', () => {
  assert.equal(validateIdentity(identity, expected, DATABASE), '123456789');
  for (const [key,value] of [['database','roby_retrieve_proof_c'],['data_directory','historical'],['socket_directories','/tmp'],
    ['port','5432'],['listen_addresses','localhost'],['address','127.0.0.1'],['search_path','public'],['version','170000']]) {
    assert.throws(() => validateIdentity({ ...identity,[key]:value }, expected, DATABASE));
  }
});

test('proof import loads no database or HTTP driver and performs no execution', () => {
  const { spawnSync } = require('node:child_process');
  const modulePath = require('node:path').join(__dirname,'postgres-proof.cjs');
  const probe = spawnSync(process.execPath,['-e',`
    const Module = require('node:module');
    const original = Module._load;
    Module._load = function(request,parent,isMain) {
      if (['pg','fastify'].includes(request)) throw new Error('driver loaded on import');
      return original.call(this,request,parent,isMain);
    };
    require(${JSON.stringify(modulePath)});
  `],{encoding:'utf8',timeout:5000});
  assert.equal(probe.status,0,probe.stderr);
});

test('the runner-configured search path passes the guard with or without separator spaces', () => {
  const { connectionOptions } = require('./postgres-proof.cjs');
  const configured = connectionOptions(expected, DATABASE).options.match(/search_path=([^ ]+)/)[1];
  for (const search_path of [configured, 'pg_catalog, public', ' pg_catalog , public ']) {
    assert.equal(validateIdentity({ ...identity, search_path }, expected, DATABASE), '123456789');
  }
});

test('normalizing separator spaces does not permit extra schemas, reordered entries or malformed paths', () => {
  for (const search_path of [null, ['pg_catalog','public'], 'public,pg_catalog', 'pg_catalog,public,pg_temp',
    'pg_catalog,public,', 'pg_catalog,$user,public', 'pg_catalog,public,public', '']) {
    assert.throws(() => validateIdentity({ ...identity, search_path }, expected, DATABASE));
  }
});
