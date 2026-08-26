const assert=require('assert');
const fs=require('fs');
const shop=fs.readFileSync('server/item-shop.js','utf8');
const client=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const clientV3=fs.readFileSync('assets/avatar-basic-pack-v3.js','utf8');
const clientV5=fs.readFileSync('assets/avatar-basic-pack-v5.js','utf8');
const secondary=fs.readFileSync('assets/avatar-secondary-sync-v2.js','utf8');
const catalogV3=fs.readFileSync('server/avatar-shop-pack-v3.js','utf8');
const catalogV4=fs.readFileSync('server/avatar-shop-pack-v4.js','utf8');
const catalogV5=fs.readFileSync('server/avatar-shop-pack-v5.js','utf8');
const css=fs.readFileSync('avatar-assets.css','utf8');
const html=fs.readFileSync('index.html','utf8');

const basics={
  hair:['hair-curly','hair-sidepart','hair-twintail','hair-green','hair-buzz','hair-long','hair-silver'],
  hat:['hat-cap-red','hat-beanie-green','hat-bucket-yellow','hat-ribbon'],
  glasses:['glasses-square','glasses-blue'],
  outfit:['outfit-tee-red','outfit-tee-blue','outfit-stripe','outfit-sweater-green','outfit-tee-white','outfit-jacket-black'],
  bottom:['bottom-pants-black','bottom-shorts-sport','bottom-skirt-navy','bottom-cargo-khaki'],
  shoes:['shoes-sneakers-red','shoes-sneakers-black','shoes-slipon-yellow','shoes-hightop-blue'],
  bag:['bag-mini','bag-crossbody'],hand:['hand-pencil','hand-notebook','hand-ball'],pet:['pet-hamster','pet-panda','pet-cloud'],face:['face-oval','face-square','face-warm'],expression:['expression-wink','expression-happy','expression-focus','expression-surprise']
};
const v3={hair:['hair-mohawk','hair-braid'],hat:['hat-cat-ears','hat-headphones'],glasses:['glasses-red'],outfit:['outfit-sport-yellow','outfit-cardigan-pink'],bottom:['bottom-jogger-gray'],shoes:['shoes-sneakers-green'],bag:['bag-school-navy'],hand:['hand-camera','hand-microphone'],pet:['pet-penguin','pet-bee','pet-turtle']};
const v4={hair:['hair-spiky-brown','hair-shoulder-wave'],hat:['hat-visor-orange','hat-beret-purple'],glasses:['glasses-star'],outfit:['outfit-polo-green','outfit-overalls-blue'],bottom:['bottom-leggings-black'],shoes:['shoes-runners-purple'],bag:['bag-tote-cream'],hand:['hand-brush','hand-flashlight'],pet:['pet-koala','pet-duck','pet-star']};
const v5={hair:['hair-flame-red','hair-lavender-bob'],hat:['hat-frog-hood','hat-knight-mini'],glasses:['glasses-lightning'],outfit:['outfit-adventure-red','outfit-mage-blue'],bottom:['bottom-adventure-brown'],shoes:['shoes-trail-orange'],bag:['bag-treasure'],hand:['hand-shield','hand-crystal'],pet:['pet-fennec','pet-baby-wolf','pet-moon']};
const ids=Object.values(basics).flat(),v3Ids=Object.values(v3).flat(),v4Ids=Object.values(v4).flat(),v5Ids=Object.values(v5).flat();
assert.equal(ids.length,42);assert.equal(v3Ids.length,15);assert.equal(v4Ids.length,15);assert.equal(v5Ids.length,15);assert.equal(ids.length+v3Ids.length+v4Ids.length+v5Ids.length,87,'active lightweight wardrobe must total 87 items');
for(const [slot,items] of Object.entries(basics))for(const id of items){assert.ok(shop.includes(`'${id}':`),`shop missing ${id}`);assert.ok(shop.includes(`'${id}':'${slot}'`),`slot mismatch ${id}`);assert.ok(client.includes(`'${id}':{svg:`),`visual missing ${id}`)}
for(const [slot,items] of Object.entries(v3))for(const id of items){assert.ok(catalogV3.includes(`'${id}':{name:`),`v3 catalog missing ${id}`);assert.ok(clientV3.includes(`'${id}':{svg:`),`v3 visual missing ${id}`)}
for(const [slot,items] of Object.entries(v4))for(const id of items){assert.ok(catalogV4.includes(`'${id}':{name:`)&&catalogV4.includes(`slot:'${slot}'`),`v4 catalog missing ${id}`);assert.ok(clientV3.includes(`'${id}':{svg:`),`v4 visual missing ${id}`)}
for(const [slot,items] of Object.entries(v5))for(const id of items){assert.ok(catalogV5.includes(`'${id}':{name:`)&&catalogV5.includes(`slot:'${slot}'`),`v5 catalog missing ${id}`);assert.ok(clientV5.includes(`'${id}':{svg:`),`v5 visual missing ${id}`)}
assert.ok(catalogV3.includes("import { avatarShopPackV4 } from './avatar-shop-pack-v4.js'")&&catalogV3.includes("import { avatarShopPackV5 } from './avatar-shop-pack-v5.js'"),'merged shop catalog must include v4/v5');
assert.ok(catalogV3.includes('...packV3,...avatarShopPackV4,...avatarShopPackV5'),'v4/v5 shop data must be active');
assert.ok(clientV3.includes("extra.src='assets/avatar-basic-pack-v5.js?v=20260826v5'"),'active runtime must load v5 visuals');
assert.ok(shop.includes("const RANKING_SLOTS=['face','expression','hair','hat','glasses','outfit','bottom','shoes','bag','hand','pet']"),'ranking must preserve every modular equipment slot including face/expression');
assert.ok(shop.includes("if((ITEM_SLOTS[id]||BUILTIN_STYLE_SLOTS[id])===slot)out[slot]=id"),'ranking must restore both purchased and built-in face/expression styles');
assert.ok(shop.includes('rankingEquipmentFromRaw')&&shop.includes("app.use('/api/ranking'"),'ranking equipment restoration required');
assert.ok(html.includes('assets/avatar-basic-pack-v3.js?v=20260826v3')&&html.includes('assets/avatar-secondary-sync-v2.js?v=20260826v2'),'student runtime avatar loaders required');
assert.ok(secondary.includes("'face','expression','hair'")&&secondary.includes('syncProfile()')&&secondary.includes('syncExpedition()'),'secondary views must synchronize full equipment');
assert.ok(secondary.includes('.sv-profile-face,.sv-exp2-face,.sv-profile-hair,.sv-exp2-hair{z-index:3}')&&secondary.includes('.sv-profile-outfit,.sv-exp2-outfit,.sv-profile-bottom,.sv-exp2-bottom,.sv-profile-shoes,.sv-exp2-shoes{z-index:4}'),'profile and expedition hair must stay behind clothing');
assert.ok(css.includes('.preview-hair{z-index:3!important}')&&css.includes('.preview-outfit,.preview-bottom,.preview-shoes{z-index:4!important}'),'hair must stay behind clothing in preview');
assert.ok(css.includes('.avatar-expression{z-index:5!important}')&&css.includes('.preview-expression{z-index:5!important}'),'expression layer must remain visible');
assert.ok(clientV5.includes("emptyEquipment=()=>Object.fromEntries(slots.map(slot=>[slot,null]))"),'two-phase save must construct an explicit empty purchased-equipment state');
assert.ok(clientV5.includes("originalFetch('/api/shop/equipment'")&&clientV5.includes("method==='POST'")&&clientV5.includes('response.ok'),'successful legacy/base save must clear stale purchased equipment before selected purchased items are restored');
assert.ok(!clientV5.includes('armUntil'),'stale-equipment clearing must not depend on customize.js issuing a second shop PUT');
assert.ok(clientV5.includes("data-shop-slot=\"face\"")||clientV5.includes("['face','얼굴']"),'large shop must expose face filtering');
assert.ok(clientV5.includes("['expression','표정']"),'large shop must expose expression filtering');
assert.ok(clientV5.includes('#student-shop-items{max-height:min(44vh,420px);overflow-y:auto'),'87-item shop list must remain bounded and scrollable');
assert.ok(!ids.some(id=>client.includes(`${id}.png`))&&!v3Ids.some(id=>clientV3.includes(`${id}.png`))&&!v4Ids.some(id=>clientV3.includes(`${id}.png`))&&!v5Ids.some(id=>clientV5.includes(`${id}.png`)),'lightweight packs must remain SVG-only');
console.log(`avatar basic packs contract passed: ${ids.length+v3Ids.length+v4Ids.length+v5Ids.length} active lightweight shop items with end-to-end save + ranking + secondary-view safeguards`);