const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('random-npcs.js','utf8');
const html=fs.readFileSync('index.html','utf8');

for(const id of ['wizard','ghost','dragon','fox','robot','owl'])assert(src.includes(`id:'${id}'`),`missing NPC ${id}`);
assert.match(src,/shuffle\(roster\.filter\(npc=>level>=npc\.requiredLevel\)\)\.slice\(0,3\)/,'each visit must choose three random NPCs from the earned level pool');
assert.match(src,/shuffle\(spots\)\.slice\(0,selected\.length\)/,'NPC positions must vary');
for(const [id,level] of [['ghost',1],['fox',1],['robot',1],['wizard',10],['dragon',20],['owl',30]])assert.ok(src.includes(`id:'${id}',requiredLevel:${level}`),`${id} must unlock at Lv.${level}`);
assert.ok(src.includes("new MutationObserver(spawn).observe(levelLabel"),'NPC candidates must refresh when the verified profile level changes');
assert.match(src,/Math\.floor\(Math\.random\(\)\*npc\.lines\.length\)/,'opening dialogue must randomize its first line');
assert.match(src,/event\?\.stopImmediatePropagation\(\)/,'NPC interaction must not also trigger a building or old NPC');
assert.match(src,/typeof event\.key==='string'/,'keyless smart-device events must be guarded');
assert.match(src,/window\.dispatchEvent\(new Event\('blur'\)\)/,'opening dialogue must clear held movement');
assert.match(src,/event\.key==='Escape'/,'back/escape must close dialogue inside the game');
assert(html.indexOf('random-npcs.js')>html.indexOf('world-camera.js'),'NPCs need the expanded map first');
assert(html.indexOf('random-npcs.js')<html.indexOf('building-interiors.js'),'NPC capture must be registered before building capture');
console.log('student random NPC contract selftest passed');
