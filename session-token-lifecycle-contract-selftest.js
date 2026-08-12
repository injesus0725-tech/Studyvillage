const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
for(const token of [
  'STUDENT_SESSION_TTL_MS=12*60*60*1000',
  'ADMIN_SESSION_TTL_MS=12*60*60*1000',
  "crypto.randomBytes(32).toString('hex')",
  'pruneSessions(sessions,STUDENT_SESSION_TTL_MS,now)',
  'pruneSessions(adminSessions,ADMIN_SESSION_TTL_MS,now)',
  'if(Date.now()-s.lastSeenAt>ttl){map.delete(token);return null}',
  's.lastSeenAt=Date.now()',
  "a.startsWith('Bearer ')?a.slice(7):''"
])assert.ok(src.includes(token),`session lifecycle guard missing: ${token}`);
assert.ok(src.includes("code:'not-authenticated'"),'expired/invalid student session must fail closed');
assert.ok(src.includes("code:'admin-not-authenticated'"),'expired/invalid admin session must fail closed');
console.log('session token lifecycle contract self-test passed');
