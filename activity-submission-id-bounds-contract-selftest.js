const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  "function submissionIdOf(value){const id=clean(value,100)",
  "/^[A-Za-z0-9._:-]{8,100}$/.test(id)?id:''",
  "activityId=clean(req.body?.activityId,40)",
  "submissionId=submissionIdOf(req.body?.submissionId)",
  "if(!/^[a-z0-9-]+$/.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity'})",
  "const clean=(v,n=80)=>String(v??'').trim().slice(0,n)"
])assert.ok(src.includes(token),`submission/input bound missing: ${token}`);
const key='`${name}\\u0000${activityId}\\u0000${submissionId}`';
assert.ok(src.includes(key),'retry cache key must keep student, activity and validated submission id separated');
assert.ok(src.includes('if(!submissionId)return null'),'invalid or empty submission id must not read retry cache');
assert.ok(src.includes('if(!submissionId)return;'),'invalid or empty submission id must not populate retry cache');
console.log('activity submission id bounds contract self-test passed');
