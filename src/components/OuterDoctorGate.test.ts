import test from 'node:test';
import assert from 'node:assert/strict';
import { mayEnterDoctorClinic } from './OuterDoctorGate';
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
