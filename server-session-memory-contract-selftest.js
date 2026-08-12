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
console.log('server session memory contract self-test passed');
