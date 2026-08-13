const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "return{ok:false,code:'invalid-history-value'}",
  "const delta=Number.isInteger(change)?change:afterValue-beforeValue",
  "return{ok:false,code:'invalid-history-delta'}",
  "type==='grant'&&delta<=0",
  "type==='consume'&&delta>=0",
  "amount:delta,before:beforeValue,after:afterValue"
])assert.ok(src.includes(token),`history write integrity guard missing: ${token}`);
assert.ok(src.indexOf("if(!Number.isInteger(beforeValue)")<src.indexOf('let rows=[]'),'invalid values must be rejected before history is read/written');
assert.ok(src.indexOf("afterValue-beforeValue!==delta")<src.indexOf('let rows=[]'),'mismatched deltas must be rejected before history is written');
assert.ok(src.indexOf("type==='grant'&&delta<=0")<src.indexOf('let rows=[]'),'zero/negative grants must be rejected before history is written');
console.log('activity extra attempt history write integrity contract self-test passed');
