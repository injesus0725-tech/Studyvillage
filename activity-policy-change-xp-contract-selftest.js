const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const settings=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const txStart=src.search(/(?:const\s+)?tx\s*=\s*db\.transaction\(\(\)=>\{/),txEnd=src.indexOf('const result=tx();',txStart),tx=src.slice(txStart,txEnd);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction must exist');
for(const pattern of [
  /latestAttemptRecord\s*=\s*policyRecord\(db,name,activityId,latestPolicy,latest\|\|\{\}\)/,
  /latestDecision\s*=\s*evaluateWithExtra\(latestPolicy,latestAttemptRecord,latestExtra\)/,
  /adjusted\s*=\s*latestDecision\.awardXp\?growthAdjustedXp\(latestPlayer\.xp,baseXp\):0/,
  /nextGained\s*=\s*latestDecision\.awardXp\?Math\.max\(0,Math\.round\(adjusted\*explore\.multiplier\)\+explore\.findBonusXp\+explore\.xpDelta\):0/,
  /if\(nextGained\)db\.prepare\('UPDATE players SET xp=xp\+\?,updated_at=\? WHERE name=\?'\)/,
  /else db\.prepare\('UPDATE players SET updated_at=\? WHERE name=\?'\)/,
  /gainedXp\s*:\s*nextGained/,
  /policy\s*:\s*\{\.\.\.latestDecision\.policy,period:latestPolicy\?\.period\|\|'all-time'\}/
])assert.ok(pattern.test(tx),`latest XP policy guard missing: ${pattern}`);
const decisionAt=tx.search(/latestDecision\s*=\s*evaluateWithExtra/),gainAt=tx.search(/nextGained\s*=\s*latestDecision\.awardXp\?Math\.max/),writeAt=tx.indexOf('UPDATE players SET xp=xp+?');
assert.ok(decisionAt>=0&&gainAt>decisionAt,'XP decision must come from latest policy evaluation');
assert.ok(writeAt>gainAt,'XP amount must be decided before player XP write');

// Every core learning completion that the teacher authorizes must remain reward-bearing.
// A saved legacy first-completion value must never turn an increased attempt limit into 0 XP.
for(const activityId of ['riddle-demo','library-vocabulary','math-arithmetic','curriculum-korean','curriculum-math','curriculum-social','curriculum-science','curriculum-arts','exploration-korean','exploration-social','exploration-science','exploration-random']){
  assert.ok(settings.includes(`'${activityId}'`),`core reward activity missing: ${activityId}`);
}
assert.match(settings,/REPEAT_XP_ACTIVITIES=new Set\(\['riddle-demo','library-vocabulary'/,'riddle-demo must be protected from legacy first-completion saves');
assert.match(settings,/REPEAT_XP_ACTIVITIES\.has\(id\)\?\{\.\.\.normalized,xpMode:'every-attempt'\}/,'saved core policies must be normalized to every-attempt rewards');

// Retried network submissions may return the cached result, but must not award twice.
const cachedAt=src.indexOf('cachedSubmission(name,activityId,submissionId)'),txAt=src.indexOf('db.transaction(()=>{');
assert.ok(cachedAt>=0&&txAt>cachedAt,'submission deduplication must run before the reward transaction');
assert.match(src,/if\(cached\)return res\.json\(\{\.\.\.cached,deduplicated:true\}\)/,'duplicate submission must reuse the prior result');

console.log('activity policy change XP contract self-test passed');
