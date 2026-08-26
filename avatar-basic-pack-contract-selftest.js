const assert=require('assert');
const fs=require('fs');
const shop=fs.readFileSync('server/item-shop.js','utf8');
const client=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const clientV3=fs.readFileSync('assets/avatar-basic-pack-v3.js','utf8');
const secondary=fs.readFileSync('assets/avatar-secondary-sync-v2.js','utf8');
const catalogV3=fs.readFileSync('server/avatar-shop-pack-v3.js','utf8');
const catalogV4=fs.readFileSync('server/avatar-shop-pack-v4.js','utf8');
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
  hair:['hair-mohawk','hair-braid'],hat:['hat-cat-ears','hat-headphones'],glasses:['glasses-red'],outfit:['outfit-sport-yellow','outfit-cardigan-pink'],bottom:['bottom-jogger-gray'],shoes:['shoes-sneakers-green'],bag:['bag-school-navy'],hand:['hand-camera','hand-microphone'],pet:['pet-penguin','pet-bee','pet-turtle']
};
const v4={
  hair:['hair-spiky-brown','hair-shoulder-wave'],hat:['hat-visor-orange','hat-beret-purple'],glasses:['glasses-star'],outfit:['outfit-polo-green','outfit-overalls-blue'],bottom:['bottom-leggings-black'],shoes:['shoes-runners-purple'],bag:['bag-tote-cream'],hand:['hand-brush','hand-flashlight'],pet:['pet-koala','pet-duck','pet-star']
};
const ids=Object.values(basics).flat(),v3Ids=Object.values(v3).flat(),v4Ids=Object.values(v4).flat();
assert.equal(ids.length,42,'small-screen basic packs v1/v2 must total 42 items');
assert.equal(v3Ids.length,15,'small-screen basic pack v3 must total 15 items');
assert.equal(v4Ids.length,15,'small-screen basic pack v4 must total 15 items');
assert.equal(ids.length+v3Ids.length+v4Ids.length,72,'active lightweight wardrobe must total 72 items');
for(const [slot,items] of Object.entries(basics))for(const id of items){
  assert.ok(shop.includes(`'${id}':`),`shop price/name missing ${id}`);
  assert.ok(shop.includes(`'${id}':'${slot}'`),`shop slot mismatch for ${id}`);
  assert.ok(client.includes(`'${id}':{svg:`),`${id} must remain a lightweight SVG asset`);
}
for(const [slot,items] of Object.entries(v3))for(const id of items){
  assert.ok(catalogV3.includes(`'${id}':{name:`),`v3 catalog missing ${id}`);
  assert.ok(clientV3.includes(`'${id}':{svg:`),`${id} v3 visual missing`);
}
for(const [slot,items] of Object.entries(v4))for(const id of items){
  assert.ok(catalogV4.includes(`'${id}':{name:`),`v4 catalog missing ${id}`);
  assert.ok(catalogV4.includes(`slot:'${slot}'`),`v4 catalog slot missing ${id}`);
  assert.ok(clientV3.includes(`'${id}':{svg:`),`${id} v4 visual must be merged into active v3 loader`);
}
assert.ok(catalogV3.includes("import { avatarShopPackV4 } from './avatar-shop-pack-v4.js'"),'v3 shop catalog must merge v4');
assert.ok(catalogV3.includes('...packV3,...avatarShopPackV4'),'v4 shop data must be active through v3 export');
assert.ok(shop.includes("import { avatarShopPackV3 } from './avatar-shop-pack-v3.js'"),'item shop must import merged avatar catalog');
assert.ok(shop.includes('rankingEquipmentFromRaw')&&shop.includes("app.use('/api/ranking'"),'ranking response must restore current shop equipment from DB');
assert.ok(html.includes('assets/avatar-basic-pack-v3.js?v=20260826v3'),'student runtime must load merged v3/v4 visuals');
assert.ok(html.includes('assets/avatar-secondary-sync-v2.js?v=20260826v2'),'student runtime must load unified secondary avatar sync');
assert.ok(secondary.includes("'face','expression','hair'")&&secondary.includes('syncProfile()')&&secondary.includes('syncExpedition()'),'profile and expedition must synchronize face, expression and equipment');
assert.ok(css.includes('.preview-hair{z-index:3!important}')&&css.includes('.preview-outfit,.preview-bottom,.preview-shoes{z-index:4!important}'),'preview hair must stay behind clothing');
assert.ok(css.includes('.avatar-expression{z-index:5!important}')&&css.includes('.preview-expression{z-index:5!important}'),'expressions must remain visible above body/clothing');
assert.ok(css.includes('.sv-rank-face,.sv-rank-hair{z-index:3!important}')&&css.includes('.sv-rank-outfit,.sv-rank-bottom,.sv-rank-shoes{z-index:4!important}'),'ranking layer order must match main avatar');
assert.ok(!ids.some(id=>client.includes(`${id}.png`))&&!v3Ids.some(id=>clientV3.includes(`${id}.png`))&&!v4Ids.some(id=>clientV3.includes(`${id}.png`)),'basic packs must not introduce per-item PNG artwork');
console.log(`avatar basic packs contract passed: ${ids.length+v3Ids.length+v4Ids.length} active lightweight shop items with synchronized layer ordering`);
