const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8');
const star=fs.readFileSync('server/star-ledger.js','utf8');
const start=server.indexOf('const deleteStudentData=db.transaction(name=>{');
const end=server.indexOf("app.delete('/api/admin/player/:name'",start);
assert.ok(start>=0&&end>start,'unified student delete transaction must exist');
const block=server.slice(start,end);
for(const token of [
  'removeExtraAttemptStudentData({getSetting,setSetting',
  "deleteSetting:key=>db.prepare('DELETE FROM settings WHERE key=?').run(key)",
  "listSettingKeys:prefix=>db.prepare('SELECT key FROM settings WHERE key LIKE ?').all(`${prefix}%`).map(row=>row.key)",
  "throw Object.assign(new Error(cleanup.code),{cleanupCode:cleanup.code})",
  "db.prepare('DELETE FROM activity_records WHERE player_name=?').run(name)",
  "db.prepare('DELETE FROM activity_log WHERE player_name=?').run(name)",
  "db.prepare('DELETE FROM error_reports WHERE player_name=?').run(name)",
  "db.prepare('DELETE FROM players WHERE name=?').run(name)"
])assert.ok(block.includes(token),`unified atomic student deletion guard missing: ${token}`);
assert.ok(block.indexOf('removeExtraAttemptStudentData(')<block.indexOf("DELETE FROM players WHERE name=?"),'extra-attempt cleanup must run before player deletion in the same transaction');
assert.ok(block.indexOf('throw Object.assign')<block.indexOf("DELETE FROM players WHERE name=?"),'cleanup failure must abort before any player deletion can commit');
assert.ok(!star.includes('cleanupExtraAttemptsBeforeStudentDelete')&&!star.includes('cleanupExtraAttemptsAfterStudentDelete'),'split delete cleanup middleware must stay removed');
assert.ok(!star.includes("app.delete('/api/admin/player/:name'"),'star ledger must not register a second student delete route');
console.log('student delete unified atomic cleanup contract self-test passed');
