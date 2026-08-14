const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'const SUBMISSION_TTL_MS=30*60*1000',
  'MAX_RECENT_SUBMISSIONS=1000',
  'cachedSubmission(name,activityId,submissionId)',
  "if(cached)return res.json({...cached,deduplicated:true})",
  'rememberSubmission(name,activityId,submissionId,result)'
])assert.ok(src.includes(token),`activity retry/idempotency guard missing: ${token}`);
assert.ok(/nextAttempts\s*=\s*\(latest\?\.attempts\|\|0\)\+1/.test(src),'attempt count must advance from the latest transactional record');
assert.ok(/nextBest\s*=\s*Math\.max\(latest\?\.best_score\|\|0\s*,\s*score\)/.test(src),'best score must use the latest transactional record');
assert.ok(/nextTotal\s*=\s*\(latest\?\.total_score\|\|0\)\+score/.test(src),'total score must use the latest transactional record');
const routeStart=src.indexOf("app.post('/api/player/me/activity'");
const cachedCall=src.indexOf('cachedSubmission(name,activityId,submissionId)',routeStart);
const txStart=src.indexOf('const tx=db.transaction(()=>{',routeStart);
const txResult=src.indexOf('const result=tx();',txStart);
const rememberCall=src.indexOf('rememberSubmission(name,activityId,submissionId,result)',txResult);
assert.ok(routeStart>=0&&cachedCall>=0&&cachedCall<txStart,'duplicate submission must be rejected before transactional mutation');
assert.ok(txResult>=0&&rememberCall>txResult,'submission must be remembered only after successful transaction');
assert.ok(src.indexOf('if(!result.ok)return res.status(409).json(result)',txResult)<rememberCall,'failed transaction results must not enter the idempotency cache');
console.log('activity retry idempotency contract self-test passed');
