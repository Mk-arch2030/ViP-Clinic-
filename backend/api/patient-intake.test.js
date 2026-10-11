const test = require('node:test');
const assert = require('node:assert/strict');
const Fastify = require('fastify');
const { composeSecuredPatients } = require('./secured-patient-composition');
const { makeHarness } = require('../auth/test-harness.cjs');
const { login, DOCTOR } = require('../auth/test-service-contract.cjs');
const { intakeBody } = require('./patient-intake');
const { registrationBody } = require('./secured-patient-composition');
const origin = 'https://vip.synthetic.invalid';
const history = { chronicIllnesses: ['ضغط', 'Diabetes'], knownAllergies: ['Penicillin'], surgicalHistory: [], familyHistory: ['CAD'], lifestyleNotes: 'No smoking' };
const payload = { name: 'Synthetic Intake', dateOfBirth: '1990-02-01', profession: '', phone: '0000', gender: 'Male', pastHistory: history };
const empty = { chronicIllnesses: [], knownAllergies: [], surgicalHistory: [], familyHistory: [], lifestyleNotes: '' };
async function setup(t) {
  const h = makeHarness();
  let data = { patients: [], markers: [], items: [] };
  const calls = [];
  let failOn = null;
  h.store.client = { async query(sql, p = []) {
    calls.push(sql);
    if (failOn && sql.includes(failOn)) throw new Error('private database detail');
    if (sql.includes('nextval')) return { rows: [{ clinic_patient_number: 'CPN-20' }] };
    if (sql.includes('INSERT INTO patients')) {
      const row = Object.fromEntries(['patient_id','clinic_patient_number','name','date_of_birth','profession','phone','gender'].map((key,i) => [key,p[i]]));
      data.patients.push(row); return { rows: [row] };
    }
    if (sql.includes('INSERT INTO patient_intakes')) data.markers.push(p[0]);
    if (sql.includes('INSERT INTO past_history_items')) data.items.push({ item_id:p[0], patient_id:p[1], category:p[2], position:p[3], content:p[4] });
    if (sql.includes('FROM patients')) return { rows: data.patients.filter(row => row.patient_id === p[0]) };
    if (sql.includes('FROM patient_intakes')) return { rows: data.markers.includes(p[0]) ? [{patient_id:p[0]}] : [] };
    if (sql.includes('FROM past_history_items')) return { rows: data.items.filter(row => row.patient_id === p[0]) };
    return { rows: [] };
  } };
  // Simulate the production auth store's transaction boundary, including COMMIT failure.
  const original = h.store.transaction.bind(h.store);
  h.store.transaction = async work => {
    const before = structuredClone(data);
    try { const result = await original(work); if (failOn === 'OUTER_COMMIT') throw new Error('commit failed'); return result; }
    catch (error) { data = before; throw error; }
  };
  const app = Fastify();
  await composeSecuredPatients(app, { auth:h.auth, trustedOrigin:origin });
  t.after(() => app.close());
  const session = await login(h);
  const csrf = (await h.auth.current(session.token)).csrf;
  const headers = { origin, 'content-type':'application/json', cookie:'__Host-vip_session='+session.token, 'x-csrf-token':csrf };
  return { ...h, app, calls, headers, data:() => data, fail:value => { failOn=value; },
    post: (body=payload, custom=headers) => app.inject({ method:'POST',url:'/patients/intake',headers:custom,payload:body }) };
}
test('intake validates complete history and rejects forged identities, oversized fields and impossible dates', () => {
  assert.deepEqual(intakeBody(payload,registrationBody),payload);
  for (const body of [{...payload,pastHistory:undefined}, {...payload,role:'Doctor'}, {...payload,patientId:'forged'},
    {...payload,dateOfBirth:'2999-01-01'}, {...payload,dateOfBirth:'2025-02-30'}, {...payload,name:'  '},
    {...payload,pastHistory:{...history,unexpected:[]}}, {...payload,pastHistory:{...history,knownAllergies:['x'.repeat(501)]}},
    {...payload,pastHistory:{...history,chronicIllnesses:Array(33).fill('x')}}, {...payload,pastHistory:{...history,lifestyleNotes:'\0'}}]) {
    assert.throws(() => intakeBody(body,registrationBody), error => error.statusCode === 400);
  }
});
test('secured intake persists UUID-owned ordered history and GET round-trips it without Clinical History', async t => {
  const h = await setup(t);
  const response = await h.post();
  assert.equal(response.statusCode,201);
  const patient = response.json();
  assert.deepEqual(patient.pastHistory,history);
  assert.equal(patient.profession,'');
  assert.equal(patient.clinic_patient_number,'CPN-20');
  assert.equal(h.data().items.length,5);
  assert.ok(h.data().items.every(item => item.patient_id === patient.patient_id));
  assert.equal(new Set(h.data().items.map(item => item.item_id)).size,5);
  const get = await h.app.inject({url:'/patients/'+patient.patient_id+'/intake',headers:h.headers});
  assert.equal(get.statusCode,200); assert.deepEqual(get.json(),patient);
  assert.equal(get.headers['cache-control'],'no-store');
  assert.equal('visits' in patient,false); assert.equal('registeredAt' in patient,false);
  assert.equal(h.app.server.listening,false);
});
test('empty submitted history differs from legacy uncaptured history; missing patient is 404', async t => {
  const h = await setup(t);
  const saved = (await h.post({...payload,pastHistory:empty})).json();
  assert.deepEqual(saved.pastHistory,empty);
  h.data().markers.length=0;
  const result = await h.app.inject({url:'/patients/'+saved.patient_id+'/intake',headers:h.headers});
  assert.equal(result.json().pastHistory,null);
  assert.equal((await h.app.inject({url:'/patients/00000000-0000-4000-8000-000000000000/intake',headers:h.headers})).statusCode,404);
});
test('history insert, readback, missing schema and outer commit failures never return success or partial persistence', async t => {
  for (const failure of ['INSERT INTO patient_intakes','INSERT INTO past_history_items','FROM past_history_items','OUTER_COMMIT']) {
    const h = await setup(t); h.fail(failure);
    const response = await h.post();
    assert.equal(response.statusCode,503,failure);
    assert.deepEqual(response.json(),{error:'Service unavailable'});
    assert.deepEqual(h.data(),{patients:[],markers:[],items:[]});
    if (failure.startsWith('INSERT')) assert.ok(h.calls.includes('ROLLBACK TO SAVEPOINT vip_patient_intake'));
  }
});
test('intake rejects missing identity, Nurse, invalid CSRF, cross-origin, and deactivated Doctor before writes', async t => {
  const h = await setup(t);
  for (const headers of [{origin,'content-type':'application/json'}, {...h.headers,'x-csrf-token':'invalid'}, {...h.headers,origin:'https://evil.invalid'}]) {
    assert.ok([401,403].includes((await h.post(payload,headers)).statusCode));
  }
  const nurse = await login(h,'SYN/NURSE');
  const headers = {...h.headers,cookie:'__Host-vip_session='+nurse.token,'x-csrf-token':(await h.auth.current(nurse.token)).csrf};
  assert.equal((await h.post(payload,headers)).statusCode,403);
  assert.equal((await h.app.inject({url:'/patients/00000000-0000-4000-8000-000000000000/intake',headers})).statusCode,403);
  await h.actor(DOCTOR,{lifecycle_state:'DEACTIVATED'});
  assert.equal((await h.post()).statusCode,401);
  assert.equal(h.calls.length,0);
});
test('intake route collision fails composition', async t => {
  const app=Fastify(); t.after(()=>app.close()); app.post('/patients/intake',async()=>({}));
  await assert.rejects(composeSecuredPatients(app,{auth:makeHarness().auth,trustedOrigin:origin}),e=>e.statusCode===503);
});
