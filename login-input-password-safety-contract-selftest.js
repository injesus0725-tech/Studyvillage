const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const star=fs.readFileSync('server/star-ledger.js','utf8');
const start=src.indexOf("app.post('/api/login'");
const end=src.indexOf("app.get('/api/player/me'",start);
assert.ok(start>=0&&end>start,'student login route must exist');
const block=src.slice(start,end);
for(const token of [
  'password.length<4||password.length>72',
  "crypto.randomBytes(16).toString('hex')",
  "crypto.timingSafeEqual(a,c)",
  "code:'wrong-password'",
  'token:createSession(name)'
])assert.ok(block.includes(token),`login safety guard missing: ${token}`);
assert.ok(block.indexOf("code:'wrong-password'")<block.indexOf('token:createSession(name)'),'wrong password must fail before session creation');
const guardStart=star.indexOf("app.post('/api/login',(req,res,next)=>{");
const guardEnd=star.indexOf("app.get('/api/player/me/stars'",guardStart);
assert.ok(guardStart>=0&&guardEnd>guardStart,'canonical pre-login name guard must exist before the main login route');
const guard=star.slice(guardStart,guardEnd);
assert.ok(guard.includes("String(req.body?.name??'').trim().replace(/\\s+/g,' ')"),'pre-login guard must use the same whitespace normalization as login');
assert.ok(guard.includes("if(name.length>12)return res.status(400).json({ok:false,code:'invalid-input'})"),'overlong normalized student names must be rejected before the main login handler');
assert.ok(guard.indexOf('name.length>12')<guard.indexOf('next();'),'overlong names must fail before control reaches the main login handler');
const mainTruncates=block.includes('.slice(0,12)');
const mainRejects=block.includes('name.length>12');
assert.ok(mainRejects||(!mainRejects&&mainTruncates&&guard.includes('name.length>12')),'student names must be rejected before any possible truncation');
console.log('login input/password and canonical student-name safety contract self-test passed');
