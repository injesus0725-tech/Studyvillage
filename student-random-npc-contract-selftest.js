const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('random-npcs.js','utf8');
const html=fs.readFileSync('index.html','utf8');

for(const id of ['wizard','ghost','dragon','fox','robot','owl'])assert(src.includes(`id:'${id}'`),`missing NPC ${id}`);
assert.match(src,/shuffle\(roster\)\.slice\(0,3\)/,'each visit must choose three random NPCs');
assert.match(src,/shuffle\(spots\)\.slice\(0,3\)/,'NPC positions must vary');
assert.match(src,/Math\.floor\(Math\.random\(\)\*npc\.lines\.length\)/,'opening dialogue must randomize its first line');
assert.match(src,/event\?\.stopImmediatePropagation\(\)/,'NPC interaction must not also trigger a building or old NPC');
assert.match(src,/typeof event\.key==='string'/,'keyless smart-device events must be guarded');
assert.match(src,/window\.dispatchEvent\(new Event\('blur'\)\)/,'opening dialogue must clear held movement');
assert.match(src,/event\.key==='Escape'/,'back/escape must close dialogue inside the game');
assert(html.indexOf('random-npcs.js')>html.indexOf('world-camera.js'),'NPCs need the expanded map first');
assert(html.indexOf('random-npcs.js')<html.indexOf('building-interiors.js'),'NPC capture must be registered before building capture');
console.log('student random NPC contract selftest passed');
