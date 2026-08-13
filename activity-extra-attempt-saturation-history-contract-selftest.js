const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
assert.ok(src.includes('const next=Math.min(1000,current+add)'),'grant must cap current balance at 1000');
assert.ok(src.includes("if(result.ok&&recordHistory&&next>current)appendExtraAttemptHistory"),'saturated grants must not create zero-delta history');
assert.ok(src.includes("if(type==='grant'&&delta<=0)return{ok:false,code:'invalid-history-delta'}"),'grant history must require a positive delta');
assert.ok(src.includes("if(type==='consume'&&delta>=0)return{ok:false,code:'invalid-history-delta'}"),'consume history must require a negative delta');
console.log('activity extra attempt saturation history contract self-test passed');
