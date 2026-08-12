const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const delStart=src.indexOf('const deleteStudentData=db.transaction');
const delEnd=src.indexOf("app.delete('/api/admin/player/:name'",delStart);
assert.ok(delStart>=0&&delEnd>delStart,'student deletion transaction must exist');
const del=src.slice(delStart,delEnd);
for(const token of [
  "DELETE FROM score_alert_reviews",
  "DELETE FROM score_corrections WHERE player_name=?",
  "DELETE FROM score_ledger WHERE player_name=?",
  "DELETE FROM star_ledger WHERE player_name=?",
  "DELETE FROM activity_records WHERE player_name=?",
  "DELETE FROM activity_log WHERE player_name=?",
  "DELETE FROM error_reports WHERE player_name=?",
  "DELETE FROM settings WHERE key=?",
  "DELETE FROM players WHERE name=?"
])assert.ok(del.includes(token),`student deletion clean-slate guard missing: ${token}`);
const loginStart=src.indexOf("app.post('/api/login'");
const loginEnd=src.indexOf("app.get('/api/player/me'",loginStart);
const login=src.slice(loginStart,loginEnd);
assert.ok(login.includes("if(!row){const salt=crypto.randomBytes(16).toString('hex')"),'recreated student must receive fresh password salt');
assert.ok(login.includes("INSERT INTO players(name,password_hash,password_salt,login_count,last_login_at,created_at,updated_at)"),'recreated student must be inserted as a fresh player row');
assert.ok(login.includes('isNew=true'),'recreated student must be treated as a new account');
assert.ok(src.includes('clearStudentSessions(name)'),'deletion must invalidate old sessions before same-name recreation can continue safely');
console.log('student recreate clean slate contract self-test passed');
