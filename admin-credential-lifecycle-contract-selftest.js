const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
for(const token of [
  "if(getSetting('admin_hash')&&getSetting('admin_salt'))return",
  "process.env.STUDYVILLAGE_ADMIN_PASSWORD||'teacher1234'",
  "crypto.randomBytes(16).toString('hex')",
  "setSetting('admin_salt',salt)",
  "setSetting('admin_hash',hashPassword(initial,salt))",
  "app.post('/api/admin/password',requireAdmin",
  'p.length<6||p.length>72',
  "setSetting('admin_hash',hashPassword(p,salt))",
  'adminSessions.clear()'
])assert.ok(src.includes(token),`admin credential lifecycle guard missing: ${token}`);
const init=src.indexOf('function ensureAdminPassword()');
const install=src.indexOf('installActivityStateRoutes');
assert.ok(init>=0&&install>init,'admin credential initialization must happen before protected route installation');
console.log('admin credential lifecycle contract self-test passed');
