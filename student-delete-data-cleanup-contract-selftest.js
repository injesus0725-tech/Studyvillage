const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const start=src.indexOf('const deleteStudentData=db.transaction');
const end=src.indexOf("app.delete('/api/admin/player/:name'",start);
assert.ok(start>=0&&end>start,'student delete transaction must exist');
const block=src.slice(start,end);
for(const token of [
  "DELETE FROM score_alert_reviews WHERE ledger_id IN (SELECT id FROM score_ledger WHERE player_name=?)",
  "DELETE FROM score_corrections WHERE player_name=?",
  "DELETE FROM score_ledger WHERE player_name=?",
  "DELETE FROM star_ledger WHERE player_name=?",
  "DELETE FROM activity_records WHERE player_name=?",
  "DELETE FROM activity_log WHERE player_name=?",
  "DELETE FROM error_reports WHERE player_name=?",
  "DELETE FROM settings WHERE key=?",
  "activity-attempt-extra:v1:",
  "DELETE FROM players WHERE name=?"
])assert.ok(block.includes(token),`student deletion cleanup missing: ${token}`);
assert.ok(block.indexOf("activity-attempt-extra:v1:")<block.indexOf("DELETE FROM players WHERE name=?"),'per-student extra-attempt settings must be removed before player row');
assert.ok(block.indexOf("DELETE FROM players WHERE name=?")>block.indexOf("DELETE FROM activity_records WHERE player_name=?"),'dependent records should be removed before player row');
console.log('student delete data cleanup contract self-test passed');
