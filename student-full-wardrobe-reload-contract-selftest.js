const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),shop=fs.readFileSync('server/item-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),index=fs.readFileSync('index.html','utf8'),ranking=fs.readFileSync('assets/student-stability-fixes.js','utf8');
const activeSlots=['outfit','effect','pet'];
const retiredUiSlots=['hair','face','expression','hat','glasses','bottom','shoes','bag','hand'];

assert.match(server,/function parseEquipment\(r\)\{const out=\{face:'face-round',expression:'expression-smile',hair:null,hat:null,glasses:null,outfit:null,bottom:null,shoes:null,bag:null,hand:null,pet:null\}/,'student reload must continue parsing legacy saved equipment safely');
assert.ok(customize.includes("const slots=['outfit','effect','pet']"),'customizer must expose only the three wearable production slots beside the separately selected base character');
assert.ok(customize.includes("slotNames={outfit:'한벌 의상',effect:'효과',pet:'펫'}"),'wardrobe labels must match the production architecture');
assert.ok(customize.includes("let playerData=null")&&customize.includes("draftBase='student-boy'"),'base character selection must remain separate from wearable equipment');
assert.ok(customize.includes('for(const c of playerData?.baseCharacters||[])'),'wardrobe must list only server-approved base characters');
assert.ok(customize.includes("draftBase=(next.baseCharacters||[]).some(c=>c.id===next.baseCharacter)?next.baseCharacter:'student-boy'"),'reload must restore a validated base-character selection');
assert.ok(customize.includes("if(info.slot==='character')")&&customize.includes('draftBase=itemId'),'a newly purchased base character must enter the immediate equip path');
assert.ok(server.includes('RANKING_ITEM_SLOTS[id]===slot'),'student reload must validate purchased and unlocked wearable items against the complete item registry');

for(const slot of activeSlots){assert.ok(customize.includes(`'${slot}'`),`customizer must support production ${slot} slot`)}
for(const slot of retiredUiSlots){assert.ok(!customize.includes(`slotNames={${slot}:`)&&!customize.includes(`data-shop-slot="${slot}"`),`retired ${slot} must not be reintroduced as a production wardrobe category`)}
assert.ok(customize.includes('renderer?.paintItem(document.querySelector(\'#player-hair\'),null)')&&customize.includes('renderer?.paintItem(document.querySelector(\'#preview-hair\'),null)'),'legacy hair DOM layers must be explicitly cleared so stale hair cannot cover the selected base character');
assert.ok(customize.includes('for(const slot of slots)')&&customize.includes('`#player-${slot}`')&&customize.includes('`#preview-${slot}`'),'customizer must render the production wearable slots through one shared loop');
const inventoryStart=customize.indexOf('function renderInventory()'),inventoryEnd=customize.indexOf('async function fetchPlayer',inventoryStart),inventory=customize.slice(inventoryStart,inventoryEnd);
assert.ok(inventoryStart>=0&&inventoryEnd>inventoryStart,'wardrobe inventory renderer must exist');
assert.ok(inventory.includes('for(const slot of slots)'),'wardrobe list must expose every production wearable slot');
assert.ok(!customize.includes("const slots=['hair'")&&!customize.includes("const slots=['face'")&&!customize.includes("const slots=['hat'"),'retired face, expression, hair, hat, and glasses slots must stay out of the wardrobe slot list');
assert.ok(customize.includes('draft=normalizeEquipment({...next.equipment,...shop.equipment})'),'reload must merge player and shop wearable equipment with purchased equipment precedence');
assert.ok(customize.includes("window.addEventListener('studyvillage:equip-purchased-item'"),'a newly purchased item must enter the immediate equip path');

// Legacy fields are still sent as null through the canonical player save so old data is removed safely,
// while selected purchased production wearables are restored by the sparse shop equipment update.
for(const token of ['hair:null','face:null','expression:null','hat:null','glasses:null','bottom:null','shoes:null','bag:null','hand:null'])assert.ok(customize.includes(token),`save must clear stale legacy field ${token}`);
assert.ok(shop.includes('if(!(slot in equipment))continue'),'shop equipment API must remain recognized as a partial updater');
assert.ok(customize.includes('purchased={}')&&customize.includes('purchased[slot]=id'),'client save must build a sparse restore map for selected purchased items');
assert.ok(customize.includes("timedFetch('/api/shop/equipment'"),'wardrobe saves with purchased wearables must persist the shop equipment layer');
assert.ok(customize.includes('if(Object.keys(purchased).length)'),'shop restore should be skipped when no purchased wearable is selected');
assert.ok(!customize.includes('purchased=Object.fromEntries(slots.map(slot=>[slot,null]))'),'blanket null shop writes must not erase valid purchased slots');

const persistStart=customize.indexOf('async function persistEquipment'),persistEnd=customize.indexOf('async function saveEquipment',persistStart),persist=customize.slice(persistStart,persistEnd);
assert.ok(persistStart>=0&&persistEnd>persistStart,'shared wardrobe persistence helper must exist');
assert.ok(persist.includes('for(let attempt=0;attempt<2;attempt++)'),'wardrobe save must retry the complete persistence path at most once');
assert.ok(persist.includes("'/api/player/me/equipment'")&&persist.includes("'/api/shop/equipment'"),'persistence helper must contain both base-character/player and purchased-wearable persistence layers');
assert.ok(customize.includes('await persistEquipment(legacy,purchased)'),'normal and immediate-purchase equip saves must share the hardened persistence path');
assert.ok(index.includes('avatar-production-contract-v2.css'),'production face/pet rendering contract must load in the student runtime');
assert.ok(!index.includes('assets/avatar-rpg-unification.js'),'legacy separate face/expression overlay runtime must stay disabled');
assert.ok(ranking.includes('sv-rank-outfit')&&ranking.includes('sv-rank-pet'),'ranking must retain production outfit and pet rendering support');
console.log('student base-character wardrobe reload contract self-test passed');
