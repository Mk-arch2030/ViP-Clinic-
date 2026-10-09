const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { Actor, ACTOR_ROLES, ACTOR_LIFECYCLE, NURSE_LIFECYCLE } = require('./actor');

function input(role, lifecycle) {
  return {
    actorIdentityReference: 'synthetic-actor-reference',
    role,
    authorityContext: Object.freeze({ reference: 'synthetic-authority-context' }),
    lifecycle
  };
}

for (const role of ['Doctor', 'Nurse']) {
  for (const lifecycle of ['ACTIVE', 'DEACTIVATED']) {
    test(`${role} preserves explicit ${lifecycle}, identity and authority context`, () => {
      const source = input(role, lifecycle);
      const actor = new Actor(source);
      assert.deepEqual({ ...actor }, source);
      assert.equal(actor.authorityContext, source.authorityContext);
    });
  }

  test(`${role} rejects lifecycle values outside the closed vocabulary`, () => {
    for (const lifecycle of [null, '', 'active', 'DELETED', 'SUSPENDED', true, 1, {}, ['ACTIVE']]) {
      assert.throws(() => new Actor(input(role, lifecycle)), {
        message: `Invalid ${role} Lifecycle`
      });
    }
  });
}

test('Nurse still requires lifecycle, whether omitted or explicitly undefined', () => {
  const source = input('Nurse', undefined);
  assert.throws(() => new Actor(source), { message: 'Invalid Nurse Lifecycle' });
  delete source.lifecycle;
  assert.throws(() => new Actor(source), { message: 'Invalid Nurse Lifecycle' });
});

test('legacy Doctor omission does not create or default lifecycle', () => {
  const source = input('Doctor', undefined);
  delete source.lifecycle;
  const actor = new Actor(source);
  assert.deepEqual({ ...actor }, source);
  assert.equal(Object.hasOwn(actor, 'lifecycle'), false);
});

test('explicit undefined Doctor lifecycle retains the omission representation', () => {
  const source = input('Doctor', undefined);
  const actor = new Actor(source);
  assert.equal(Object.hasOwn(actor, 'lifecycle'), false);
  assert.equal(actor.actorIdentityReference, source.actorIdentityReference);
  assert.equal(actor.authorityContext, source.authorityContext);
});

test('construction preserves frozen inputs for both roles and lifecycle values', () => {
  for (const role of ['Doctor', 'Nurse']) {
    for (const lifecycle of ['ACTIVE', 'DEACTIVATED']) {
      const source = input(role, lifecycle);
      const before = { ...source };
      Object.freeze(source);
      new Actor(source);
      assert.deepEqual(source, before);
    }
  }
});

test('missing identity remains rejected independently of role and lifecycle', () => {
  for (const role of ['Doctor', 'Nurse']) {
    for (const actorIdentityReference of [undefined, null, '']) {
      assert.throws(() => new Actor({ ...input(role, 'ACTIVE'), actorIdentityReference }), {
        message: 'Actor Identity Reference is required'
      });
    }
  }
});

test('the existing Doctor and Nurse role boundary remains closed', () => {
  for (const role of [undefined, null, '', 'doctor', 'Admin', 'Patient']) {
    assert.throws(() => new Actor(input(role, 'ACTIVE')), { message: 'Invalid Actor Role' });
  }
});

test('role and lifecycle vocabularies are frozen; Nurse export remains compatible', () => {
  assert.deepEqual(ACTOR_ROLES, ['Doctor', 'Nurse']);
  assert.deepEqual(ACTOR_LIFECYCLE, ['ACTIVE', 'DEACTIVATED']);
  assert.equal(NURSE_LIFECYCLE, ACTOR_LIFECYCLE);
  assert.equal(Object.isFrozen(ACTOR_ROLES), true);
  assert.equal(Object.isFrozen(ACTOR_LIFECYCLE), true);
  assert.throws(() => ACTOR_LIFECYCLE.push('DELETED'), TypeError);
});

test('import and construction remain independent of database, HTTP and storage drivers', () => {
  const probe = spawnSync(process.execPath, ['-e', `
    const assert = require('node:assert/strict');
    const Module = require('node:module');
    const originalLoad = Module._load;
    const actorPath = ${JSON.stringify(path.join(__dirname, 'actor.js'))};
    Module._load = function (request, parent, isMain) {
      assert.equal(request, actorPath, 'Actor must not load a runtime dependency');
      return originalLoad.call(this, request, parent, isMain);
    };
    const { Actor } = require(actorPath);
    for (const role of ['Doctor', 'Nurse']) {
      for (const lifecycle of ['ACTIVE', 'DEACTIVATED']) {
        new Actor({ actorIdentityReference: 'synthetic-reference', role, lifecycle });
      }
    }
  `], { encoding: 'utf8', timeout: 5000 });
  assert.equal(probe.error, undefined);
  assert.equal(probe.status, 0, probe.stderr);
});
