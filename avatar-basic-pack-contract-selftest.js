const assert=require('assert');
const fs=require('fs');
const shop=fs.readFileSync('server/item-shop.js','utf8');
const client=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');

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
const ids=Object.values(basics).flat();
assert.equal(ids.length,42,'small-screen basic packs must total 42 items');
for(const [slot,items] of Object.entries(basics))for(const id of items){
  assert.ok(shop.includes(`'${id}':`),`shop price/name missing ${id}`);
  assert.ok(shop.includes(`'${id}':'${slot}'`),`shop slot mismatch for ${id}`);
  assert.ok(client.includes(`'${id}':{svg:`),`${id} must remain a lightweight SVG asset`);
}
assert.ok(!ids.some(id=>client.includes(`${id}.png`)),'basic packs must not introduce per-item PNG artwork');
assert.ok(shop.includes("'pet-hamster':30")&&shop.includes("'pet-panda':36"),'basic pets should remain attainable');
assert.ok(shop.includes("'outfit-tee-red':18")&&shop.includes("'outfit-tee-white':18")&&shop.includes("'shoes-slipon-yellow':16"),'basic clothing should stay inexpensive');
assert.ok(shop.includes("'expression-wink':8")&&shop.includes("'face-oval':10"),'face and expression customization should stay low-cost');
console.log(`avatar basic packs contract passed: ${ids.length} lightweight shop items`);
