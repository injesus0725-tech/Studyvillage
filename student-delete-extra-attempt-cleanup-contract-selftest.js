const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8');
const star=fs.readFileSync('server/star-ledger.js','utf8');
for(const token of [
  "import { removeExtraAttemptStudentData } from './activity-attempt-exceptions.js'",
  'const deleteStudentData=db.transaction(name=>{',
  'removeExtraAttemptStudentData({getSetting,setSetting,deleteSetting:key=>db.prepare(\'DELETE FROM settings WHERE key=?\').run(key),listSettingKeys:prefix=>db.prepare(\'SELECT key FROM settings WHERE key LIKE ?\').all(`${prefix}%`).map(row=>row.key)},name)',
  "throw Object.assign(new Error(cleanup.code),{cleanupCode:cleanup.code})",
  "DELETE FROM activity_records WHERE player_name=?",
  "DELETE FROM activity_log WHERE player_name=?",
  "DELETE FROM error_reports WHERE player_name=?",
  "DELETE FROM players WHERE name=?",
  "if(!name||name.length>12)return res.status(400).json({ok:false,code:'invalid-student'})",
  "if(reason)return res.status(409).json({ok:false,code:'extra-attempt-cleanup-failed',reason})",
  'clearStudentSessions(name)'
])assert.ok(server.includes(token),`atomic student deletion cleanup guard missing: ${token}`);
const txStart=server.indexOf('const deleteStudentData=db.transaction(name=>{'),txEnd=server.indexOf("app.delete('/api/admin/player/:name'",txStart),tx=server.slice(txStart,txEnd);
assert.ok(tx.indexOf('removeExtraAttemptStudentData(')<tx.indexOf("DELETE FROM players WHERE name=?"),'extra-attempt cleanup must happen inside the same transaction before deleting the player');
assert.ok(tx.indexOf('throw Object.assign')<tx.indexOf("DELETE FROM players WHERE name=?"),'cleanup failure must abort the entire student deletion transaction');
assert.ok(!star.includes("app.delete('/api/admin/player/:name'"),'star ledger must not install a separate student-delete cleanup middleware');
assert.ok(!star.includes('cleanupExtraAttemptsBeforeStudentDelete')&&!star.includes('cleanupExtraAttemptsAfterStudentDelete'),'no split pre/post deletion cleanup path may remain');
console.log('student delete fully atomic extra-attempt cleanup contract self-test passed');
