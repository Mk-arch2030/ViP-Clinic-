import test from 'node:test';
import assert from 'node:assert/strict';
import { createRegistrationJournal, REGISTRATION_MARKER } from './registration-uncertainty';
import { ConnectedPatientSession } from './connected-patient-session';
import { SessionCoordinator } from './session-coordinator';
import { mayEnterDoctorClinic } from '../components/OuterDoctorGate';
import { ApiFailure, type WebApi } from './web-api-client';

const session = { actorIdentityReference:'55555555-5555-4555-8555-555555555555', role:'Doctor' as const, lifecycle:'ACTIVE' as const, csrf:'A'.repeat(43) };
const input = { name:'Synthetic', dateOfBirth:'1990-02-01', profession:'', phone:'0000', gender:'Male' as const };
const patient = { ...input, patientId:session.actorIdentityReference, clinicPatientNumber:'CPN-90001', age:36 };
const api = (patch:Partial<WebApi> = {}):WebApi => ({ session:async()=>session, login:async()=>{}, logout:async()=>{}, retrieve:async()=>patient, register:async()=>patient, ...patch });
function fixture() {
  const rows = new Map<string,string>();
  const storage = { getItem:(key:string)=>rows.get(key)??null, setItem:(key:string,value:string)=>{rows.set(key,value);}, removeItem:(key:string)=>{rows.delete(key);} };
  let tail = Promise.resolve();
  // Explicit serial fake Web Locks adapter, not proof of a real browser lock.
  const locks = { request(_name:string, _options:unknown, work:()=>unknown) {
    const next = tail.then(work); tail = next.then(()=>{},()=>{}); return next;
  } } as unknown as Pick<LockManager,'request'>;
  let sequence = 0;
  const journal = () => createRegistrationJournal({ storage:()=>storage, locks, uuid:()=>`90000000-0000-4000-8000-${String(++sequence).padStart(12,'0')}` });
  return { rows, storage, locks, journal };
}

