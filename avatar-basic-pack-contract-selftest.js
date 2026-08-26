const assert=require('assert');
const fs=require('fs');
const shop=fs.readFileSync('server/item-shop.js','utf8');
const client=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const clientV3=fs.readFileSync('assets/avatar-basic-pack-v3.js','utf8');
const secondary=fs.readFileSync('assets/avatar-secondary-sync-v2.js','utf8');
const catalogV3=fs.readFileSync('server/avatar-shop-pack-v3.js','utf8');
const css=fs.readFileSync('avatar-assets.css','utf8');
const html=fs.readFileSync('index.html','utf8');

const basics={
  hair:['hair-curly','hair-sidepart','hair-twintail','hair-green','hair-buzz','hair-long','hair-silver'],
  hat:['hat-cap-red','hat-beanie-green','hat-bucket-yellow','hat-ribbon'],
  glasses:['glasses-square','glasses-blue'],
  outfit:['outfit-tee-red','outfit-tee-blue','outfit-stripe','outfit-sweater-green','outfit-tee-white','outfit-jacket-black'],
  bottom:['bottom-pants-black','bottom-shorts-sport','bottom-skirt-navy','bottom-cargo-khaki'],
  shoes:['shoes-sneakers-red','shoes-sneakers-black','shoes-slipon-yellow','shoes-hightop-blue'],
  bag:['bag-mini','bag-crossbody'],
  hand:['hand-pencil','hand-notebook','hand-ball'],
  pet:['pet-hamster','pet-panda','pet-cloud'],
  face:['face-oval','face-square','face-warm'],
  expression:['expression-wink','expression-happy','expression-focus','expression-surprise']
};
const v3={
  hair:['hair-mohawk','hair-braid'],
  hat:['hat-cat-ears','hat-headphones'],
  glasses:['glasses-red'],
  outfit:['outfit-sport-yellow','outfit-cardigan-pink'],
  bottom:['bottom-jogger-gray'],
  shoes:['shoes-sneakers-green'],
  bag:['bag-school-navy'],
  hand:['hand-camera','hand-microphone'],
  pet:['pet-penguin','pet-bee','pet-turtle']
};
const ids=Object.values(basics).flat(),v3Ids=Object.values(v3).flat();
assert.equal(ids.length,42,'small-screen basic packs v1/v2 must total 42 items');
assert.equal(v3Ids.length,15,'small-screen basic pack v3 must total 15 items');
assert.equal(ids.length+v3Ids.length,57,'active lightweight wardrobe must total 57 items');
for(const [slot,items] of Object.entries(basics))for(const id of items){
  assert.ok(shop.includes(`'${id}':`),`shop price/name missing ${id}`);
  assert.ok(shop.includes(`'${id}':'${slot}'`),`shop slot mismatch for ${id}`);
  assert.ok(client.includes(`'${id}':{svg:`),`${id} must remain a lightweight SVG asset`);
}
for(const [slot,items] of Object.entries(v3))for(const id of items){
  assert.ok(catalogV3.includes(`'${id}':{name:`),`v3 catalog missing ${id}`);
  assert.ok(catalogV3.includes(`slot:'${slot}'`),`v3 catalog slot missing ${id}`);
  assert.ok(clientV3.includes(`'${id}':{svg:`),`${id} v3 visual missing`);
}
assert.ok(shop.includes("import { avatarShopPackV3 } from './avatar-shop-pack-v3.js'"),'item shop must import v3 catalog');
assert.ok(shop.includes('Object.entries(avatarShopPackV3).map(([id,item])=>[id,item.price])'),'v3 prices must merge into live shop');
assert.ok(shop.includes('rankingEquipmentFromRaw')&&shop.includes("app.use('/api/ranking'"),'ranking response must restore current shop equipment from DB');
assert.ok(html.includes('assets/avatar-basic-pack-v3.js?v=20260826v3'),'student runtime must load active v3 visuals');
assert.ok(html.includes('assets/avatar-secondary-sync-v2.js?v=20260826v2'),'student runtime must load unified secondary avatar sync');
assert.ok(secondary.includes("'face','expression','hair'")&&secondary.includes('syncProfile()')&&secondary.includes('syncExpedition()'),'profile and expedition must synchronize face, expression and equipment');
assert.ok(secondary.includes('.sv-profile-expression')&&secondary.includes('.sv-exp2-expression'),'secondary views must layer expressions explicitly');
assert.ok(css.includes('.preview-hair{z-index:3!important}')&&css.includes('.preview-outfit,.preview-bottom,.preview-shoes{z-index:4!important}'),'preview hair must stay behind clothing');
assert.ok(css.includes('.avatar-expression{z-index:5!important}')&&css.includes('.preview-expression{z-index:5!important}'),'expressions must remain visible above body/clothing');
assert.ok(css.includes('.sv-rank-face,.sv-rank-hair{z-index:3!important}')&&css.includes('.sv-rank-outfit,.sv-rank-bottom,.sv-rank-shoes{z-index:4!important}'),'ranking layer order must match main avatar');
assert.ok(!ids.some(id=>client.includes(`${id}.png`))&&!v3Ids.some(id=>clientV3.includes(`${id}.png`)),'basic packs must not introduce per-item PNG artwork');
assert.ok(shop.includes("'pet-hamster':30")&&shop.includes("'pet-panda':36"),'basic pets should remain attainable');
assert.ok(shop.includes("'outfit-tee-red':18")&&shop.includes("'outfit-tee-white':18")&&shop.includes("'shoes-slipon-yellow':16"),'basic clothing should stay inexpensive');
assert.ok(shop.includes("'expression-wink':8")&&shop.includes("'face-oval':10"),'face and expression customization should stay low-cost');
console.log(`avatar basic packs contract passed: ${ids.length+v3Ids.length} active lightweight shop items with synchronized layer ordering`);
