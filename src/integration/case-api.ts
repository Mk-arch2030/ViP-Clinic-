import { ApiFailure, TEST_ORIGIN } from './web-api-client';
import { UUID, record } from './basic-patient';
export interface CaseIntent { operationId:string; patientId:string; problemSummary:string }
export interface CaseReceipt { caseId:string; patientId:string; lifecycle:'OPEN'; lifecycleVersion:0; createdAt:string }
export type CaseOutcome = {status:'UNKNOWN'} | {status:'COMMITTED';result:CaseReceipt};
export function parseCaseOutcome(value:unknown):CaseOutcome {
 const row=record(value);
 if(row.status==='UNKNOWN' && Object.keys(row).length===1)return {status:'UNKNOWN'};
 const r=record(row.result);
 if(row.status!=='COMMITTED'||Object.keys(row).length!==2||Object.keys(r).length!==5||
 !UUID.test(String(r.caseId))||!UUID.test(String(r.patientId))||r.lifecycle!=='OPEN'||r.lifecycleVersion!==0||
 typeof r.createdAt!=='string'||new Date(r.createdAt).toISOString()!==r.createdAt)throw new Error('Invalid receipt');
 return {status:'COMMITTED',result:r as unknown as CaseReceipt};
}
export function createCaseApi(origin:string,fetcher:typeof fetch=globalThis.fetch) {
 async function send(path:string,body:unknown,csrf:string):Promise<CaseOutcome>{
  if(origin!==TEST_ORIGIN||!/^[A-Za-z0-9_-]{43}$/.test(csrf))throw new ApiFailure(403,'forbidden');
  let response:Response;
  try{response=await fetcher(path,{method:'POST',credentials:'same-origin',cache:'no-store',redirect:'error',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify(body)});}catch{throw new ApiFailure(0,'outcome-unknown');}
  if(response.status!==200)throw new ApiFailure(response.status,response.status===401?'unauthorized':response.status===403?'forbidden':response.status===409?'conflict':response.status===404?'not-found':[400,413,415].includes(response.status)?'invalid':'outcome-unknown');
  try{if(!/^application\/json(?:\s*;|$)/i.test(response.headers.get('Content-Type')??''))throw Error();return parseCaseOutcome(await response.json());}catch{throw new ApiFailure(503,'outcome-unknown');}
 }
 return {
  async create(intent:CaseIntent,csrf:string){
   if(!UUID.test(intent.operationId)||!UUID.test(intent.patientId)||!intent.problemSummary.trim()||intent.problemSummary.length>4000||intent.problemSummary.includes('\0'))throw new ApiFailure(400,'invalid');
   const result=await send('/clinical/cases',intent,csrf);
   if(result.status!=='COMMITTED'||result.result.patientId!==intent.patientId)throw new ApiFailure(503,'outcome-unknown');
   return result;
  },
  recover(operationId:string,csrf:string){if(!UUID.test(operationId))throw new ApiFailure(400,'invalid');return send('/clinical/cases/receipt',{operationId},csrf);}
 };
}
