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
assert.ok(src.indexOf('cachedSubmission(name,activityId,submissionId)')<src.indexOf('const tx=db.transaction(()=>{'),'duplicate submission must be rejected before transactional mutation');
assert.ok(src.indexOf('rememberSubmission(name,activityId,submissionId,result)')>src.indexOf('const result=tx();'),'submission must be remembered only after successful transaction');
console.log('activity retry idempotency contract self-test passed');
