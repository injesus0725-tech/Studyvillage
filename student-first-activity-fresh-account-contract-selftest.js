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

assert.ok(activity.includes('const tx=db.transaction(()=>{'),'first activity save must use a transaction');
assert.ok(/nextAttempts\s*=\s*\(latest\?\.attempts\|\|0\)\+1/.test(activity),'first activity must increment attempts from zero/latest record');
assert.ok(/nextBest\s*=\s*Math\.max\(latest\?\.best_score\|\|0\s*,\s*score\)/.test(activity),'first activity best score must derive from zero/latest record');
assert.ok(/nextTotal\s*=\s*\(latest\?\.total_score\|\|0\)\+score/.test(activity),'first activity total score must derive from zero/latest record');
assert.ok(activity.includes('const now=new Date().toISOString(),baseXp=20+Math.floor(score/10)'),'first activity XP basis must be calculated before the transaction');
assert.ok(/nextGained\s*=\s*latestDecision\.awardXp\?baseXp:0/.test(activity),'first activity XP must follow latest policy decision');
assert.ok(activity.includes("db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name)"),'first activity XP update must target the current student');
assert.ok(activity.includes('record:{activityId,attempts:nextAttempts,bestScore:nextBest,lastScore:score,totalScore:nextTotal,updatedAt:now}'),'first activity response must return the saved aggregate record');

const routeStart=activity.indexOf("app.post('/api/player/me/activity'");
const txStart=activity.indexOf('const tx=db.transaction(()=>{',routeStart);
const txEnd=activity.indexOf('const result=tx();',txStart);
const txBody=activity.slice(txStart,txEnd);
assert.ok(routeStart>=0&&txStart>routeStart&&txEnd>txStart,'first activity transaction must belong to the student activity route');
assert.ok(txBody.includes('INSERT INTO activity_records'),'first activity must create its activity record atomically');
assert.ok(txBody.includes('UPDATE players SET xp=xp+?'),'first activity XP must be awarded in the same transaction');
assert.ok(txBody.indexOf('INSERT INTO activity_records')<txBody.indexOf('UPDATE players SET xp=xp+?'),'activity record must be saved before XP mutation in the same transaction');
assert.ok(!txBody.includes('star_ledger'),'first activity save must not accidentally reuse or mutate a previous star ledger');
console.log('student first activity fresh account contract self-test passed');
