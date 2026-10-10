import test from 'node:test';
import assert from 'node:assert/strict';
import { createWebApi, ApiFailure, TEST_ORIGIN } from './web-api-client';
import { parsePatient } from './basic-patient';
const id = '55555555-5555-4555-8555-555555555555';
const csrf = 'A'.repeat(43);
const session = { actorIdentityReference:id,role:'Doctor',lifecycle:'ACTIVE',csrf };
const row = { patient_id:id,clinic_patient_number:'CPN-9001',name:'Synthetic',date_of_birth:'1990-02-01',
  profession:'Tester',phone:'00000000000',gender:'Male',age:36 };
const registration = { name:'Synthetic',dateOfBirth:'1990-02-01',profession:'Tester',phone:'00000000000',gender:'Male' as const };
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value),{ status,headers:{ 'Content-Type':'application/json' } });
function fake(work: (path: string, init: RequestInit) => Promise<Response> | Response) {
  return createWebApi({ origin:TEST_ORIGIN,fetcher:((path,init) => work(String(path),init!)) as typeof fetch });
}
test('HTTP, unexpected host/port and injected-origin configuration block before credential transmission', async () => {
  let calls=0;
  for (const origin of ['http://localhost:3000','http://127.0.0.1:3443','https://evil.test','https://127.0.0.1:3444']) {
    const api=createWebApi({ origin,fetcher:(async () => { calls++; return json(session); }) as typeof fetch });
    await assert.rejects(api.login('SYN/DOCTOR','synthetic password'),error => error instanceof ApiFailure && error.status===0);
    await assert.rejects(api.session());
  }
  assert.equal(calls,0);
});
test('status errors precede JSON parsing and expose no diagnostic body', async () => {
  for (const [status,kind] of [[401,'unauthorized'],[403,'forbidden'],[404,'not-found'],[400,'invalid'],[413,'invalid'],[415,'invalid'],[429,'throttled'],[503,'unavailable']] as const) {
    const api=fake(() => new Response('secret credential diagnostic',{ status,headers:{ 'Retry-After':'9999' } }));
    await assert.rejects(api.retrieve(id),error => error instanceof ApiFailure && error.status===status && error.kind===kind &&
      !error.message.includes('secret') && (status!==429 || error.retryAfter===900));
  }
});
test('network and malformed successful response fail generically without retry', async () => {
  for (const reply of [() => { throw new Error('private host'); },() => new Response('html'),() => new Response('{',{ headers:{ 'Content-Type':'application/json' } }),() => json({ ...session,role:'Admin' }),() => json({ ...session,lifecycle:'DEACTIVATED' }),() => json({ ...session,token:'secret' })]) {
    let calls=0;
    const api=fake(() => { calls++; return reply(); });
    await assert.rejects(api.session(),error => error instanceof ApiFailure && error.kind==='unavailable');
    assert.equal(calls,1);
  }
});
test('session resolves safe server identity; no token/role from browser is submitted', async () => {
  const seen: Array<{ path: string; init: RequestInit }> = [];
  const api=fake((path,init) => { seen.push({ path,init }); return json(path==='/auth/login'?{ authenticated:true }:session); });
  await api.login('syn/doctor','  synthetic password  ');
  assert.deepEqual(await api.session(),session);
  assert.deepEqual(JSON.parse(String(seen[0].init.body)),{ loginLabel:'syn/doctor',password:'  synthetic password  ' });
  assert.equal(seen[0].path,'/auth/login');
  for (const { init } of seen) {
    assert.equal(init.credentials,'same-origin'); assert.equal(init.cache,'no-store'); assert.equal(init.redirect,'error');
    assert.ok(!('Cookie' in init.headers!) && !('Origin' in init.headers!) && !('Authorization' in init.headers!));
  }
});
test('registration rejects role/identity/CPN/age/history and invalid dates before fetch', async () => {
  let calls=0;
  const api=fake(() => { calls++; return json(row,201); });
  for (const extra of ['role','actorId','clinicPatientNumber','age','pastHistory']) await assert.rejects(api.register({ ...registration,[extra]:'forged' },csrf));
  for (const dateOfBirth of ['1990-02-30','garbage','2999-01-01']) await assert.rejects(api.register({ ...registration,dateOfBirth },csrf));
  await assert.rejects(api.retrieve('../auth/session'));
  await assert.rejects(api.register(registration,'bad'));
  assert.equal(calls,0);
});
test('basic mapping preserves technical identity/null DOB and does not invent clinical data', () => {
  assert.equal(parsePatient(row).patientId,id);
  const patient=parsePatient({ ...row,date_of_birth:null,age:null });
  assert.equal(patient.age,null); assert.equal(patient.dateOfBirth,null);
  assert.equal('pastHistory' in patient,false); assert.equal('registeredAt' in patient,false);
  for (const bad of [{ ...row,patient_id:'CPN-9001' },{ ...row,age:-1 },{ ...row,date_of_birth:'1990-02-30' },{ ...row,pastHistory:{} },{ ...row,age:undefined }]) assert.throws(() => parsePatient(bad));
});
test('positive POST sends exact basic fields/current CSRF and consumes server UUID/CPN', async () => {
  const api=fake((path,init) => {
    assert.equal(path,'/patients'); assert.equal(init.method,'POST');
    assert.deepEqual(JSON.parse(String(init.body)),registration);
    assert.equal(new Headers(init.headers).get('X-CSRF-Token'),csrf);
    return json(row,201);
  });
  assert.equal((await api.register(registration,csrf)).clinicPatientNumber,'CPN-9001');
});
test('logout accepts 204 without JSON and sends CSRF; a redirect is not followed', async () => {
  const api=fake((path,init) => { assert.equal(path,'/auth/logout'); assert.equal(new Headers(init.headers).get('X-CSRF-Token'),csrf);
    assert.equal(init.body,'{}'); return new Response(null,{ status:204 }); });
  await api.logout(csrf);
  await assert.rejects(fake(() => new Response(null,{ status:302 })).logout(csrf));
});
