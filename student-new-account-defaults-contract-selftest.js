const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const loginStart=src.indexOf("app.post('/api/login'");
const meStart=src.indexOf("app.get('/api/player/me'",loginStart);
assert.ok(loginStart>=0&&meStart>loginStart,'student login route must exist');
const login=src.slice(loginStart,meStart);
assert.ok(login.includes("INSERT INTO players(name,password_hash,password_salt,login_count,last_login_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?)"),'new account insert must rely on database defaults for score/xp/avatar state');
assert.ok(login.includes('salt,1,now,now,now'),'first account creation must start login_count at 1');
assert.ok(login.includes('isNew=true'),'fresh account response must be marked as new');
assert.ok(login.includes("logActivity(name,'account-created'"),'fresh account creation must be recorded');
for(const token of [
  'total_score INTEGER NOT NULL DEFAULT 0',
  'attempts INTEGER NOT NULL DEFAULT 0',
  'best_score INTEGER NOT NULL DEFAULT 0',
  'last_score INTEGER NOT NULL DEFAULT 0',
  'xp INTEGER NOT NULL DEFAULT 0',
  "base_character TEXT NOT NULL DEFAULT 'student-default'",
  "equipment_json TEXT NOT NULL DEFAULT '{}'"
])assert.ok(src.includes(token),`fresh account database default missing: ${token}`);
assert.ok(src.includes('levelFromXp=xp=>')&&src.includes('let level=1'),'zero XP must still start at level 1');
assert.ok(src.includes("let title='새싹 주민'"),'fresh account must start with the beginner title');
console.log('student new account defaults contract self-test passed');
