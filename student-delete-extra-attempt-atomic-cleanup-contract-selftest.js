const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/star-ledger.js','utf8');
const start=src.indexOf('function cleanupExtraAttemptsBeforeStudentDelete');
const end=src.indexOf('\nexport function installStarLedgerRoutes',start);
assert.ok(start>=0&&end>start,'extra-attempt delete middleware must exist');
const block=src.slice(start,end);
for(const token of [
  "if(!name||name.length>12)return res.status(400).json({ok:false,code:'invalid-student'})",
  "const cleanup=db.transaction(()=>{",
  "removeExtraAttemptStudentData({getSetting,setSetting,deleteSetting,listSettingKeys},name)",
  "if(!result.ok)throw Object.assign(new Error(result.code),{cleanupCode:result.code})",
  "return res.status(409).json({ok:false,code:'extra-attempt-cleanup-failed',reason})"
])assert.ok(block.includes(token),`atomic student extra-attempt cleanup guard missing: ${token}`);
assert.ok(block.indexOf('const cleanup=db.transaction')<block.indexOf('cleanup();'),'cleanup must execute through the sqlite transaction wrapper');
assert.ok(src.includes("app.delete('/api/admin/player/:name',requireAdmin,cleanupExtraAttemptsBeforeStudentDelete)"),'cleanup middleware must be registered on the real student delete route');
console.log('student delete extra-attempt atomic cleanup contract self-test passed');