test('reservation precedes API dispatch, contains no clinical or credential data, acknowledgement clears it', async()=>{
  const f=fixture(); let writes=0;
  const model=new ConnectedPatientSession(api({register:async()=>{
    writes++; assert.equal(f.rows.size,1);
    const row=JSON.parse(f.rows.get(REGISTRATION_MARKER)!);
    assert.deepEqual(Object.keys(row).sort(),['operationId','version']); return patient;
  }}),f.journal());
  await model.refresh(); await model.register(input);
  assert.equal(writes,1);assert.equal(f.rows.size,0);assert.equal(model.getSnapshot().session.patient,patient);
  model.dispose();
});
test('lost reply survives disposal/full model recreation, refresh and relogin; gate and repeat writes remain blocked', async()=>{
  const f=fixture();let writes=0;
  const transport=api({register:async()=>{writes++;throw new ApiFailure(0,'unavailable');}});
  const first=new ConnectedPatientSession(transport,f.journal());await first.refresh();await first.register(input);first.dispose();
  const fresh=new ConnectedPatientSession(transport,f.journal());
  assert.equal(fresh.getSnapshot().session.registrationUnconfirmed,true);
  await fresh.refresh();await fresh.register(input);await fresh.logout();await fresh.login('SYN/DOCTOR','synthetic');await fresh.register(input);
  assert.equal(writes,1);assert.equal(mayEnterDoctorClinic(fresh.getSnapshot().session),false);assert.equal(f.rows.size,1);fresh.dispose();
});
test('two cooperating clients sharing a lock/storage cannot dispatch concurrent registrations', async()=>{
  const f=fixture();let writes=0;let finish!:(value:typeof patient)=>void;
  const wait=new Promise<typeof patient>(yes=>{finish=yes;});
  const transport=api({register:async()=>{writes++;return wait;}});
  const a=new ConnectedPatientSession(transport,f.journal()),b=new ConnectedPatientSession(transport,f.journal());
  await Promise.all([a.refresh(),b.refresh()]);
  const first=a.register(input),second=b.register(input);
  await new Promise(resolve=>setImmediate(resolve));assert.equal(writes,1);
  assert.equal(b.getSnapshot().session.registrationUnconfirmed,true);
  finish(patient);await Promise.all([first,second]);a.dispose();b.dispose();
});
test('definite pre-effect rejection clears owned marker and preserves corrected-submit behavior', async()=>{
  for(const status of [400,401,403,404,413,415,429]) {
    const f=fixture();let reject=true;
    const model=new ConnectedPatientSession(api({register:async()=>{if(reject)throw new ApiFailure(status,status===401?'unauthorized':status===403?'forbidden':status===429?'throttled':'invalid');return patient;}}),f.journal());
    await model.refresh();await model.register(input);assert.equal(f.rows.size,0,String(status));
    reject=false;await model.refresh();assert.equal(await model.register(input),patient);model.dispose();
  }
});
test('storage unavailable, reservation failure and missing Web Locks deny before API dispatch', async()=>{
  for(const mode of ['read','write','locks'] as const) {
    const f=fixture();let writes=0;
    const storage={...f.storage,getItem:mode==='read'?()=>{throw Error('unavailable');}:f.storage.getItem,
      setItem:mode==='write'?()=>{throw Error('unavailable');}:f.storage.setItem};
    const journal=createRegistrationJournal({storage:()=>storage,locks:mode==='locks'?undefined:f.locks});
    const m=new ConnectedPatientSession(api({register:async()=>{writes++;return patient;}}),journal);
    await m.refresh();await m.register(input);assert.equal(writes,0,mode);assert.equal(m.getSnapshot().session.registrationUnconfirmed,true);m.dispose();
  }
});
test('malformed stored marker blocks without deletion or invented recovery', async()=>{
  const f=fixture();f.rows.set(REGISTRATION_MARKER,'malformed');
  assert.equal(f.journal().pending(),true);await assert.rejects(f.journal().reserve());
  const m=new ConnectedPatientSession(api(),f.journal());await m.refresh();assert.equal(mayEnterDoctorClinic(m.getSnapshot().session),false);
  assert.equal(f.rows.get(REGISTRATION_MARKER),'malformed');m.dispose();
});
test('wrong-owner acknowledgement cannot remove another unresolved intent', async()=>{
  const f=fixture(),j=f.journal();await j.reserve();
  await assert.rejects(j.confirm('90000000-0000-4000-8000-999999999999'));
  assert.equal(j.pending(),true);
});
test('marker removal failure suppresses UI success and retains denial', async()=>{
  const f=fixture();let writes=0;
  const j=createRegistrationJournal({storage:()=>({...f.storage,removeItem:()=>{throw Error('unavailable');}}),locks:f.locks});
  const m=new ConnectedPatientSession(api({register:async()=>{writes++;return patient;}}),j);
  await m.refresh();assert.equal(await m.register(input),null);assert.equal(writes,1);
  assert.equal(m.getSnapshot().session.patient,null);assert.equal(m.getSnapshot().session.registrationUnconfirmed,true);assert.equal(j.pending(),true);m.dispose();
});
test('dispose during a dispatched mutation retains marker despite late response', async()=>{
  const f=fixture();let finish!:(value:typeof patient)=>void;
  const wait=new Promise<typeof patient>(yes=>{finish=yes;});
  const m=new ConnectedPatientSession(api({register:async()=>wait}),f.journal());await m.refresh();
  const pending=m.register(input);await new Promise(resolve=>setImmediate(resolve));m.dispose();finish(patient);await pending;
  assert.equal(f.journal().pending(),true);
});
test('dispose while awaiting a lock does not dispatch a late mutation', async()=>{
  let unlock!:()=>void;const wait=new Promise<void>(yes=>{unlock=yes;});const f=fixture();let writes=0;
  const journal={pending:()=>false,reserve:async()=>{await wait;return f.journal().reserve();},confirm:async()=>{throw Error('unexpected');}};
  const c=new SessionCoordinator(api({register:async()=>{writes++;return patient;}}),journal);await c.refresh();const pending=c.register(input);c.dispose();unlock();await pending;
  assert.equal(writes,0);assert.equal(f.journal().pending(),true);
});
