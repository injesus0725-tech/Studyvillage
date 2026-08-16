const assert=require('assert');
const fs=require('fs');
const client=fs.readFileSync('random-exploration-events.js','utf8');
const server=fs.readFileSync('server/star-ledger.js','utf8');
const html=fs.readFileSync('index.html','utf8');

for(const type of ['chest','tree','flower'])assert(client.includes(`type:'${type}'`),`missing discovery ${type}`);
assert.match(client,/shuffle\(spots\)\.slice\(0,events\.length\)/,'discovery positions must vary per visit');
assert.match(client,/\/api\/player\/me\/exploration-event/,'discoveries must use the authenticated reward route');
assert.match(client,/eventType:active\.event\.type/,'the client may send only an event type, never a star amount');
assert.match(client,/controller\.abort\(\),5000/,'reward saving must have a timeout');
assert.match(server,/EXPLORATION_REWARDS=Object\.freeze\(\{chest:\{stars:3,detail:/,'the server must own fixed reward amounts');
assert.match(server,/timeZone:'Asia\/Seoul'/,'daily claims must use the classroom timezone');
assert.match(server,/kind='exploration-event' AND reference_id=\?/,'daily duplicate claims must be checked in the immutable ledger');
assert.match(server,/alreadyClaimed:true/,'duplicate claims must return a safe idempotent result');
assert.match(server,/claimExplorationReward\(req\.session\.name,req\.body\?\.eventType\)/,'students may claim only for their authenticated identity');
assert(html.indexOf('random-exploration-events.js')>html.indexOf('random-npcs.js'),'NPC interaction must have priority when encounters overlap');
assert(html.indexOf('random-exploration-events.js')<html.indexOf('building-interiors.js'),'discoveries must intercept before buildings only when actually nearby');
console.log('student random discovery contract selftest passed');
