const assert=require('assert');
const fs=require('fs');
const server=fs.readFileSync('server/star-ledger.js','utf8'),client=fs.readFileSync('exploration-collection.js','utf8');

for(const id of ['npc-three','event-all','collection-complete'])assert.ok(!server.includes(`'${id}'`),`retired collection milestone must stay removed: ${id}`);
assert.ok(!server.includes('COLLECTION_MILESTONES'),'collection milestone reward catalog must stay retired');
assert.ok(!server.includes('claimCollectionMilestone'),'collection milestone reward mutation must stay retired');
assert.ok(!server.includes("kind='collection-milestone'"),'new collection milestone ledger awards must stay retired');
assert.ok(!client.includes('milestoneId'),'collection guide must not submit milestone claims');
assert.ok(!client.includes('claim button'),'collection guide must not restore reward claim controls');
assert.ok(client.includes('실루엣'),'undiscovered entries must remain silhouette-based');
assert.ok(client.includes('발견 기록'),'collection guide must remain discovery/progress focused');
assert.match(client,/controller\.abort\(\),5000/,'collection loading must time out safely');
console.log('retired collection milestone + discovery guide contract selftest passed');
