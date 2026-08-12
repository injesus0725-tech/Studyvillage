const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const marker="app.post('/api/admin/restore'";
const start=src.indexOf(marker);
assert.ok(start>=0,'restore route must exist');
const tail=src.slice(start);
for(const token of [
  'adminSessions.clear()',
  'sessions.clear()',
  'presence.clear()',
  'liveEvents.length=0',
  'liveEventSeq=0'
])assert.ok(tail.includes(token),`restore runtime reset missing: ${token}`);
assert.ok(tail.indexOf('restore();')<tail.indexOf('sessions.clear()'),'runtime state must reset only after DB restore succeeds');
assert.ok(tail.indexOf('restore();')<tail.indexOf('liveEvents.length=0'),'stale live events must clear only after DB restore succeeds');
console.log('restore runtime state reset contract self-test passed');
