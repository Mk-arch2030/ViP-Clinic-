'use strict';
const fs=require('node:fs'),path=require('node:path');
const {TOKEN,FixtureError,requireTrue,validateConfig}=require('./safety.cjs');
function readJson(file){requireTrue(path.isAbsolute(file),'ABSOLUTE_FILE_REQUIRED');const stat=fs.lstatSync(file);requireTrue(stat.isFile()&&!stat.isSymbolicLink()&&stat.size<128*1024,'REGULAR_BOUNDED_FILE_REQUIRED');return JSON.parse(fs.readFileSync(file,'utf8'));}
async function main(args=process.argv.slice(2)){
 requireTrue(args.length===4,'EXPLICIT_MODE_TOKEN_CONFIG_AND_PLAN_REQUIRED');const [mode,token,configFile,planFile]=args;
 requireTrue(['dry-run','load','verify'].includes(mode),'UNKNOWN_MODE');
 requireTrue(token===TOKEN,'AUTHORIZATION_REQUIRED');const config=validateConfig(readJson(configFile),token);
 for(const dir of [config.dataDirectory,config.socketDirectory]){requireTrue(fs.realpathSync(dir)===dir&&!fs.lstatSync(dir).isSymbolicLink(),'TARGET_SYMLINK_REFUSED');}
 require('../dataset.cjs').loadDataset(); // Integrity must pass before loading the driver or contacting a database.
 const {Pool}=require('pg');const pool=new Pool({host:config.socketDirectory,port:config.port,database:config.database,user:config.user,password:'',ssl:false,max:1,connectionTimeoutMillis:5000,
  options:'-c search_path=pg_catalog,public -c statement_timeout=10000 -c lock_timeout=5000'});
 try{const client=await pool.connect();try{
  const plan=mode==='load'?readJson(planFile):undefined;
  const result=await require('./core.cjs').run(client,config,mode,plan,token);
  if(mode==='dry-run'){requireTrue(path.isAbsolute(planFile),'ABSOLUTE_PLAN_REQUIRED');const fd=fs.openSync(planFile,fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_NOFOLLOW,0o600);try{fs.writeFileSync(fd,JSON.stringify(result,null,2)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
  console.log(JSON.stringify(result,null,2));return result;
 }finally{client.release();}}finally{await pool.end();}
}
if(require.main===module)main().catch(error=>{console.error('FIXTURE_LOADER=REFUSED_OR_FAILED');console.error('ERROR_CODE='+(error instanceof FixtureError?error.code:'DATABASE_OR_FILESYSTEM_OPERATION_FAILED'));process.exitCode=1;});
module.exports={main};
