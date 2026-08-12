const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'SUBMISSION_TTL_MS=30*60*1000',
  'MAX_RECENT_SUBMISSIONS=1000',
  'if(now-row.savedAt>SUBMISSION_TTL_MS)recentSubmissions.delete(key)',
  'while(recentSubmissions.size>MAX_RECENT_SUBMISSIONS)',
  '`${name}\\u0000${activityId}\\u0000${submissionId}`',
  'if(!submissionId)return null',
  'if(!submissionId)return;'
])assert.ok(src.includes(token),`submission cache scope guard missing: ${token}`);
assert.ok(src.indexOf('const name=req.session.name,cached=cachedSubmission')<src.indexOf('db=openDb()'),'retry cache should short-circuit before database writes');
assert.ok(src.indexOf('rememberSubmission(name,activityId,submissionId,result)')>src.indexOf('if(!result.ok)return res.status(409).json(result)'),'only successful saves may enter retry cache');
console.log('activity submission cache scope contract self-test passed');
