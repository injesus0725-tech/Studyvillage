const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'function submissionIdOf(value)',
  'const id=clean(value,100)',
  "/^[A-Za-z0-9._:-]{8,100}$/.test(id)?id:''",
  'submissionId=submissionIdOf(req.body?.submissionId)',
  'if(!submissionId)return null',
  'if(!submissionId)return;'
])assert.ok(src.includes(token),`submission id validation guard missing: ${token}`);
assert.ok(src.includes('`${name}\\u0000${activityId}\\u0000${submissionId}`'),'validated submission id must be scoped by student and activity');
console.log('activity submission id validation contract self-test passed');
