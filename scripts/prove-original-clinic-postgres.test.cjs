const test=require('node:test'),assert=require('node:assert/strict');
const {prove}=require('./prove-original-clinic-postgres.cjs');
test('synthetic PostgreSQL proof rejects missing arguments and wrong token before resource access',async()=>{
 await assert.rejects(prove([]));
 await assert.rejects(prove(['WRONG','/nonexistent/socket','/nonexistent/data','nobody']));
});
