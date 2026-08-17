const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/item-shop.js','utf8');

for(const token of [
  'const tx=db.transaction(()=>{',
  "UPDATE players SET stars=?,owned_items_json=?,updated_at=? WHERE name=? AND stars=?",
  "if(changed.changes!==1)return{ok:false,code:'balance-changed'}",
  "INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at)",
  'writeStarMirror(db,name)',
  "if(owned.includes(id))return{ok:false,code:'already-owned'}",
  "if(!owned.has(id))return{ok:false,code:'item-not-owned',itemId:id}",
  "if(ITEM_SLOTS[id]!==slot)return{ok:false,code:'invalid-slot',slot}",
  'validateOwnedItemsStrict',
  "code:'corrupt-owned-items'",
  'validateEquipment',
  "code:'corrupt-equipment'",
  'validStarBalance',
  "code:'corrupt-star-balance'",
  "if(state.ok===false)return res.status(409).json(state)"
])assert.ok(src.includes(token),`shop consistency guard missing: ${token}`);

const stateStart=src.indexOf('export function playerShopState');
const purchaseStart=src.indexOf('export function purchaseItem');
const equipStart=src.indexOf('export function saveOwnedEquipment');
assert.ok(stateStart>=0&&purchaseStart>stateStart&&equipStart>purchaseStart,'shop state/purchase/equipment functions must exist');
const state=src.slice(stateStart,src.indexOf('export function configureShop',stateStart));
assert.ok(state.includes('if(!validStarBalance(player.stars))'), 'shop read must strictly validate star balance');
assert.ok(state.includes('validateOwnedItemsStrict(player.owned_items_json)'), 'shop read must strictly validate wardrobe state');
assert.ok(state.includes('validateEquipment(player.equipment_json)'), 'shop read must strictly validate equipment state');
assert.ok(state.includes("return{ok:false,code:'corrupt-star-balance'}"), 'shop read must surface corrupt star balance');
assert.ok(state.includes("return{ok:false,code:'corrupt-owned-items'}"), 'shop read must surface corrupt wardrobe state');
assert.ok(state.includes("return{ok:false,code:'corrupt-equipment'}"), 'shop read must surface corrupt equipment state');
const purchase=src.slice(purchaseStart,equipStart);
const digitalUpdate=purchase.indexOf('UPDATE players SET stars=?,owned_items_json=?');
const digitalKind=purchase.indexOf("'item-purchase'");
const digitalLedger=digitalKind<0?-1:purchase.lastIndexOf('INSERT INTO star_ledger',digitalKind);
const mirror=purchase.indexOf('writeStarMirror(db,name)',Math.max(digitalKind,0));
assert.ok(digitalUpdate>=0&&digitalKind>=0&&digitalLedger>=0,'digital purchase transaction must update ownership and write an item-purchase ledger entry');
assert.ok(purchase.indexOf('if(!validStarBalance(player.stars))')<digitalUpdate,'purchase must validate existing star balance before writing');
assert.ok(purchase.indexOf('validateOwnedItemsStrict(player.owned_items_json)')<digitalUpdate,'purchase must validate existing wardrobe state before writing');
assert.ok(digitalUpdate<digitalLedger&&digitalLedger<digitalKind,'digital ownership and star balance must update before its ledger entry inside the transaction');
assert.ok(mirror>digitalKind,'star mirror must be written after the digital purchase ledger entry');
const equipment=src.slice(equipStart,src.indexOf('export function installItemShopRoutes',equipStart));
assert.ok(equipment.indexOf('validateOwnedItemsStrict(player.owned_items_json)')<equipment.indexOf('UPDATE players SET equipment_json=?'),'equipment save must validate wardrobe state before writing');
assert.ok(equipment.indexOf('validateEquipment(player.equipment_json)')<equipment.indexOf('UPDATE players SET equipment_json=?'),'equipment save must validate existing equipment state before writing');

console.log('shop star equipment consistency contract self-test passed');
