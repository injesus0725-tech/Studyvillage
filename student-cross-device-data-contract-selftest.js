const fs=require('fs');
const server=fs.readFileSync('server/server.js','utf8');
const auth=fs.readFileSync('auth.js','utf8');

const criticalPlayerFields=['totalScore','xp','level','title','badges','baseCharacter','inventory','equipment','activities'];
for(const field of criticalPlayerFields){
  if(!server.includes(`${field}:`))throw new Error(`server player payload missing cross-device field: ${field}`);
}
if(!server.includes("app.post('/api/login'"))throw new Error('server login route missing');
if(!server.includes('player:safePlayer(row)'))throw new Error('login must return server-backed player data');
if(!server.includes("app.get('/api/player/me'"))throw new Error('authenticated player reload route missing');
if(!server.includes('player:safePlayer(r)'))throw new Error('/api/player/me must return server-backed player data');
if(!auth.includes("timedFetch('/api/login'"))throw new Error('student login must use classroom server when available');
if(!auth.includes("timedFetch('/api/player/me'"))throw new Error('session restore must reload player data from classroom server');

console.log('student cross-device data contract self-test passed');
