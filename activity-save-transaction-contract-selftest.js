const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');

for(const token of [
  "app.post('/api/player/me/activity'",
  'const tx=db.transaction(()=>{',
  "const latest=db.prepare('SELECT * FROM activity_records WHERE player_name=? AND activity_id=?').get(name,activityId)",
  'latestDecision=evaluateWithExtra(policy,latest||{},latestExtra)',
  'const nextAttempts=(latest?.attempts||0)+1',
  'const nextTotal=(latest?.total_score||0)+score',
  "db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name)",
  'const result=tx();',
  'rememberSubmission(name,activityId,submissionId,result)'
])assert.ok(src.includes(token),`transactional activity-save guard missing: ${token}`);

const txStart=src.indexOf('const tx=db.transaction(()=>{');
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction boundaries missing');
const txBody=src.slice(txStart,txEnd);
assert.ok(txBody.indexOf("SELECT * FROM activity_records")<txBody.indexOf('nextAttempts='),'latest activity record must be re-read before calculating the next attempt');
assert.ok(txBody.includes('consumeExtraAttempts'),'extra-attempt consumption must be atomic with the activity save');
assert.ok(txBody.includes('UPDATE players SET xp=xp+?'),'XP award must be atomic with the activity save');

console.log('activity save transaction contract self-test passed');
