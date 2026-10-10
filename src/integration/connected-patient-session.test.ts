import test from 'node:test';
import assert from 'node:assert/strict';
import { ConnectedPatientSession } from './connected-patient-session';
import { ApiFailure, type WebApi, type ServerSession } from './web-api-client';
const id = 'a6000000-0000-4600-8600-000000000001';
const session: ServerSession = { actorIdentityReference:id, role:'Doctor', lifecycle:'ACTIVE', csrf:'A'.repeat(43) };
const patient = { patientId:id, clinicPatientNumber:'CPN-60001', name:'Synthetic', dateOfBirth:null, profession:'Tester', phone:'00000000000', gender:'Male' as const, age:null };
const draft = { name:'Synthetic', dateOfBirth:'1990-02-01', profession:'Tester', phone:'00000000000', gender:'Male' as const };
const api = (overrides: Partial<WebApi> = {}): WebApi => ({ session:async () => session, login:async () => {}, logout:async () => {}, retrieve:async () => patient, register:async () => patient, ...overrides });
test('missing-patient notice remains beside retrieval across automatic session reconciliation', async () => {
  let missing = false;
  const model = new ConnectedPatientSession(api({ retrieve:async () => { if (missing) throw new ApiFailure(404,'not-found'); return patient; } }));
  await model.refresh(); await model.retrieve(id); missing=true; await model.retrieve(id);
  assert.equal(model.getSnapshot().session.patient,null); assert.equal(model.getSnapshot().notice?.kind,'not-found');
  await model.refresh(); assert.equal(model.getSnapshot().session.session?.role,'Doctor');
  assert.deepEqual(model.getSnapshot().notice,{ operation:'retrieve', kind:'not-found' });
  missing=false; await model.retrieve(id); assert.equal(model.getSnapshot().notice,null); assert.equal(model.getSnapshot().session.patient,patient);
});
test('notice is cleared when current persisted identity changes or session expires', async () => {
  let current = session, expired = false;
  const model = new ConnectedPatientSession(api({ session:async () => { if (expired) throw new ApiFailure(401,'unauthorized'); return current; }, retrieve:async () => { throw new ApiFailure(404,'not-found'); } }));
  await model.refresh(); await model.retrieve(id);
  current = { ...session, actorIdentityReference:'a6000000-0000-4600-8600-000000000002' };
  await model.refresh(); assert.equal(model.getSnapshot().notice,null);
  await model.retrieve(id); expired=true; await model.refresh();
  assert.equal(model.getSnapshot().notice,null); assert.equal(model.getSnapshot().session.session,null);
});
test('Nurse session cannot enable either patient operation; no invented clinical fields or mock fallback', async () => {
  let writes=0, reads=0;
  const model = new ConnectedPatientSession(api({ session:async () => ({ ...session, role:'Nurse' }), retrieve:async () => { reads++; return patient; }, register:async () => { writes++; return patient; } }));
  await model.refresh(); await model.retrieve(id); await model.register(draft);
  assert.equal(reads,0); assert.equal(writes,0); assert.equal(model.getSnapshot().notice?.kind,'forbidden');
  const doctor = new ConnectedPatientSession(api()); await doctor.refresh(); await doctor.retrieve(id);
  assert.equal(doctor.getSnapshot().session.patient?.dateOfBirth,null);
  assert.equal(Object.hasOwn(doctor.getSnapshot().session.patient!, 'pastHistory'),false);
});
test('pending registration stays owned by the mounted session and suppresses submit/logout/reconcile', async () => {
  let resolve!: (value:typeof patient) => void, writes=0, logouts=0;
  const pending = new Promise<typeof patient>(yes => { resolve=yes; });
  const model = new ConnectedPatientSession(api({ register:async () => { writes++; return pending; }, logout:async () => { logouts++; } }));
  await model.refresh(); const work=model.register(draft); await model.register(draft); await model.logout(); await model.refresh();
  assert.equal(writes,1); assert.equal(logouts,0); assert.equal(model.getSnapshot().session.busy,true);
  resolve(patient); await work; assert.equal(model.getSnapshot().session.patient,patient);
});
test('unknown registration outcome blocks retries even after session reconciliation', async () => {
  let writes=0;
  const model = new ConnectedPatientSession(api({ register:async () => { writes++; throw new ApiFailure(0,'unavailable'); } }));
  await model.refresh(); await model.register(draft); await model.refresh(); await model.register(draft);
  assert.equal(writes,1); assert.equal(model.getSnapshot().session.registrationUnconfirmed,true);
});
