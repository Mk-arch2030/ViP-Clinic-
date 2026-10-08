import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const storage = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, String(value));
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
  },
});

const { ClinicStore } = await import('./clinicStore');

function fixture() {
  storage.clear();
  const store = new ClinicStore();
  const visit = store.getState().visits[0];

  assert.ok(visit, 'Seeded test visit required');

  return { store, visitId: visit.id };
}

test('P37A-01 Nurse diagnosis rejection preserves state', () => {
  const { store, visitId } = fixture();
  const before = JSON.stringify(store.getState());

  assert.throws(
    () => store.updateEncounter(
      visitId,
      { finalDiagnosis: 'UNAUTHORIZED TEST DIAGNOSIS' },
      'Nurse',
    ),
    /Doctor authority only/,
  );

  assert.equal(JSON.stringify(store.getState()), before);
});

test('P37A-02 Nurse investigation and treatment rejection', () => {
  const { store, visitId } = fixture();
  const before = JSON.stringify(store.getState());

  assert.throws(
    () => store.updateEncounter(
      visitId,
      { investigations: [] },
      'Nurse',
    ),
    /Doctor authority only/,
  );

  assert.throws(
    () => store.updateEncounter(
      visitId,
      { treatmentAdvice: 'UNAUTHORIZED TEST TREATMENT' },
      'Nurse',
    ),
    /Doctor authority only/,
  );

  assert.equal(JSON.stringify(store.getState()), before);
});

test('P37A-03 Doctor can update authorized diagnosis', () => {
  const { store, visitId } = fixture();

  const result = store.updateEncounter(
    visitId,
    { finalDiagnosis: 'P37A TEST DIAGNOSIS' },
    'Doctor',
  );

  assert.equal(result.finalDiagnosis, 'P37A TEST DIAGNOSIS');
});

test('P37A-04 FINDING: Nurse can change prescription payload', () => {
  const { store, visitId } = fixture();
  const visit = store.getVisitById(visitId);
  assert.ok(visit);

  const changed = {
    ...visit.prescription,
    isAuthorized: true,
    authorizedAt: '2026-01-01T00:00:00.000Z',
    authorizedBy: 'UNAUTHORIZED TEST ACTOR',
  };

  const result = store.updateEncounter(
    visitId,
    { prescription: changed },
    'Nurse',
  );

  assert.equal(result.prescription.isAuthorized, true);
  assert.equal(
    result.prescription.authorizedBy,
    'UNAUTHORIZED TEST ACTOR',
  );

  console.log('P37A-FINDING-04 = CONFIRMED');
});

test('P37A-05 FINDING: Nurse can change follow-up decision', () => {
  const { store, visitId } = fixture();

  const result = store.updateEncounter(
    visitId,
    {
      followUp: {
        required: true,
        clinicalInstructions: 'P37A TEST FOLLOW-UP',
      },
    },
    'Nurse',
  );

  assert.equal(result.followUp.required, true);
  assert.equal(
    result.followUp.clinicalInstructions,
    'P37A TEST FOLLOW-UP',
  );

  console.log('P37A-FINDING-05 = CONFIRMED');
});

test('P37A-06 FINDING: actor role is locally switchable', () => {
  const { store } = fixture();

  store.setActorRole('Nurse');
  assert.equal(store.getState().actorRole, 'Nurse');

  store.setActorRole('Doctor');
  assert.equal(store.getState().actorRole, 'Doctor');

  console.log('P37A-FINDING-06 = LOCAL_ROLE_SWITCH');
});

test('P37A-07 Nurse cannot use authorizePrescription', () => {
  const { store, visitId } = fixture();
  const before = JSON.stringify(store.getState());

  assert.throws(
    () => store.authorizePrescription(visitId, 'Nurse'),
    /reserved for the Doctor/,
  );

  assert.equal(JSON.stringify(store.getState()), before);
});

test('P37A-08 FINDING: UI success notice is unconditional', () => {
  const source = readFileSync(
    'src/components/DoctorConsultation.tsx',
    'utf8',
  );

  const handler = source.match(
    /const handleSaveProgress = \(\) => \{([\s\S]*?)\n  \};/,
  );

  assert.ok(handler, 'Save handler must be found');
  assert.match(handler[1], /onUpdateEncounter\(/);
  assert.match(handler[1], /setSaveSuccessNotice\(true\)/);

  const callbackIndex = handler[1].indexOf('onUpdateEncounter(');
  const successIndex = handler[1].indexOf(
    'setSaveSuccessNotice(true)',
  );

  assert.ok(successIndex > callbackIndex);

  const app = readFileSync('src/App.tsx', 'utf8');
  const appHandler = app.match(
    /const handleUpdateEncounter = \(updates: any\) => \{([\s\S]*?)\n  \};/,
  );

  assert.ok(appHandler, 'App handler must be found');
  assert.match(appHandler[1], /catch \(err: any\)/);
  assert.match(appHandler[1], /alert\(err\.message/);

  console.log('P37A-FINDING-08 = SUCCESS_WITHOUT_ACK');
});
