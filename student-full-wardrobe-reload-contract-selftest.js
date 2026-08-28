const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),index=fs.readFileSync('index.html','utf8'),ranking=fs.readFileSync('assets/student-stability-fixes.js','utf8');
const slots=['hair','hat','glasses','outfit','bottom','shoes','bag','hand','pet'];
assert.match(server,/function parseEquipment\(r\)\{const out=\{face:'face-round',expression:'expression-smile',hair:null,hat:null,glasses:null,outfit:null,bottom:null,shoes:null,bag:null,hand:null,pet:null\}/,'student reload must restore all wardrobe and face slots');
assert.ok(customize.includes("const slots=['face','expression','hair'")&&customize.includes('ensureFaceLayers()'),'customizer must expose independent face and expression layers');
assert.ok(server.includes('RANKING_ITEM_SLOTS[id]===slot'),'student reload must validate purchased and unlocked items against the complete item registry');
for(const slot of slots){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`village and preview must expose ${slot} layers`);
  assert.ok(ranking.includes(`sv-rank-${slot}`),`ranking must render ${slot}`);
}
assert.ok(customize.includes('for(const slot of slots)')&&customize.includes('`#player-${slot}`')&&customize.includes('`#preview-${slot}`'),'customizer must render every canonical slot through one shared loop');
const inventoryStart=customize.indexOf('function renderInventory()'),inventoryEnd=customize.indexOf('async function fetchPlayer',inventoryStart),inventory=customize.slice(inventoryStart,inventoryEnd);
assert.ok(inventoryStart>=0&&inventoryEnd>inventoryStart,'wardrobe inventory renderer must exist');
assert.ok(inventory.includes('for(const slot of slots)'),'wardrobe list must expose every purchasable modular slot, including face, expression, hair, hat, and glasses');
assert.ok(!inventory.includes("['outfit','bottom','shoes','bag','hand','pet']"),'wardrobe must not hide purchased head/face accessories behind a partial slot list');
console.log('student full wardrobe reload contract self-test passed');
