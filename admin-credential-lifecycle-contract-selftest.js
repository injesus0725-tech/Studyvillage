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
const initDefinition=src.indexOf('function ensureAdminPassword()');
const initCall=src.indexOf('ensureAdminPassword();',initDefinition);
const installCall=src.indexOf('installActivityStateRoutes(app,{',initCall);
assert.ok(initDefinition>=0&&initCall>initDefinition,'admin credential initializer must be defined and invoked');
assert.ok(installCall>initCall,'admin credential initialization must happen before protected route installation');
assert.ok(src.indexOf('installQuestionReviewRoutes(app,{',initCall)>initCall,'question review protected routes must install after admin credential initialization');
assert.ok(src.indexOf('installStarLedgerRoutes(app,{',initCall)>initCall,'star ledger protected routes must install after admin credential initialization');
console.log('admin credential lifecycle contract self-test passed');
