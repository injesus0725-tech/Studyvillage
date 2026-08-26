const assert=require('assert');
const fs=require('fs');
const shop=fs.readFileSync('server/item-shop.js','utf8');
const client=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');

const basics={
  hair:['hair-curly','hair-sidepart','hair-twintail','hair-green'],
  hat:['hat-cap-red','hat-beanie-green'],
  glasses:['glasses-square','glasses-blue'],
  outfit:['outfit-tee-red','outfit-tee-blue','outfit-stripe','outfit-sweater-green'],
  bottom:['bottom-pants-black','bottom-shorts-sport','bottom-skirt-navy'],
  shoes:['shoes-sneakers-red','shoes-sneakers-black','shoes-slipon-yellow'],
  bag:['bag-mini'],
  hand:['hand-pencil','hand-notebook'],
  pet:['pet-hamster']
};
const ids=Object.values(basics).flat();
assert.equal(ids.length,22,'small-screen basics pack size must stay at 22 items');
for(const [slot,items] of Object.entries(basics))for(const id of items){
  assert.ok(shop.includes(`'${id}':`),`shop price/name missing ${id}`);
  assert.ok(shop.includes(`'${id}':'${slot}'`),`shop slot mismatch for ${id}`);
  assert.ok(client.includes(`'${id}':{svg:`),`${id} must remain a lightweight SVG asset`);
}
assert.ok(!ids.some(id=>client.includes(`${id}.png`)),'basic pack must not introduce per-item PNG artwork');
assert.ok(shop.includes("'pet-hamster':30"),'hamster should remain an attainable mid-tier pet');
assert.ok(shop.includes("'outfit-tee-red':18")&&shop.includes("'shoes-slipon-yellow':16"),'basic clothing should stay inexpensive');
console.log(`avatar basic pack contract passed: ${ids.length} lightweight shop items`);
