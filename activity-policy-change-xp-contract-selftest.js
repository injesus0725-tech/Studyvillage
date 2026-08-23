const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txStart=src.search(/(?:const\s+)?tx\s*=\s*db\.transaction\(\(\)=>\{/),txEnd=src.indexOf('const result=tx();',txStart),tx=src.slice(txStart,txEnd);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction must exist');
for(const pattern of [
  /latestAttemptRecord\s*=\s*policyRecord\(db,name,activityId,latestPolicy,latest\|\|\{\}\)/,
  /latestDecision\s*=\s*evaluateWithExtra\(latestPolicy,latestAttemptRecord,latestExtra\)/,
  /adjusted\s*=\s*latestDecision\.awardXp\?growthAdjustedXp\(latestPlayer\.xp,baseXp\):0/,
  /nextGained\s*=\s*latestDecision\.awardXp\?Math\.max\(0,Math\.round\(adjusted\*explore\.multiplier\)\+explore\.findBonusXp\):0/,
  /if\(nextGained\)db\.prepare\('UPDATE players SET xp=xp\+\?,updated_at=\? WHERE name=\?'\)/,
  /else db\.prepare\('UPDATE players SET updated_at=\? WHERE name=\?'\)/,
  /gainedXp\s*:\s*nextGained/,
  /policy\s*:\s*\{\.\.\.latestDecision\.policy,period:latestPolicy\?\.period\|\|'all-time'\}/
])assert.ok(pattern.test(tx),`latest XP policy guard missing: ${pattern}`);
const decisionAt=tx.search(/latestDecision\s*=\s*evaluateWithExtra/),gainAt=tx.search(/nextGained\s*=\s*latestDecision\.awardXp\?Math\.max/),writeAt=tx.indexOf('UPDATE players SET xp=xp+?');
assert.ok(decisionAt>=0&&gainAt>decisionAt,'XP decision must come from latest policy evaluation');
assert.ok(writeAt>gainAt,'XP amount must be decided before player XP write');
console.log('activity policy change XP contract self-test passed');
