const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
for(const token of [
  'const name=req.session.name,cached=cachedSubmission(name,activityId,submissionId);',
  'if(cached)return res.json({...cached,deduplicated:true});',
  'const nextGained=latestDecision.awardXp?baseXp:0;',
  "if(nextGained)db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name)",
  'rememberSubmission(name,activityId,submissionId,result)'
])assert.ok(src.includes(token),`activity XP idempotency guard missing: ${token}`);
const cached=src.indexOf('if(cached)return res.json({...cached,deduplicated:true});');
const xp=src.indexOf("UPDATE players SET xp=xp+?");
assert.ok(cached>=0&&xp>=0&&cached<xp,'duplicate submission must return before any XP update');
const remember=src.indexOf('rememberSubmission(name,activityId,submissionId,result)');
assert.ok(remember>xp,'successful result must be remembered only after the transactional XP path finishes');
console.log('activity XP idempotency contract self-test passed');
