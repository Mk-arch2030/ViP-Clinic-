import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionCoordinator } from './session-coordinator';
import { ApiFailure, type WebApi, type ServerSession } from './web-api-client';
const id='55555555-5555-4555-8555-555555555555';
const session: ServerSession={ actorIdentityReference:id,role:'Doctor',lifecycle:'ACTIVE',csrf:'A'.repeat(43) };
const patient={ patientId:id,clinicPatientNumber:'CPN-9001',name:'Synthetic',dateOfBirth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male' as const,age:36 };
const registration={ name:'Synthetic',dateOfBirth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male' as const };
function api(overrides: Partial<WebApi> = {}): WebApi { return { session:async () => session,login:async () => {},logout:async () => {},retrieve:async () => patient,register:async () => patient,...overrides }; }
function deferred<T>() { let resolve!: (value:T) => void; let reject!: (reason:unknown) => void; const promise=new Promise<T>((yes,no) => { resolve=yes;reject=no; }); return { promise,resolve,reject }; }
test('boot/reopen starts checking and cannot use any remembered browser identity', async () => {
  const pending=deferred<ServerSession>(); let reads=0;
  const c=new SessionCoordinator(api({ session:() => pending.promise,retrieve:async () => { reads++;return patient; } }));
  assert.equal(c.getSnapshot().state,'checking');
  await c.retrieve(id); assert.equal(reads,0);
  const checking=c.refresh(); assert.equal(c.getSnapshot().session,null);
  pending.resolve(session); await checking; assert.equal(c.getSnapshot().session?.role,'Doctor');
});
test('login success alone cannot establish identity; bootstrap failure denies', async () => {
  const c=new SessionCoordinator(api({ session:async () => { throw new ApiFailure(401,'unauthorized'); } }));
  await c.login('SYN/DOCTOR','synthetic password');
  assert.equal(c.getSnapshot().state,'unauthenticated'); assert.equal(c.getSnapshot().session,null);
});
test('401 clears prior identity, CSRF and Patient; 403 retains identity but blocks mutation', async () => {
  for (const status of [401,403]) {
    let fail=false;
    const c=new SessionCoordinator(api({ retrieve:async () => { if (fail) throw new ApiFailure(status,status===401?'unauthorized':'forbidden'); return patient; } }));
    await c.refresh(); await c.retrieve(id); fail=true; await c.retrieve(id);
    assert.equal(c.getSnapshot().patient,null); assert.equal(c.getSnapshot().mutationsBlocked,true);
    assert.equal(c.getSnapshot().session,status===401?null:session);
  }
});
test('404 clears old result without logout or mock fallback', async () => {
  let missing=false;
  const c=new SessionCoordinator(api({ retrieve:async () => { if (missing) throw new ApiFailure(404,'not-found'); return patient; } }));
  await c.refresh(); await c.retrieve(id); missing=true; await c.retrieve(id);
  assert.equal(c.getSnapshot().patient,null); assert.equal(c.getSnapshot().state,'authenticated'); assert.equal(c.getSnapshot().failure,'not-found');
});
test('late GET across logout/relogin cannot repopulate identity or Patient even if abort is ignored', async () => {
  const pending=deferred<typeof patient>();
  const c=new SessionCoordinator(api({ retrieve:() => pending.promise }));
  await c.refresh(); const read=c.retrieve(id); await c.logout();
  await c.login('SYN/DOCTOR','synthetic password'); pending.resolve(patient); await read;
  assert.equal(c.getSnapshot().patient,null); assert.equal(c.getSnapshot().state,'authenticated');
});
test('logout failure remains unconfirmed and blocks new login; explicit server reconciliation is required', async () => {
  let logins=0;
  const c=new SessionCoordinator(api({ logout:async () => { throw new ApiFailure(0,'unavailable'); },login:async () => { logins++; } }));
  await c.refresh(); await c.logout(); await c.login('SYN/DOCTOR','synthetic password');
  assert.equal(c.getSnapshot().state,'unavailable'); assert.equal(c.getSnapshot().logoutUnconfirmed,true); assert.equal(logins,0);
  await c.refresh(); assert.equal(c.getSnapshot().state,'authenticated'); assert.equal(c.getSnapshot().logoutUnconfirmed,false);
});
test('concurrent submit is suppressed; pending mutation cannot be canceled by logout/reconcile', async () => {
  const pending=deferred<typeof patient>(); let writes=0;let logouts=0;
  const c=new SessionCoordinator(api({ register:() => { writes++;return pending.promise; },logout:async () => { logouts++; } }));
  await c.refresh(); const write=c.register(registration); await c.register(registration); await c.logout(); await c.refresh();
  assert.equal(writes,1); assert.equal(logouts,0); pending.resolve(patient);await write;
  assert.equal(c.getSnapshot().patient,patient);
});
test('lost POST result is outcome unknown with no retry; read outage is unavailable', async () => {
  let writes=0;
  const c=new SessionCoordinator(api({ register:async () => { writes++; throw new ApiFailure(0,'unavailable'); } }));
  await c.refresh(); await c.register(registration); await c.register(registration);
  assert.equal(writes,1); assert.equal(c.getSnapshot().failure,'outcome-unknown'); assert.equal(c.getSnapshot().patient,null);
  await c.refresh(); await c.register(registration);
  assert.equal(writes,1);assert.equal(c.getSnapshot().registrationUnconfirmed,true);
  const d=new SessionCoordinator(api({ session:async () => { throw new ApiFailure(503,'unavailable'); } }));
  await d.refresh(); assert.equal(d.getSnapshot().state,'unavailable'); assert.equal(d.getSnapshot().failure,'unavailable');
});
test('dispose prevents late success; bootstrap and login requests have no parallel session issuance', async () => {
  const pending=deferred<ServerSession>();let logins=0;
  const c=new SessionCoordinator(api({ session:() => pending.promise,login:async () => { logins++; } }));
  const refresh=c.refresh(); await c.login('SYN/DOCTOR','synthetic password');assert.equal(logins,0);
  c.dispose();pending.resolve(session);await refresh;assert.equal(c.getSnapshot().session,null);
});
