const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'const name=req.session.name,cached=cachedSubmission(name,activityId,submissionId);',
  'if(cached)return res.json({...cached,deduplicated:true});',
  "if(nextGained)db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name)",
  'rememberSubmission(name,activityId,submissionId,result)'
])assert.ok(src.includes(token),`activity XP idempotency guard missing: ${token}`);
assert.ok(/nextGained\s*=\s*latestDecision\.awardXp\?baseXp:0/.test(src),'XP award must derive from the latest transactional decision');
const routeStart=src.indexOf("app.post('/api/player/me/activity'");
const cached=src.indexOf('if(cached)return res.json({...cached,deduplicated:true});',routeStart);
const txStart=src.indexOf('const tx=db.transaction(()=>{',routeStart);
const xp=src.indexOf("UPDATE players SET xp=xp+?",txStart);
const txResult=src.indexOf('const result=tx();',txStart);
const failedResult=src.indexOf('if(!result.ok)return res.status(409).json(result)',txResult);
const remember=src.indexOf('rememberSubmission(name,activityId,submissionId,result)',failedResult);
assert.ok(routeStart>=0&&cached>=0&&txStart>cached&&xp>txStart,'duplicate submission must return before transactional XP mutation');
assert.ok(txResult>xp&&failedResult>txResult&&remember>failedResult,'only successful transactional XP results may enter the retry cache');
console.log('activity XP idempotency contract self-test passed');
