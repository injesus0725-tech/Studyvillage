const fs=require('fs');
const assert=require('assert');
const client=fs.readFileSync('admin-restore-preflight.js','utf8');
const server=fs.readFileSync('server/restore-preflight.js','utf8');
assert.ok(client.includes("originalFetch('/api/admin/restore/preflight'"),'admin preflight guard must call the server restore preflight route');
assert.ok(server.includes("app.post('/api/admin/restore/preflight'"),'server must expose the restore preflight route expected by the admin guard');
console.log('admin restore preflight endpoint contract self-test passed');
