const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/star-ledger.js','utf8');
const start=src.indexOf('function cleanupExtraAttemptsAfterStudentDelete');
const end=src.indexOf('\nexport function installStarLedgerRoutes',start);
assert.ok(start>=0&&end>start,'extra-attempt delete middleware must exist');
const block=src.slice(start,end);
for(const token of [
  "if(!name||name.length>12)return res.status(400).json({ok:false,code:'invalid-student'})",
  "if(!Array.isArray(parsed))return res.status(409).json({ok:false,code:'extra-attempt-cleanup-failed',reason:'corrupt-history'})",
  'const originalJson=res.json.bind(res);let cleanupDone=false',
  "res.statusCode>=200&&res.statusCode<300&&body?.ok===true",
  'const cleanup=cleanupDb.transaction(()=>{',
  "cleanupDb.prepare('DELETE FROM settings WHERE key LIKE ?').run(`${prefix}%`)",
  "run(EXTRA_ATTEMPT_HISTORY_KEY,filteredHistory)"
])assert.ok(block.includes(token),`post-success student extra-attempt cleanup guard missing: ${token}`);
assert.ok(block.indexOf('res.json=body=>')<block.indexOf('return next();'),'cleanup must be armed before the real delete route runs');
assert.ok(block.indexOf("body?.ok===true")<block.indexOf('const cleanup=cleanupDb.transaction'),'cleanup must only run after a successful downstream delete response');
assert.ok(src.includes("app.delete('/api/admin/player/:name',requireAdmin,cleanupExtraAttemptsAfterStudentDelete)"),'cleanup middleware must be registered on the real student delete route');
console.log('student delete extra-attempt post-success cleanup contract self-test passed');
