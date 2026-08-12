const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8');
const activity=fs.readFileSync('server/activity-attempt-student.js','utf8');

assert.ok(server.includes("INSERT INTO players(name,password_hash,password_salt,login_count,last_login_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?)"),'new account insert must rely on safe score/xp defaults');
assert.ok(server.includes(".run(name,hashPassword(password,salt),salt,1,now,now,now)"),'fresh account first login count must start at one');
assert.ok(server.includes("total_score INTEGER NOT NULL DEFAULT 0"),'fresh total score must start at zero');
assert.ok(server.includes("attempts INTEGER NOT NULL DEFAULT 0"),'fresh attempts must start at zero');
assert.ok(server.includes("xp INTEGER NOT NULL DEFAULT 0"),'fresh XP must start at zero');
assert.ok(server.includes("base_character TEXT NOT NULL DEFAULT 'student-default'"),'fresh account must use the default character');
assert.ok(server.includes("equipment_json TEXT NOT NULL DEFAULT '{}'"),'fresh account must have no equipped items');

for(const token of [
  'const tx=db.transaction(()=>{',
  'const nextAttempts=(latest?.attempts||0)+1',
  'const nextTotal=(latest?.total_score||0)+score',
  'const now=new Date().toISOString(),baseXp=20+Math.floor(score/10)',
  'const nextGained=latestDecision.awardXp?baseXp:0',
  "db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name)",
  'record:{activityId,attempts:nextAttempts,bestScore:nextBest,lastScore:score,totalScore:nextTotal,updatedAt:now}'
])assert.ok(activity.includes(token),`fresh-account first activity guard missing: ${token}`);

const txStart=activity.indexOf('const tx=db.transaction(()=>{');
const txEnd=activity.indexOf('const result=tx();',txStart);
const txBody=activity.slice(txStart,txEnd);
assert.ok(txBody.includes('INSERT INTO activity_records'),'first activity must create its activity record atomically');
assert.ok(txBody.includes('UPDATE players SET xp=xp+?'),'first activity XP must be awarded in the same transaction');
assert.ok(!txBody.includes('star_ledger'),'first activity save must not accidentally reuse or mutate a previous star ledger');
console.log('student first activity fresh account contract self-test passed');
