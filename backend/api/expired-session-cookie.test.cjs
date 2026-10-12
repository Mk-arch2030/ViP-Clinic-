const test=require('node:test'),assert=require('node:assert/strict');
const Fastify=require('fastify');
const {clearRejectedSession,CLEAR_COOKIE}=require('./expired-session-cookie.cjs');
const {composeSecuredPatients}=require('./secured-patient-composition');
const {makeHarness}=require('../auth/test-harness.cjs');
const {login,password}=require('../auth/test-service-contract.cjs');
const origin='https://127.0.0.1:3443';
test('expired session blocks valid-password login until bootstrap clears its HttpOnly cookie',async t=>{
 const h=makeHarness();const app=Fastify();t.after(()=>app.close());app.addHook('onSend',clearRejectedSession);await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:origin});
 const {token}=await login(h);h.advance(16*60*1000);
 const headers={origin,'content-type':'application/json',cookie:'__Host-vip_session='+token};
 const payload={loginLabel:'SYN/DOCTOR',password};
 const trapped=await app.inject({method:'POST',url:'/auth/login',headers,payload});assert.equal(trapped.statusCode,401);assert.equal(trapped.headers['set-cookie'],undefined);
 const bootstrap=await app.inject({url:'/auth/session',headers});assert.equal(bootstrap.statusCode,401);assert.equal(bootstrap.headers['set-cookie'],CLEAR_COOKIE);
 const {cookie,...clean}=headers;const retry=await app.inject({method:'POST',url:'/auth/login',headers:clean,payload});assert.equal(retry.statusCode,200);assert.match(retry.headers['set-cookie'],/Secure; HttpOnly; SameSite=Strict/);
});
test('cookie recovery does not clear a valid session or failed-password login; expiry logout can clear invalid cookie',async t=>{
 const h=makeHarness();const app=Fastify();t.after(()=>app.close());app.addHook('onSend',clearRejectedSession);await composeSecuredPatients(app,{auth:h.auth,trustedOrigin:origin});
 const {token}=await login(h);const headers={origin,'content-type':'application/json',cookie:'__Host-vip_session='+token};
 const current=await app.inject({url:'/auth/session',headers});assert.equal(current.statusCode,200);assert.equal(current.headers['set-cookie'],undefined);
 const bad=await app.inject({method:'POST',url:'/auth/login',headers,payload:{loginLabel:'SYN/DOCTOR',password:'synthetic wrong password'}});assert.equal(bad.statusCode,401);assert.equal(bad.headers['set-cookie'],undefined);
 h.advance(16*60*1000);const logout=await app.inject({method:'POST',url:'/auth/logout',headers,payload:{}});assert.equal(logout.statusCode,401);assert.equal(logout.headers['set-cookie'],CLEAR_COOKIE);
});
