const assert=require('assert');
const fs=require('fs');
const server=fs.readFileSync('server/star-ledger.js','utf8'),client=fs.readFileSync('exploration-collection.js','utf8');

for(const id of ['npc-three','event-all','collection-complete'])assert(server.includes(`'${id}'`),`missing collection milestone ${id}`);
assert.match(server,/complete:collection=>collection\.npcs\.length>=3/,'NPC milestone must be verified from stored collection data');
assert.match(server,/complete:collection=>collection\.events\.length>=3/,'event milestone must require all discoveries');
assert.match(server,/collection\.npcs\.length>=6&&collection\.events\.length>=3/,'completion reward must require all nine entries');
assert.match(server,/kind='collection-milestone' AND reference_id=\?/,'milestone rewards must be idempotent');
assert.match(server,/claimCollectionMilestone\(req\.session\.name,req\.body\?\.milestoneId\)/,'milestone claims must use the authenticated student');
assert.match(server,/'collection-milestone',id,`탐험 도감 · \$\{milestone\.title\}`/,'milestone rewards must be written to the star ledger');
assert(!client.match(/body:JSON\.stringify\(\{milestoneId,stars/),'the client must never choose milestone star amounts');
assert.match(client,/controller\.abort\(\),5000/,'milestone reward requests must time out safely');
assert.match(client,/item\.complete&&!item\.claimed/,'only completed unclaimed milestones may show a claim button');
console.log('student collection milestone contract selftest passed');
