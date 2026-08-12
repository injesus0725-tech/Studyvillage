const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('activity-gate.js','utf8');
assert.ok(src.includes("const headers=window.StudyVillageAuth?.authHeaders?.()||{}"),'attempt checks must obtain the current student auth headers');
assert.ok(src.includes("timedFetch(`/api/activity-attempt-policy/${encodeURIComponent(id)}`,{headers,cache:'no-store'})"),'attempt policy request must include student authentication');
assert.ok(src.includes("timedFetch('/api/player/me',{headers,cache:'no-store'})"),'player attempt count request must use the same student authentication');
console.log('student attempt policy auth contract self-test passed');
