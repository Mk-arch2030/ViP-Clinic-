import test from 'node:test';
import assert from 'node:assert/strict';
import { createProtectedIntakeDraft } from './protected-intake-draft';

const doctorA = '11111111-1111-4111-8111-111111111111';
const doctorB = '22222222-2222-4222-8222-222222222222';
const draft = { name: 'Unsaved Test Patient', phone: '01000000000' };

test('same doctor can resume draft only after server verification', () => {
  const store = createProtectedIntakeDraft();
  store.capture(doctorA, draft);
  assert.equal(store.resume(null), null);
  assert.deepEqual(store.resume(doctorA), draft);
});

test('different doctor cannot access previous doctor draft', () => {
  const store = createProtectedIntakeDraft();
  store.capture(doctorA, draft);
  assert.equal(store.resume(doctorB), null);
  assert.equal(store.resume(doctorA), null);
});

test('logout destroys draft', () => {
  const store = createProtectedIntakeDraft();
  store.capture(doctorA, draft);
  store.clear();
  assert.equal(store.resume(doctorA), null);
});

test('uncertain registration destroys reusable draft', () => {
  const store = createProtectedIntakeDraft();
  store.capture(doctorA, draft);
  store.clear();
  assert.equal(store.resume(doctorA), null);
});

test('registration dispatch invalidates reusable draft before outcome is known', () => {
  const store = createProtectedIntakeDraft();
  store.capture(doctorA, draft);

  store.registrationStarted();

  assert.equal(store.resume(doctorA), null);
});
