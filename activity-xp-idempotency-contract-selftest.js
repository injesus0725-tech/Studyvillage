const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'const name=req.session.name,cached=cachedSubmission(name,activityId,submissionId);',
  'if(cached)return res.json({...cached,deduplicated:true});',
  "if(nextGained)db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name)",
  'rememberSubmission(name,activityId,submissionId,result)'
])assert.ok(src.includes(token),`activity XP idempotency guard missing: ${token}`);
assert.ok(/adjusted\s*=\s*latestDecision\.awardXp\?growthAdjustedXp\(latestPlayer\.xp,baseXp\):0/.test(src),'XP base must derive from the latest transactional decision and current XP growth scaling');
assert.ok(/nextGained\s*=\s*latestDecision\.awardXp\?Math\.max\(0,Math\.round\(adjusted\*explore\.multiplier\)\+explore\.findBonusXp\):0/.test(src),'XP award must apply the verified NPC multiplier and discovery bonus after latest policy evaluation');
const routeStart=src.indexOf("app.post('/api/player/me/activity'");
const cached=src.indexOf('if(cached)return res.json({...cached,deduplicated:true});',routeStart);
const txMatch=/\b(?:const\s+)?tx\s*=\s*db\.transaction\(\(\)=>\{/.exec(src.slice(routeStart));
const txStart=txMatch?routeStart+txMatch.index:-1;
const xp=src.indexOf("UPDATE players SET xp=xp+?",txStart);
const txResult=src.indexOf('const result=tx();',txStart);
const failedResult=src.indexOf('if(!result.ok)return res.status(409).json(result)',txResult);
const remember=src.indexOf('rememberSubmission(name,activityId,submissionId,result)',failedResult);
assert.ok(routeStart>=0&&cached>=0&&txStart>cached&&xp>txStart,'duplicate submission must return before transactional XP mutation');
assert.ok(txResult>xp&&failedResult>txResult&&remember>failedResult,'only successful transactional XP results may enter the retry cache');
console.log('activity XP idempotency contract self-test passed');
