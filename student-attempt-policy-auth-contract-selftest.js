const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('activity-gate.js','utf8');
assert.ok(src.includes("const headers=window.StudyVillageAuth?.authHeaders?.()||{}"),'attempt checks must obtain the current student auth headers');
assert.ok(src.includes("timedFetch(`/api/player/me/activity-attempt-status/${encodeURIComponent(recordId)}`,{headers,cache:'no-store'})"),'attempt status request must include current student authentication');
assert.ok(src.includes('extraAttempts:data.extraAttempts')&&src.includes('policy:data.policy')&&src.includes('policyId:data.policyId'),'the gate must retain the canonical server decision including teacher-granted extra attempts and policy metadata');
assert.ok(src.includes("if(!response.ok||!data.ok)return{ok:false"),'invalid or unauthorized attempt responses must fail closed');
console.log('student attempt policy auth contract self-test passed');
