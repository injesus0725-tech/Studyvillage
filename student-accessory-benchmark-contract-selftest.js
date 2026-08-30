const assert=require('assert');
const fs=require('fs');
const catalog=fs.readFileSync('server/avatar-shop-pack-v3.js','utf8');
const renderer=fs.readFileSync('avatar-renderer.js','utf8');
const variants=fs.readFileSync('assets/avatar-base-variants-v1.js','utf8');
const client=fs.readFileSync('student-shop.js','utf8');
const contract=fs.readFileSync('assets/avatar-production-contract-v2.css','utf8');
const itemSpec=fs.readFileSync('AVATAR_ITEM_SPEC.md','utf8');
const retirement=fs.readFileSync('AVATAR_NORMALIZER_RETIREMENT.md','utf8');
const normalizerStub=fs.readFileSync('assets/avatar-auto-normalize-v1.js','utf8');

const characters=['character-boy-02','character-boy-03','character-boy-04','character-boy-05','character-girl-02','character-girl-03','character-girl-04','character-girl-05'];
const outfits=['outfit-silver-knight','outfit-star-mage-production','outfit-school-scientist','outfit-forest-archer-production','outfit-pirate-captain-production','outfit-moon-priest-production'];
const pets=['pet-maltese-production','pet-toy-poodle-production','pet-corgi-production','pet-cheese-cat-production','pet-lop-rabbit-production','pet-baby-dragon-production'];

for(const id of characters){
  assert.ok(!catalog.includes(`'${id}'`),`unfinished base character must not be sold ${id}`);
  assert.ok(!variants.includes(`'${id}'`),`unfinished base character must not be registered ${id}`);
}
for(const id of outfits){
  assert.ok(catalog.includes(`'${id}'`),`production outfit catalog missing ${id}`);
  assert.ok(renderer.includes(`'${id}'`),`avatar renderer missing ${id}`);
}
for(const id of pets){
  assert.ok(catalog.includes(`'${id}'`),`production pet catalog missing ${id}`);
  assert.ok(renderer.includes(`'${id}'`),`avatar renderer missing ${id}`);
}
for(const retired of ['leaf-cap','scholar-cap','explorer-goggles','star-monocle','field-satchel','book-pack']){
  assert.ok(!catalog.includes(`'${retired}'`),`retired accessory must not return to production catalog: ${retired}`);
  assert.ok(!client.includes(`'${retired}'`),`retired accessory must not return to student shop: ${retired}`);
}

assert.ok(client.includes('data-shop-slot="character"'),'student shop must retain the future base character category');
assert.ok(client.includes('data-shop-slot="outfit"'),'student shop must expose one-piece outfit category');
assert.ok(client.includes('data-shop-slot="pet"'),'student shop must expose pet category');

// Final production contract: assets are pre-aligned on the fixed 256x256 canvas.
// Outfit alignment is based on the base character neck/sole lines and clothing coverage,
// not whole-image bounds or runtime alpha analysis.
assert.ok(itemSpec.includes('런타임 자동 픽셀 분석·Canvas 재생성·PNG data URL 변환은 금지한다'),'runtime pixel normalization must remain prohibited');
assert.ok(itemSpec.includes('0,0에 그대로 겹치기만 한다'),'finished production PNGs must render directly at 0,0');
assert.ok(retirement.includes('neck line and sole line'),'outfit production must use neck and sole anchors');
assert.ok(retirement.includes('fully cover the default clothing silhouette'),'outfits must cover the base clothing silhouette');
assert.ok(retirement.includes('do not participate in alignment calculations'),'external decorations must not affect alignment');
assert.ok(retirement.includes('Runtime performs no alpha-bound scan'),'runtime alpha-bound scanning must remain retired');
assert.ok(!normalizerStub.includes('getImageData'),'compatibility stub must not scan pixels');
assert.ok(!normalizerStub.includes('MutationObserver'),'compatibility stub must not observe/rewrite runtime images');
assert.ok(!normalizerStub.includes('toDataURL'),'compatibility stub must not rewrite PNGs as data URLs');
assert.ok(contract.includes('transform:none!important'),'manual item-specific transforms must remain removed');

console.log('student production avatar benchmark contract selftest passed');
