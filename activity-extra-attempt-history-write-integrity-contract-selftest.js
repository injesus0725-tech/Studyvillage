const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "const parseHistoryStore=getSetting=>",
  "return Array.isArray(parsed)?{ok:true,rows:parsed}:{ok:false,code:'invalid-history-store'}",
  "catch{return{ok:false,code:'invalid-history-store'}}",
  "return{ok:false,code:'invalid-history-value'}",
  "const delta=Number.isInteger(change)?change:afterValue-beforeValue",
  "return{ok:false,code:'invalid-history-delta'}",
  "type==='grant'&&delta<=0",
  "type==='consume'&&delta>=0",
  "const store=parseHistoryStore(getSetting);if(!store.ok)return store",
  "amount:delta,before:beforeValue,after:afterValue"
])assert.ok(src.includes(token),`history write integrity guard missing: ${token}`);
const start=src.indexOf('export function appendExtraAttemptHistory'),end=src.indexOf('\nexport function removeExtraAttemptStudentData',start),body=src.slice(start,end);
assert.ok(body.indexOf("if(!Number.isInteger(beforeValue)")<body.indexOf('const store=parseHistoryStore(getSetting)'),'invalid values must be rejected before history store access');
assert.ok(body.indexOf("afterValue-beforeValue!==delta")<body.indexOf('const store=parseHistoryStore(getSetting)'),'mismatched deltas must be rejected before history store access');
assert.ok(body.indexOf("type==='grant'&&delta<=0")<body.indexOf('const store=parseHistoryStore(getSetting)'),'zero/negative grants must be rejected before history store access');
assert.ok(body.indexOf('if(!store.ok)return store')<body.indexOf('setSetting(HISTORY_KEY'),'corrupted history must fail closed before any overwrite');
console.log('activity extra attempt history write integrity and corrupted-store contract self-test passed');
