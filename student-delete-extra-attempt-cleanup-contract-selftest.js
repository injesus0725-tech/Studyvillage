const fs=require('fs');
const assert=require('assert');
const star=fs.readFileSync('server/star-ledger.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');
for(const token of [
  "import { removeExtraAttemptStudentData } from './activity-attempt-exceptions.js'",
  'function cleanupExtraAttemptsBeforeStudentDelete(req,res,next)',
  "if(!name||name.length>12)return res.status(400).json({ok:false,code:'invalid-student'})",
  "const deleteSetting=key=>db.prepare('DELETE FROM settings WHERE key=?').run(key)",
  "const listSettingKeys=prefix=>db.prepare('SELECT key FROM settings WHERE key LIKE ?').all(`${prefix}%`).map(row=>row.key)",
  'removeExtraAttemptStudentData({getSetting,setSetting,deleteSetting,listSettingKeys},name)',
  "app.delete('/api/admin/player/:name',requireAdmin,cleanupExtraAttemptsBeforeStudentDelete)"
])assert.ok(star.includes(token),`pre-delete extra-attempt cleanup wiring missing: ${token}`);
assert.ok(star.indexOf("app.delete('/api/admin/player/:name',requireAdmin,cleanupExtraAttemptsBeforeStudentDelete)")<star.indexOf('installItemShopRoutes'),'student delete cleanup middleware must be installed during normal server route setup');
assert.ok(server.includes("app.delete('/api/admin/player/:name',requireAdmin"),'final student delete route must still exist after cleanup middleware');
console.log('student delete extra-attempt pre-delete cleanup contract self-test passed');
