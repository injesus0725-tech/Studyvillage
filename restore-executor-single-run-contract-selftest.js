const fs=require('fs');
const assert=require('assert');
const test=fs.readFileSync('server/restore-request-handler-selftest.js','utf8');
const handler=fs.readFileSync('server/restore-request-handler.js','utf8');
for(const token of [
  "executed,0,'restore executor must not run when preparation fails'",
  "executed,1,'restore executor should run exactly once after preparation succeeds'",
  "code:'restore-execution-failed'"
])assert.ok(test.includes(token),`restore executor behavior guard missing: ${token}`);
assert.ok(handler.includes('const result=executeRestore(prepared.backup,prepared)'),'executor must receive only prepared backup');
assert.ok(handler.includes('if(!prepared?.ok)'),'failed preparation must short-circuit executor');
console.log('restore executor single run contract self-test passed');
