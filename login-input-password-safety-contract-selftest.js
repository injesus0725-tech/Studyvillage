const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const start=src.indexOf("app.post('/api/login'");
const end=src.indexOf("app.get('/api/player/me'",start);
assert.ok(start>=0&&end>start,'student login route must exist');
const block=src.slice(start,end);
for(const token of [
  ".trim().replace(/\\s+/g,' ').slice(0,12)",
  'password.length<4||password.length>72',
  "crypto.randomBytes(16).toString('hex')",
  "crypto.timingSafeEqual(a,c)",
  "code:'wrong-password'",
  'token:createSession(name)'
])assert.ok(block.includes(token),`login safety guard missing: ${token}`);
assert.ok(block.indexOf("code:'wrong-password'")<block.indexOf('token:createSession(name)'),'wrong password must fail before session creation');
console.log('login input/password safety contract self-test passed');
