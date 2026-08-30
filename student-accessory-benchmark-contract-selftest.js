const assert=require('assert');
const fs=require('fs');
const catalog=fs.readFileSync('server/avatar-shop-pack-v3.js','utf8');
const renderer=fs.readFileSync('avatar-renderer.js','utf8');
const variants=fs.readFileSync('assets/avatar-base-variants-v1.js','utf8');
const client=fs.readFileSync('student-shop.js','utf8');
const contract=fs.readFileSync('assets/avatar-production-contract-v2.css','utf8');

const characters=['character-boy-02','character-boy-03','character-boy-04','character-boy-05','character-girl-02','character-girl-03','character-girl-04','character-girl-05'];
const outfits=['outfit-silver-knight','outfit-star-mage-production','outfit-school-scientist','outfit-forest-archer-production','outfit-pirate-captain-production','outfit-moon-priest-production'];
const pets=['pet-maltese-production','pet-toy-poodle-production','pet-corgi-production','pet-cheese-cat-production','pet-lop-rabbit-production','pet-baby-dragon-production'];

for(const id of characters){
  assert.ok(catalog.includes(`'${id}'`),`production character catalog missing ${id}`);
  assert.ok(variants.includes(`'${id}'`),`base character renderer registration missing ${id}`);
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
assert.ok(client.includes('data-shop-slot="character"'),'student shop must expose base character category');
assert.ok(client.includes('data-shop-slot="outfit"'),'student shop must expose one-piece outfit category');
assert.ok(client.includes('data-shop-slot="pet"'),'student shop must expose pet category');
assert.ok(contract.includes('scale(1.45)'),'production pet visual scale contract is required');
assert.ok(contract.includes('clip-path:inset(27% 0 0 0)'),'production outfit face protection is required');
console.log('student production avatar benchmark contract selftest passed');
