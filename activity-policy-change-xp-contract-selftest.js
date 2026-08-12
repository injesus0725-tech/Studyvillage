const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txStart=src.indexOf('const tx=db.transaction(()=>{'),txEnd=src.indexOf('const result=tx();',txStart),tx=src.slice(txStart,txEnd);
for(const token of [
  'latestDecision=evaluateWithExtra(latestPolicy,latest||{},latestExtra)',
  'nextGained=latestDecision.awardXp?baseXp:0',
  "if(nextGained)db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?')",
  "else db.prepare('UPDATE players SET updated_at=? WHERE name=?')",
  'gainedXp:nextGained',
  'policy:latestDecision.policy'
])assert.ok(tx.includes(token),`latest XP policy guard missing: ${token}`);
assert.ok(tx.indexOf('latestDecision=evaluateWithExtra')<tx.indexOf('nextGained=latestDecision.awardXp?baseXp:0'),'XP decision must come from latest policy evaluation');
assert.ok(tx.indexOf('nextGained=latestDecision.awardXp?baseXp:0')<tx.indexOf('UPDATE players SET xp=xp+?'),'XP amount must be decided before player XP write');
console.log('activity policy change XP contract self-test passed');
