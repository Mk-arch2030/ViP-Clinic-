'use strict';
const path=require('node:path');
const TOKEN='ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1';
const DATABASE='roby_fixture_disposable_v1';
const NAMESPACE='ROBY_GOLDEN_V1_EXTENDED_V1';
class FixtureError extends Error{constructor(code){super(code);this.name='FixtureError';this.code=code;}}
function requireTrue(value,code){if(!value)throw new FixtureError(code);}
function validateConfig(config,token,env=process.env){
 requireTrue(token===TOKEN,'AUTHORIZATION_REQUIRED');
 requireTrue(config&&typeof config==='object'&&!Array.isArray(config),'EXPLICIT_CONFIG_REQUIRED');
 const keys=['database','port','user','dataDirectory','socketDirectory','systemId','namespace'];
 requireTrue(Object.keys(config).length===keys.length&&Object.keys(config).every(k=>keys.includes(k)),'AMBIGUOUS_CONFIGURATION');
 requireTrue(!Object.keys(env).some(k=>(k==='DATABASE_URL'||k.startsWith('PG'))&&env[k]),'AMBIENT_DATABASE_CONFIGURATION_REFUSED');
 requireTrue(config.database===DATABASE,'DISPOSABLE_DATABASE_REQUIRED');
 requireTrue(config.port===55449,'DISPOSABLE_PORT_REQUIRED');
 requireTrue(typeof config.user==='string'&&/^[A-Za-z_][A-Za-z0-9_-]{0,62}$/.test(config.user),'EXPLICIT_OS_USER_REQUIRED');
 requireTrue(typeof config.systemId==='string'&&/^[1-9][0-9]{8,19}$/.test(config.systemId)&&!['7695362409703475295','7694773229923891271'].includes(config.systemId),'NEW_CLUSTER_IDENTITY_REQUIRED');
 requireTrue(config.namespace===NAMESPACE,'EXPLICIT_FIXTURE_NAMESPACE_REQUIRED');
 for(const key of ['dataDirectory','socketDirectory'])requireTrue(typeof config[key]==='string'&&path.isAbsolute(config[key])&&path.resolve(config[key])===config[key],'EXPLICIT_LOCAL_TARGET_REQUIRED');
 const root=path.dirname(config.dataDirectory);
 requireTrue(/^roby-golden-fixtures-disposable(?:-[A-Za-z0-9]+)?$/.test(path.basename(root))&&path.basename(config.dataDirectory)==='data'&&config.socketDirectory===path.join(root,'socket'),'DISPOSABLE_DIRECTORY_BOUNDARY_REQUIRED');
 return config;
}
function validateIdentity(row,config){
 for(const [key,value]of Object.entries({database:config.database,data_directory:config.dataDirectory,sockets:config.socketDirectory,port:String(config.port),system_id:config.systemId,tcp:'',address:null,owns:true}))requireTrue(row?.[key]===value,'DATABASE_IDENTITY_MISMATCH');
 // PostgreSQL retains GUC whitespace. Compare the exact two unquoted schema
 // names in order, allowing only whitespace around comma-delimited names.
 requireTrue(typeof row?.search_path==='string'&&row.search_path.split(',').map(name=>name.trim()).join(',')==='pg_catalog,public','DATABASE_IDENTITY_MISMATCH');
 requireTrue(Number(row.version)>=180000&&Number(row.version)<190000,'POSTGRESQL_18_REQUIRED');
}
module.exports={TOKEN,DATABASE,NAMESPACE,FixtureError,requireTrue,validateConfig,validateIdentity};
