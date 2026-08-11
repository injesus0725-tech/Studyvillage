/* v1.9 restore request gate smoke test. Uses fake request/response objects only; no DB access or writes. */
import assert from 'node:assert/strict';
import { createRestoreRequestHandler } from './restore-request-handler.js';

function response(){
  return{
    statusCode:200,body:null,
    status(code){this.statusCode=code;return this},
    json(body){this.body=body;return this}
  };
}

let executed=0;
const rejected=createRestoreRequestHandler({
  prepare:()=>({ok:false,code:'invalid-test',message:'invalid'}),
  executeRestore:()=>{executed++;}
});
const rejectedRes=response();
rejected({body:{unsafe:true}},rejectedRes);
assert.equal(rejectedRes.statusCode,400,'invalid backup should return 400');
assert.equal(rejectedRes.body?.code,'invalid-test');
assert.equal(executed,0,'restore executor must not run when preparation fails');

const preparedBackup={format:'studyvillage-backup',version:9,players:[{name:'검증'}]};
const accepted=createRestoreRequestHandler({
  prepare:()=>({ok:true,backup:preparedBackup,counts:{players:1,scoreLedger:2},migrated:true,fromVersion:8,toVersion:9}),
  executeRestore:(backup,meta)=>{executed++;assert.equal(backup,preparedBackup);assert.equal(meta.toVersion,9);return{restored:true}}
});
const acceptedRes=response();
accepted({body:{}},acceptedRes);
assert.equal(acceptedRes.statusCode,200);
assert.equal(acceptedRes.body?.ok,true);
assert.equal(acceptedRes.body?.players,1);
assert.equal(acceptedRes.body?.auditEntries,2);
assert.equal(acceptedRes.body?.restored,true);
assert.equal(executed,1,'restore executor should run exactly once after preparation succeeds');

const failed=createRestoreRequestHandler({
  prepare:()=>({ok:true,backup:preparedBackup,counts:{players:1},migrated:false,fromVersion:9,toVersion:9}),
  executeRestore:()=>{throw new Error('simulated failure')}
});
const failedRes=response();
failed({body:{}},failedRes);
assert.equal(failedRes.statusCode,500,'executor failure should return 500');
assert.equal(failedRes.body?.code,'restore-execution-failed');

console.log('[Studyvillage] restore request gate selftest passed');
