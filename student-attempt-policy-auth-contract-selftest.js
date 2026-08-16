const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('activity-gate.js','utf8');
assert.ok(src.includes("const headers=window.StudyVillageAuth?.authHeaders?.()||{}"),'attempt checks must obtain the current student auth headers');
assert.ok(src.includes("timedFetch(`/api/player/me/activity-attempt-status/${encodeURIComponent(recordId)}`,{headers,cache:'no-store'})"),'attempt status request must include current student authentication');
assert.ok(src.includes('extraAttempts:status.extraAttempts'),'the gate must retain the server decision that includes teacher-granted extra attempts');
console.log('student attempt policy auth contract self-test passed');
