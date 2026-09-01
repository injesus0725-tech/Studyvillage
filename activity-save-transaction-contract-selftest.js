const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');

for(const token of [
  "app.post('/api/player/me/activity'",
  'const tx=db.transaction(()=>{',
  "const latest=db.prepare('SELECT * FROM activity_records WHERE player_name=? AND activity_id=?').get(name,activityId)",
  'latestAttemptRecord=policyRecord(db,name,activityId,latestPolicy,latest||{})',
  'latestDecision=evaluateWithExtra(latestPolicy,latestAttemptRecord,latestExtra)',
  "db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name)",
  'const result=tx();',
  'rememberSubmission(name,activityId,submissionId,result)'
])assert.ok(src.includes(token),`transactional activity-save guard missing: ${token}`);

const routeStart=src.indexOf("app.post('/api/player/me/activity'");
const txStart=src.indexOf('const tx=db.transaction(()=>{',routeStart);
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(routeStart>=0&&txStart>=0&&txEnd>txStart,'activity save transaction boundaries missing');
const txBody=src.slice(txStart,txEnd);
assert.ok(txBody.includes('latestPolicy'),'activity save must re-read the latest policy inside the transaction');
assert.ok(txBody.includes('latestAttemptRecord=policyRecord'),'activity save must rebuild the policy-scoped attempt record inside the transaction');
assert.ok(txBody.indexOf("SELECT * FROM activity_records")<txBody.search(/nextAttempts\s*=/),'latest activity record must be re-read before calculating the next attempt');
assert.ok(/nextAttempts\s*=\s*\(latest\?\.attempts\|\|0\)\+1/.test(txBody),'attempt count must use the latest transactional record');
assert.ok(/nextTotal\s*=\s*\(latest\?\.total_score\|\|0\)\+score/.test(txBody),'total score must use the latest transactional record');
assert.ok(txBody.includes('consumeExtraAttempts'),'extra-attempt consumption must be atomic with the activity save');
assert.ok(txBody.includes('UPDATE players SET xp=xp+?'),'XP award must be atomic with the activity save');
const failedResult=src.indexOf('if(!result.ok)return res.status(409).json(result)',txEnd);
const remember=src.indexOf('rememberSubmission(name,activityId,submissionId,result)',txEnd);
assert.ok(failedResult>=txEnd&&remember>failedResult,'only a successful transaction may enter the retry cache');

console.log('activity save transaction contract self-test passed');
