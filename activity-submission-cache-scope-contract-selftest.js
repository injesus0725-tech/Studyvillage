const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'SUBMISSION_TTL_MS=30*60*1000',
  'MAX_RECENT_SUBMISSIONS=1000',
  'if(now-row.savedAt>SUBMISSION_TTL_MS)recentSubmissions.delete(key)',
  'while(recentSubmissions.size>MAX_RECENT_SUBMISSIONS)',
  '`${name}\\u0000${activityId}\\u0000${submissionId}`',
  'if(!submissionId)return null'
])assert.ok(src.includes(token),`submission cache scope guard missing: ${token}`);
assert.ok(/function rememberSubmission\([^)]*submissionId[^)]*\)\{(?:if\(!submissionId\)return;|if\(submissionId\)recentSubmissions\.set\()/.test(src),'submission cache writes must be disabled when submissionId is absent');
const routeStart=src.indexOf("app.post('/api/player/me/activity'");
const cachedCall=src.indexOf('cachedSubmission(name,activityId,submissionId)',routeStart);
const dbOpen=src.indexOf('db=openDb()',cachedCall);
const txMatch=/\b(?:const\s+)?tx\s*=\s*db\.transaction\(\(\)=>\{/.exec(src.slice(dbOpen));
const txStart=txMatch?dbOpen+txMatch.index:-1;
const txResult=txStart>=0?src.indexOf('const result=tx();',txStart):-1;
const failedResult=txResult>=0?src.indexOf('if(!result.ok)return res.status(409).json(result)',txResult):-1;
const remember=failedResult>=0?src.indexOf('rememberSubmission(name,activityId,submissionId,result)',failedResult):-1;
assert.ok(routeStart>=0&&cachedCall>=0&&dbOpen>cachedCall,'retry cache should short-circuit before database writes');
assert.ok(txResult>=0&&failedResult>txResult&&remember>failedResult,'only successful saves may enter retry cache');
console.log('activity submission cache scope contract self-test passed');
