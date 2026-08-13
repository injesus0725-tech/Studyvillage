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
  'const cleanup=db.transaction(()=>{',
  'removeExtraAttemptStudentData({getSetting,setSetting,deleteSetting,listSettingKeys},name)',
  "throw Object.assign(new Error(result.code),{cleanupCode:result.code})",
  'cleanup();',
  "if(reason)return res.status(409).json({ok:false,code:'extra-attempt-cleanup-failed',reason})",
  "app.delete('/api/admin/player/:name',requireAdmin,cleanupExtraAttemptsBeforeStudentDelete)"
])assert.ok(star.includes(token),`pre-delete extra-attempt cleanup wiring missing: ${token}`);
const middlewareRoute=star.indexOf("app.delete('/api/admin/player/:name',requireAdmin,cleanupExtraAttemptsBeforeStudentDelete)");
assert.ok(middlewareRoute>=0&&middlewareRoute<star.indexOf('installItemShopRoutes'),'student delete cleanup middleware must be installed during normal server route setup');
assert.ok(server.includes("app.delete('/api/admin/player/:name',requireAdmin"),'final student delete route must still exist after cleanup middleware');
const cleanupStart=star.indexOf('function cleanupExtraAttemptsBeforeStudentDelete'),cleanupEnd=star.indexOf('\nexport function installStarLedgerRoutes',cleanupStart),cleanupBlock=star.slice(cleanupStart,cleanupEnd);
assert.ok(cleanupBlock.indexOf('const cleanup=db.transaction(()=>{')<cleanupBlock.indexOf('removeExtraAttemptStudentData('),'all extra-attempt pre-delete mutations must run inside a SQLite transaction');
assert.ok(cleanupBlock.indexOf('throw Object.assign')<cleanupBlock.indexOf('cleanup();'),'failed cleanup must throw inside the transaction so partial mutations roll back');
assert.ok(cleanupBlock.indexOf('cleanup();')<cleanupBlock.indexOf('return next();'),'final student deletion must run only after cleanup commits');
console.log('student delete atomic extra-attempt pre-delete cleanup contract self-test passed');
