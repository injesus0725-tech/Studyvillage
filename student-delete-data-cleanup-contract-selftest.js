const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const start=src.indexOf('const deleteStudentData=db.transaction');
const end=src.indexOf("app.delete('/api/admin/player/:name'",start);
assert.ok(start>=0&&end>start,'student delete transaction must exist');
const block=src.slice(start,end);
for(const token of [
  'removeExtraAttemptStudentData({getSetting,setSetting',
  "deleteSetting:key=>db.prepare('DELETE FROM settings WHERE key=?').run(key)",
  "listSettingKeys:prefix=>db.prepare('SELECT key FROM settings WHERE key LIKE ?').all(`${prefix}%`).map(row=>row.key)",
  "throw Object.assign(new Error(cleanup.code),{cleanupCode:cleanup.code})",
  "DELETE FROM score_alert_reviews WHERE ledger_id IN (SELECT id FROM score_ledger WHERE player_name=?)",
  "DELETE FROM score_corrections WHERE player_name=?",
  "DELETE FROM score_ledger WHERE player_name=?",
  "DELETE FROM star_ledger WHERE player_name=?",
  "DELETE FROM activity_records WHERE player_name=?",
  "DELETE FROM activity_log WHERE player_name=?",
  "DELETE FROM error_reports WHERE player_name=?",
  "DELETE FROM players WHERE name=?"
])assert.ok(block.includes(token),`student deletion cleanup missing: ${token}`);
assert.ok(block.indexOf('removeExtraAttemptStudentData(')<block.indexOf("DELETE FROM players WHERE name=?"),'extra-attempt balances/history must be removed before player row');
assert.ok(block.indexOf('throw Object.assign')<block.indexOf("DELETE FROM players WHERE name=?"),'failed extra-attempt cleanup must abort before player deletion');
assert.ok(block.indexOf("DELETE FROM players WHERE name=?")>block.indexOf("DELETE FROM activity_records WHERE player_name=?"),'dependent records should be removed before player row');
console.log('student delete canonical data cleanup contract self-test passed');
