const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txStart=src.indexOf('const tx=db.transaction(()=>{');
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction must exist');
const body=src.slice(txStart,txEnd);
for(const token of [
  'INSERT INTO activity_records',
  'consumeExtraAttempts',
  'UPDATE players SET xp=xp+?',
  'logActivity(db,name,`activity-${activityId}`'
])assert.ok(body.includes(token),`activity save operation must remain inside transaction: ${token}`);
assert.ok(src.includes("catch(err){res.status(500).json({ok:false,code:err?.code||'activity-save-failed'"),'activity save exceptions must fail closed');
assert.ok(src.includes('finally{try{db?.close()}catch{}}'),'activity DB must close even after rollback/failure');
console.log('activity save rollback contract self-test passed');
