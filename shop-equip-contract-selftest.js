/* v1.9 source-contract smoke test for shop purchase -> immediate equip integration and bounded requests. No DB or browser execution. */
import assert from 'node:assert/strict';
import fs from 'node:fs';

const shop=fs.readFileSync(new URL('./student-shop.js',import.meta.url),'utf8');
const customize=fs.readFileSync(new URL('./customize.js',import.meta.url),'utf8');
const eventName='studyvillage:equip-purchased-item';

assert.ok(shop.includes(`CustomEvent('${eventName}'`),'student shop must emit immediate-equip event');
assert.ok(shop.includes('itemId:d.itemId,itemName:found.name'),'shop immediate-equip event must carry purchased item identity');
assert.ok(customize.includes(`addEventListener('${eventName}'`),'customize must listen for immediate-equip event');
assert.ok(customize.includes('equipPurchasedNow(e.detail?.itemId,e.detail?.itemName)'),'customize listener must forward purchase identity');
assert.ok(customize.includes("fetch('/api/shop/equipment'"),'purchased equipment must persist through shop equipment API');
assert.ok(customize.includes('ownedSet().has(itemId)'),'immediate equip must verify permanent ownership before saving');
assert.ok(shop.includes('REQUEST_TIMEOUT_MS=5000'),'student shop requests must not wait forever');
assert.ok(shop.includes('async function timedFetch'),'student shop must use a shared bounded request helper');
assert.ok((shop.match(/timedFetch\(/g)||[]).length>=3,'shop load and purchase requests must use bounded fetches');
assert.ok(shop.includes('if(loading)return null;loading=true'),'student shop refresh requests must not overlap');
assert.ok(shop.includes("err?.name==='AbortError'?'구매 요청 시간이 초과됐어요. 잠시 후 별 장부를 확인해 주세요.'"),'purchase timeout must tell students to verify the ledger before retrying');
assert.ok(shop.includes('if(!refreshed)await load()'),'purchase flow must avoid redundant successful refreshes while still recovering after failure');

console.log('[Studyvillage] shop immediate-equip contract selftest passed');
