const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  "const activityId=clean(req.body?.activityId,40)",
  'score=Math.max(0,Math.min(1000,Number(req.body?.score)||0))',
  "if(!/^[a-z0-9-]+$/.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity'})",
  'const now=new Date().toISOString(),baseXp=20+Math.floor(score/10)'
])assert.ok(src.includes(token),`activity score/input guard missing: ${token}`);
assert.ok(src.includes("const clean=(v,n=80)=>String(v??'').trim().slice(0,n)"),'activity inputs must be normalized and bounded');
console.log('activity score input bounds contract self-test passed');
