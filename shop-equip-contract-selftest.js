/* v1.9 source-contract smoke test for shop purchase -> immediate equip integration. No DB or browser execution. */
import assert from 'node:assert/strict';
import fs from 'node:fs';

const shop=fs.readFileSync(new URL('./student-shop.js',import.meta.url),'utf8');
const customize=fs.readFileSync(new URL('./customize.js',import.meta.url),'utf8');
const eventName='studyvillage:equip-purchased-item';

assert.ok(shop.includes(`CustomEvent('${eventName}'`),'student shop must emit immediate-equip event');
assert.ok(shop.includes('itemId,itemName:item.name'),'shop event must carry itemId and itemName');
assert.ok(customize.includes(`addEventListener('${eventName}'`),'customize must listen for immediate-equip event');
assert.ok(customize.includes('equipPurchasedNow(e.detail?.itemId,e.detail?.itemName)'),'customize listener must forward purchase identity');
assert.ok(customize.includes("fetch('/api/shop/equipment'"),'purchased equipment must persist through shop equipment API');
assert.ok(customize.includes('ownedSet().has(itemId)'),'immediate equip must verify permanent ownership before saving');

console.log('[Studyvillage] shop immediate-equip contract selftest passed');
