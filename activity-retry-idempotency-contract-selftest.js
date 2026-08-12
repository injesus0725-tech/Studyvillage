const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'const SUBMISSION_TTL_MS=30*60*1000',
  'MAX_RECENT_SUBMISSIONS=1000',
  'cachedSubmission(name,activityId,submissionId)',
  "if(cached)return res.json({...cached,deduplicated:true})",
  'rememberSubmission(name,activityId,submissionId,result)',
  'const nextAttempts=(latest?.attempts||0)+1',
  'const nextBest=Math.max(latest?.best_score||0,score)',
  'const nextTotal=(latest?.total_score||0)+score'
])assert.ok(src.includes(token),`activity retry/idempotency guard missing: ${token}`);
assert.ok(src.indexOf('cachedSubmission(name,activityId,submissionId)')<src.indexOf('const tx=db.transaction(()=>{'),'duplicate submission must be rejected before transactional mutation');
assert.ok(src.indexOf('rememberSubmission(name,activityId,submissionId,result)')>src.indexOf('const result=tx();'),'submission must be remembered only after successful transaction');
console.log('activity retry idempotency contract self-test passed');
