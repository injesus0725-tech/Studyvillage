const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),index=fs.readFileSync('index.html','utf8'),ranking=fs.readFileSync('assets/student-stability-fixes.js','utf8');
const slots=['hair','hat','glasses','outfit','bottom','shoes','bag','hand','pet'];
assert.match(server,/function parseEquipment\(r\)\{const out=\{hair:null,hat:null,glasses:null,outfit:null,bottom:null,shoes:null,bag:null,hand:null,pet:null\}/,'student reload must restore all nine wardrobe slots');
assert.ok(server.includes('RANKING_ITEM_SLOTS[id]===slot'),'student reload must validate purchased and unlocked items against the complete item registry');
for(const slot of slots){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`village and preview must expose ${slot} layers`);
  assert.ok(ranking.includes(`sv-rank-${slot}`),`ranking must render ${slot}`);
}
assert.ok(customize.includes('for(const slot of slots)')&&customize.includes('`#player-${slot}`')&&customize.includes('`#preview-${slot}`'),'customizer must render every canonical slot through one shared loop');
console.log('student full wardrobe reload contract self-test passed');
