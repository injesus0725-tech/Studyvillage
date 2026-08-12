const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const start=src.indexOf("app.post('/api/admin/login'");
const end=src.indexOf("app.post('/api/admin/password'",start);
assert.ok(start>=0&&end>start,'admin login route must exist');
const block=src.slice(start,end);
for(const token of [
  "getSetting('admin_salt')",
  "getSetting('admin_hash')",
  "Buffer.from(expected,'hex')",
  "Buffer.from(hashPassword(p,salt),'hex')",
  'a.length===c.length&&crypto.timingSafeEqual(a,c)',
  'token:createAdminSession()'
])assert.ok(block.includes(token),`admin login safety guard missing: ${token}`);
assert.ok(block.indexOf('timingSafeEqual')<block.indexOf('token:createAdminSession()'),'admin session must only be created after password verification');
console.log('admin login password safety contract self-test passed');
