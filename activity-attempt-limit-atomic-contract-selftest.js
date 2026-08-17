const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'const tx=db.transaction(()=>{',
  'latestAttemptRecord=policyRecord(db,name,activityId,latestPolicy,latest||{})',
  'latestDecision=evaluateWithExtra(latestPolicy,latestAttemptRecord,latestExtra)',
  "if(!latestDecision.allowed)return{ok:false,code:'attempt-limit-reached'",
  'if(latestDecision.usingExtra){const consumed=consumeExtraAttempts',
  "if(!consumed.ok)throw Object.assign(new Error(consumed.code),{code:consumed.code})",
  'if(!result.ok)return res.status(409).json(result)'
])assert.ok(src.includes(token),`attempt-limit atomic guard missing: ${token}`);
const txStart=src.indexOf('const tx=db.transaction(()=>{');
const txEnd=src.indexOf('const result=tx();',txStart);
const body=src.slice(txStart,txEnd);
assert.ok(body.indexOf('latestDecision=evaluateWithExtra')<body.indexOf('INSERT INTO activity_records'),'latest attempt limit must be rechecked before saving');
assert.ok(body.indexOf('consumeExtraAttempts')<body.indexOf('UPDATE players SET xp=xp+?'),'extra attempt must be consumed in the same transaction before XP update');
console.log('activity attempt limit atomic contract self-test passed');
