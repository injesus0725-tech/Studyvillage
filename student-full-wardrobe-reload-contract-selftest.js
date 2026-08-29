const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),shop=fs.readFileSync('server/item-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),index=fs.readFileSync('index.html','utf8'),ranking=fs.readFileSync('assets/student-stability-fixes.js','utf8');
const slots=['hair','outfit','bottom','shoes','bag','hand','pet'];
assert.match(server,/function parseEquipment\(r\)\{const out=\{face:'face-round',expression:'expression-smile',hair:null,hat:null,glasses:null,outfit:null,bottom:null,shoes:null,bag:null,hand:null,pet:null\}/,'student reload must restore all wardrobe and face slots');
assert.ok(customize.includes("const slots=['hair','outfit','bottom','shoes','bag','hand','pet']"),'customizer must expose only supported whole-character wardrobe layers');
assert.ok(server.includes('RANKING_ITEM_SLOTS[id]===slot'),'student reload must validate purchased and unlocked items against the complete item registry');
for(const slot of slots){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`village and preview must expose ${slot} layers`);
  assert.ok(ranking.includes(`sv-rank-${slot}`),`ranking must render ${slot}`);
}
assert.ok(customize.includes('for(const slot of slots)')&&customize.includes('`#player-${slot}`')&&customize.includes('`#preview-${slot}`'),'customizer must render every canonical slot through one shared loop');
const inventoryStart=customize.indexOf('function renderInventory()'),inventoryEnd=customize.indexOf('async function fetchPlayer',inventoryStart),inventory=customize.slice(inventoryStart,inventoryEnd);
assert.ok(inventoryStart>=0&&inventoryEnd>inventoryStart,'wardrobe inventory renderer must exist');
assert.ok(inventory.includes('for(const slot of slots)'),'wardrobe list must expose every supported modular slot');
assert.ok(!customize.includes("const slots=['face','expression'")&&!customize.includes("const slots=['hair','hat','glasses'"),'retired face, expression, hat, and glasses slots must stay out of the wardrobe');

// Reconnect must merge the persistent built-in/base equipment with purchased shop equipment,
// with the shop value taking precedence for slots currently occupied by a purchased item.
assert.ok(customize.includes('draft=normalizeEquipment({...next.equipment,...shop.equipment})'),'reload must merge player and shop equipment with purchased equipment precedence');
assert.ok(customize.includes("draftBase=(next.baseCharacters||[]).some(c=>c.id===next.baseCharacter)?next.baseCharacter:'student-boy'"),'reload must restore a validated whole-character selection');
assert.ok(customize.includes("window.addEventListener('studyvillage:equip-purchased-item'"),'a newly purchased item must enter the immediate equip path');

// The shop endpoint is intentionally a partial updater. Therefore every shop slot, including
// null values, must be sent on each save or the last unequipped purchased item can reappear later.
assert.ok(shop.includes('if(!(slot in equipment))continue'),'shop equipment API must remain recognized as a partial updater');
assert.ok(customize.includes('purchased=Object.fromEntries(slots.map(slot=>[slot,null]))'),'client save must explicitly represent unequipped purchased slots as null');
assert.ok(customize.includes("timedFetch('/api/shop/equipment'"),'every wardrobe save must persist the shop equipment layer');
assert.ok(!customize.includes('if(Object.keys(purchased).length)'),'empty purchased equipment must still be saved so unequip persists');

// The two persistence layers are idempotent. Retry the complete pair at most once so a transient
// failure between the player write and shop write does not strand a partially saved outfit.
const persistStart=customize.indexOf('async function persistEquipment'),persistEnd=customize.indexOf('async function saveEquipment',persistStart),persist=customize.slice(persistStart,persistEnd);
assert.ok(persistStart>=0&&persistEnd>persistStart,'shared wardrobe persistence helper must exist');
assert.ok(persist.includes('for(let attempt=0;attempt<2;attempt++)'),'wardrobe save must retry the complete two-write transaction at most once');
assert.ok(persist.includes("'/api/player/me/equipment'")&&persist.includes("'/api/shop/equipment'"),'each retry attempt must include both equipment persistence layers');
assert.ok(customize.includes('await persistEquipment(legacy,purchased)'),'normal and immediate-purchase equip saves must share the hardened persistence path');

console.log('student full wardrobe reload contract self-test passed');
