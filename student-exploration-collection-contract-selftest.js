const assert=require('assert');
const fs=require('fs');
const server=fs.readFileSync('server/star-ledger.js','utf8'),client=fs.readFileSync('exploration-collection.js','utf8'),npcs=fs.readFileSync('random-npcs.js','utf8'),deleteFlow=fs.readFileSync('server/server.js','utf8'),html=fs.readFileSync('index.html','utf8');

for(const id of ['wizard','ghost','dragon','fox','robot','owl'])assert(server.includes(`'${id}'`),`server collection missing NPC ${id}`);
for(const id of ['chest','tree','flower'])assert(client.includes(`['${id}'`),`client collection missing event ${id}`);
assert.match(server,/exploration-collection:\$\{encodeURIComponent\(clean\(name,12\)\)\}/,'collection must use the canonical student identity');
assert.match(server,/new Set\(\(Array\.isArray\(value\.npcs\)/,'stored NPC ids must be deduplicated and validated');
assert.match(server,/addCollection\(db,name,'event',type\)/,'a successful map discovery must enter the collection atomically');
assert.match(npcs,/kind:'npc',id:npc\.id/,'meeting an NPC must record that exact whitelisted NPC');
assert.match(npcs,/controller\.abort\(\),5000/,'NPC collection saving must not hang movement');
assert.match(client,/className=`sv-collection-item\$\{unlocked\?'':' locked'\}`/,'unseen collection entries must render locked');
assert.match(client,/도감 \$\{foundNpcs\.size\+foundEvents\.size\} \/ \$\{npcs\.length\+events\.length\}개 등록/,'collection progress must be visible');
assert(deleteFlow.includes('exploration-collection:${encodeURIComponent(name)}'),'deleting a student must delete their collection');
assert(html.includes('<script src="exploration-collection.js"></script>'),'collection UI must load');
console.log('student exploration collection contract selftest passed');
