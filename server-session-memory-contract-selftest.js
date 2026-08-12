const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
for(const token of [
  'STUDENT_SESSION_TTL_MS=12*60*60*1000',
  'ADMIN_SESSION_TTL_MS=12*60*60*1000',
  'PRESENCE_TTL_MS=5*60*1000',
  'function sessionFrom(map,token,ttl)',
  'map.delete(token)',
  'lastSeenAt:now',
  'function prunePresence(now=Date.now())',
  'presence.delete(name)',
  'prunePresence(now)'
])assert.ok(src.includes(token),`server runtime memory guard missing: ${token}`);

// Repeated logins must not become an unbounded-memory path. This contract intentionally
// fails until createSession/createAdminSession proactively prune expired entries.
assert.ok(src.includes('function pruneSessions(map,ttl,now=Date.now())'),'server must provide proactive expired-session pruning');
assert.ok(/createSession=name=>\{[^}]*pruneSessions\(sessions,STUDENT_SESSION_TTL_MS,now\)/s.test(src),'student login must prune expired student sessions before adding a token');
assert.ok(/createAdminSession=\(\)=>\{[^}]*pruneSessions\(adminSessions,ADMIN_SESSION_TTL_MS,now\)/s.test(src),'admin login must prune expired admin sessions before adding a token');
console.log('server session memory contract self-test passed');
