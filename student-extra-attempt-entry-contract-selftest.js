const fs=require('fs'),assert=require('assert');
const gate=fs.readFileSync('activity-gate.js','utf8');
const server=fs.readFileSync('server/activity-attempt-student.js','utf8');

assert.ok(gate.includes("const recordIds={'riddle-demo':'riddle','library-vocabulary':'vocabulary'}"),'entry checks must use the activity IDs stored in student records');
assert.ok(gate.includes('/api/player/me/activity-attempt-status/${encodeURIComponent(recordId)}'),'entry checks must use the server decision that includes extra attempts');
assert.ok(!gate.includes("timedFetch(`/api/activity-attempt-policy/${encodeURIComponent(id)}`"),'the client must not recompute attempt allowance from policy alone');
assert.ok(server.includes("const POLICY_ALIASES={vocabulary:'library-vocabulary',riddle:'riddle-demo'}"),'stored riddle and vocabulary IDs must resolve to teacher policy IDs');
assert.ok(server.includes('allowed=base.allowed||extra>0'),'server status must allow a teacher-granted extra attempt after the base limit is exhausted');
console.log('student extra attempt entry contract self-test passed');
