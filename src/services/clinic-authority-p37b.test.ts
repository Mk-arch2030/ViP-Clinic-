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
  assert.ok(visit);
  return { store, visitId: visit.id };
}

test('P37B-01 Nurse prescription update rejected atomically', () => {
  const { store, visitId } = fixture();
  const visit = store.getVisitById(visitId);
  assert.ok(visit);
  const before = JSON.stringify(store.getState());

  assert.throws(() => store.updateEncounter(
    visitId,
    {
      currentComplaint: 'SHOULD NOT PERSIST',
      prescription: { ...visit.prescription, isAuthorized: true },
    },
    'Nurse',
  ), /Doctor authority only/);

  assert.equal(JSON.stringify(store.getState()), before);
});

test('P37B-02 Nurse follow-up update rejected atomically', () => {
  const { store, visitId } = fixture();
  const before = JSON.stringify(store.getState());

  assert.throws(() => store.updateEncounter(
    visitId,
    {
      treatmentAdvice: undefined,
      followUp: {
        required: true,
        clinicalInstructions: 'SHOULD NOT PERSIST',
      },
    },
    'Nurse',
  ), /Doctor authority only/);

  assert.equal(JSON.stringify(store.getState()), before);
});

test('P37B-03 Doctor cannot forge prescription authorization', () => {
  const { store, visitId } = fixture();
  const visit = store.getVisitById(visitId);
  assert.ok(visit);
  const before = JSON.stringify(store.getState());

  assert.throws(() => store.updateEncounter(
    visitId,
    {
      currentComplaint: 'SHOULD NOT PERSIST',
      prescription: {
        ...visit.prescription,
        isAuthorized: true,
        authorizedAt: '2026-01-01T00:00:00.000Z',
        authorizedBy: 'FORGED',
      },
    },
    'Doctor',
  ), /cannot be changed through encounter updates/);

  assert.equal(JSON.stringify(store.getState()), before);
});

test('P37B-04 Doctor can edit unsigned prescription and follow-up', () => {
  const { store, visitId } = fixture();
  const visit = store.getVisitById(visitId);
  assert.ok(visit);

  const result = store.updateEncounter(
    visitId,
    {
      prescription: {
        ...visit.prescription,
        patientInstructions: 'P37B TEST INSTRUCTIONS',
      },
      followUp: {
        required: true,
        clinicalInstructions: 'P37B TEST FOLLOW-UP',
      },
    },
    'Doctor',
  );

  assert.equal(
    result.prescription.patientInstructions,
    'P37B TEST INSTRUCTIONS',
  );
  assert.equal(result.followUp.required, true);
});

test('P37B-05 Doctor prescription authorization still works', () => {
  const { store, visitId } = fixture();
  const result = store.authorizePrescription(visitId, 'Doctor');
  assert.equal(result.isAuthorized, true);
  assert.ok(result.authorizedAt);
  assert.ok(result.authorizedBy);
});

test('P37B-06 Save acknowledgement and role-specific payload', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  const ui = readFileSync(
    'src/components/DoctorConsultation.tsx',
    'utf8',
  );

  const appHandler = app.match(
    /const handleUpdateEncounter = \(updates: any\): boolean => \{([\s\S]*?)\n  \};/,
  );
  assert.ok(appHandler);
  assert.match(appHandler[1], /return true;/);
  assert.match(appHandler[1], /return false;/);

  const uiHandler = ui.match(
    /const handleSaveProgress = \(\) => \{([\s\S]*?)\n  \};/,
  );
  assert.ok(uiHandler);
  assert.match(uiHandler[1], /onUpdateEncounter\(isDoctor \?/);
  assert.match(uiHandler[1], /if \(!saved\) return;/);
  assert.match(uiHandler[1], /setSaveSuccessNotice\(true\)/);
});

test('P37B-07 Authorized prescription cannot be edited', () => {
  const { store, visitId } = fixture();

  store.authorizePrescription(visitId, 'Doctor');

  const visit = store.getVisitById(visitId);
  assert.ok(visit);

  const before = JSON.stringify(store.getState());

  assert.throws(
    () => store.updateEncounter(
      visitId,
      {
        currentComplaint: 'SHOULD NOT PERSIST',
        prescription: {
          ...visit.prescription,
          patientInstructions: 'CHANGED AFTER AUTHORIZATION',
        },
      },
      'Doctor',
    ),
    /Authorized prescription cannot be modified/,
  );

  assert.equal(JSON.stringify(store.getState()), before);
});
