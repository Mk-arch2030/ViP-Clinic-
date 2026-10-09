const test = require('node:test');
const assert = require('node:assert/strict');
const { parseArgs, clusterPaths, validateMetadata, validateIdentity, DATABASE } = require('./postgres-proof-guards.cjs');
const expected = clusterPaths('/synthetic/home', '/synthetic/usr');
const metadata = ['1234',expected.data,'1800000000','55439',expected.socket,'','12345','ready',''].join('\n');
const identity = { database: DATABASE, data_directory: expected.data, socket_directories: expected.socket,
  port: '55439', listen_addresses: '', address: null, search_path: 'pg_catalog, public', version: '180004', system_identifier: '123456789' };

test('explicit mode, matching token and full HEAD are required', () => {
  assert.equal(parseArgs(['prove','ROBY_STAGE5_AUTH_PROVE','a'.repeat(40)]).mode, 'prove');
  for (const args of [[], ['prove'], ['prove','ROBY_STAGE5_AUTH_PREPARE','a'.repeat(40)], ['prove','ROBY_STAGE5_AUTH_PROVE','short'],
    ['prove','ROBY_STAGE5_AUTH_PROVE','a'.repeat(40),'extra']]) assert.throws(() => parseArgs(args));
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
