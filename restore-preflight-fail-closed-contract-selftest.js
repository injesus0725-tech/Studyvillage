const fs=require('fs');
const assert=require('assert');
const client=fs.readFileSync('admin-restore-preflight.js','utf8');
const server=fs.readFileSync('server/restore-preflight.js','utf8');
for(const token of [
  "const REQUEST_TIMEOUT_MS=5000",
  "const controller=new AbortController()",
  "signal:controller.signal",
  "if(!preflight.ok||!result?.ok)",
  "status:400",
  "status:503",
  "restore-preflight-timeout",
  "restore-preflight-unavailable"
])assert.ok(client.includes(token),`restore client fail-closed guard missing: ${token}`);
assert.ok(server.includes("app.post('/api/admin/restore/preflight',requireAdmin"),'preflight must require admin authentication');
assert.ok(server.includes('prepareStudyvillageRestore(req.body)'),'preflight must validate the exact candidate backup');
assert.ok(server.includes("code:'restore-preflight-failed'"),'preflight exceptions must fail closed');
console.log('restore preflight fail closed contract self-test passed');
