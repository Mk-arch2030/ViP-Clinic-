import { UUID } from './basic-patient';
export const CASE_MARKER='vip.case-create.operation.v1';
export interface CaseJournal { read():string|null; reserve():Promise<string>; releaseConfirmed(id:string):Promise<void> }
export function createCaseJournal(storage:()=>Storage,locks:Pick<LockManager,'request'>|undefined,uuid:()=>string=()=>crypto.randomUUID()):CaseJournal {
 function read(){const text=storage().getItem(CASE_MARKER);if(text===null)return null;const r=JSON.parse(text);if(Object.keys(r).length!==3||r.version!==1||r.kind!=='CASE_CREATE'||typeof r.operationId!=='string'||!UUID.test(r.operationId))throw Error('Recovery metadata unavailable');return r.operationId as string;}
 async function exclusive<T>(work:()=>T):Promise<T>{if(!locks)throw Error('Web Locks unavailable');return locks.request(CASE_MARKER,{mode:'exclusive'},work);}
 return {read,reserve:()=>exclusive(()=>{if(read()!==null)throw Error('Resolve existing operation');const id=uuid();if(!UUID.test(id))throw Error('Invalid operation');storage().setItem(CASE_MARKER,JSON.stringify({version:1,kind:'CASE_CREATE',operationId:id}));if(read()!==id)throw Error('Storage unavailable');return id;}),releaseConfirmed:id=>exclusive(()=>{if(read()!==id)throw Error('Operation changed');storage().removeItem(CASE_MARKER);if(read()!==null)throw Error('Storage unavailable');})};
}
