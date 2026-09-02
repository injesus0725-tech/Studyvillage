const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
assert.ok(/SUBMISSION_TTL_MS\s*=\s*30\*60\*1000/.test(src),'submission retry TTL guard missing');
assert.ok(/MAX_RECENT_SUBMISSIONS\s*=\s*1000/.test(src),'submission retry cache bound missing');
for(const token of [
  'cachedSubmission(name,activityId,submissionId)',
  "if(cached)return res.json({...cached,deduplicated:true})",
  'rememberSubmission(name,activityId,submissionId,result)'
])assert.ok(src.includes(token),`activity retry/idempotency guard missing: ${token}`);
assert.ok(/nextAttempts\s*=\s*\(latest\?\.attempts\|\|0\)\+1/.test(src),'attempt count must advance from the latest transactional record');
assert.ok(/nextBest\s*=\s*Math\.max\(latest\?\.best_score\|\|0\s*,\s*score\)/.test(src),'best score must use the latest transactional record');
assert.ok(/nextTotal\s*=\s*\(latest\?\.total_score\|\|0\)\+score/.test(src),'total score must use the latest transactional record');
const routeStart=src.indexOf("app.post('/api/player/me/activity'");
const cachedCall=src.indexOf('cachedSubmission(name,activityId,submissionId)',routeStart);
const txStart=src.slice(routeStart).search(/(?:const\s+)?tx\s*=\s*db\.transaction\(\(\)=>\{/);
const txAbsolute=txStart>=0?routeStart+txStart:-1;
const txResult=src.indexOf('const result=tx();',txAbsolute);
const rememberCall=src.indexOf('rememberSubmission(name,activityId,submissionId,result)',txResult);
assert.ok(routeStart>=0&&cachedCall>=0&&txAbsolute>=0&&cachedCall<txAbsolute,'duplicate submission must be rejected before transactional mutation');
assert.ok(txResult>=0&&rememberCall>txResult,'submission must be remembered only after successful transaction');
assert.ok(src.indexOf('if(!result.ok)return res.status(409).json(result)',txResult)<rememberCall,'failed transaction results must not enter the idempotency cache');
console.log('activity retry idempotency contract self-test passed');
