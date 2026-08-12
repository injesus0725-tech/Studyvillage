const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txStart=src.indexOf('const tx=db.transaction(()=>{');
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(txStart>=0&&txEnd>txStart,'activity save must run inside a transaction');
const tx=src.slice(txStart,txEnd);
for(const token of [
  'INSERT INTO activity_records',
  'consumeExtraAttempts',
  'UPDATE players SET xp=xp+?',
  'logActivity(db,name',
  'throw Object.assign(new Error(consumed.code)'
])assert.ok(tx.includes(token),`transactional activity write missing: ${token}`);
const remember=src.indexOf('rememberSubmission(name,activityId,submissionId,result)');
assert.ok(remember>txEnd,'retry cache must only be written after transaction succeeds');
assert.ok(src.indexOf("if(!result.ok)return res.status(409).json(result)")<remember,'failed attempt-limit transaction must not enter retry cache');
assert.ok(src.includes("catch(err){res.status(500).json({ok:false,code:err?.code||'activity-save-failed'"),'transaction errors must fail closed');
console.log('activity save failure rollback contract self-test passed');
