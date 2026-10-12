import test from 'node:test';
import assert from 'node:assert/strict';
import { mayEnterDoctorClinic } from './OuterDoctorGate';
import { ConnectedPatientSession } from '../integration/connected-patient-session';
import { ApiFailure, type WebApi } from '../integration/web-api-client';
import type { SessionView } from '../integration/session-coordinator';

const doctor = {
  actorIdentityReference:'11111111-1111-4111-8111-111111111111',
  role:'Doctor' as const, lifecycle:'ACTIVE' as const, csrf:'A'.repeat(43)
};
const base: SessionView = {
  state:'checking',session:null,patient:null,searchResults:[],searchHasMore:false,
  busy:false,failure:null,mutationsBlocked:true,logoutUnconfirmed:false,registrationUnconfirmed:false
};

test('outer gate stays closed until server-confirmed Doctor session', () => {
  for (const state of ['checking','unauthenticated','unavailable'] as const) {
    assert.equal(mayEnterDoctorClinic({...base,state}),false);
  }
  assert.equal(mayEnterDoctorClinic({...base,state:'authenticated',session:doctor}),true);
});

test('outer gate refuses Nurse, uncertain logout and uncertain registration', () => {
  const authorized = {...base,state:'authenticated' as const,session:doctor};
  assert.equal(mayEnterDoctorClinic({...authorized,session:{...doctor,role:'Nurse'}}),false);
  assert.equal(mayEnterDoctorClinic({...authorized,logoutUnconfirmed:true}),false);
  assert.equal(mayEnterDoctorClinic({...authorized,registrationUnconfirmed:true}),false);
  assert.equal(mayEnterDoctorClinic({...authorized,session:null}),false);
});

function syntheticGateApi(overrides: Partial<WebApi> = {}): WebApi {
  return {
    session: async () => doctor,
    login: async () => {},
    logout: async () => {},
    retrieve: async () => { throw new Error('Patient retrieval not permitted in gate test'); },
    register: async () => { throw new Error('Patient registration not permitted in gate test'); },
    ...overrides
  };
}

test('shared doctor model locks the gate immediately while server logout is pending', async () => {
  let finishLogout!: () => void;
  let logoutCalls = 0;
  const pending = new Promise<void>(resolve => { finishLogout = resolve; });
  const model = new ConnectedPatientSession(syntheticGateApi({
    logout: async () => { logoutCalls++; await pending; }
  }));
  try {
    await model.refresh();
    assert.equal(mayEnterDoctorClinic(model.getSnapshot().session), true);

    const logout = model.logout();
    const during = model.getSnapshot().session;
    assert.equal(logoutCalls, 1);
    assert.equal(during.session, null);
    assert.equal(during.logoutUnconfirmed, true);
    assert.equal(mayEnterDoctorClinic(during), false);

    finishLogout();
    await logout;
    const after = model.getSnapshot().session;
    assert.equal(after.state, 'unauthenticated');
    assert.equal(after.session, null);
    assert.equal(after.logoutUnconfirmed, false);
    assert.equal(mayEnterDoctorClinic(after), false);
  } finally {
    model.dispose();
  }
});

test('failed server logout leaves shared doctor gate locked and revocation unconfirmed', async () => {
  const model = new ConnectedPatientSession(syntheticGateApi({
    logout: async () => { throw new ApiFailure(0, 'unavailable'); }
  }));
  try {
    await model.refresh();
    assert.equal(mayEnterDoctorClinic(model.getSnapshot().session), true);
    await model.logout();
    const after = model.getSnapshot().session;
    assert.equal(after.state, 'unavailable');
    assert.equal(after.session, null);
    assert.equal(after.logoutUnconfirmed, true);
    assert.equal(mayEnterDoctorClinic(after), false);
  } finally {
    model.dispose();
  }
});
