const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=__dirname;
const direction=fs.readFileSync(path.join(root,'AVATAR_PRODUCTION_DIRECTION.md'),'utf8');
const spec=fs.readFileSync(path.join(root,'AVATAR_ITEM_SPEC.md'),'utf8');
const renderer=fs.readFileSync(path.join(root,'avatar-renderer.js'),'utf8');
const catalog=fs.readFileSync(path.join(root,'server/avatar-shop-pack-v3.js'),'utf8');
const normalizer=fs.readFileSync(path.join(root,'assets/avatar-auto-normalize-v1.js'),'utf8');

for(const phrase of ['256×256 하나만','목선과 발바닥선','기본 의상 실루엣을 완전히 덮는 must-cover 영역','0,0에 그대로 겹친다']){
  assert.ok(direction.includes(phrase),`final avatar production direction missing: ${phrase}`);
}
for(const phrase of ['목선 고정','발바닥선 고정','기본 의상 must-cover']){
  assert.ok(spec.includes(phrase),`final avatar item spec missing: ${phrase}`);
}
for(const retired of ['hair-short','hair-bob','hair-ponytail','hair-blue','leaf-cap','scholar-cap','explorer-goggles','star-monocle','field-satchel','book-pack']){
  assert.ok(!catalog.includes(`'${retired}'`),`retired standalone avatar product must stay out of production catalog: ${retired}`);
}
for(const id of ['outfit-silver-knight','outfit-star-mage-production','outfit-school-scientist','outfit-forest-archer-production','outfit-pirate-captain-production','outfit-moon-priest-production']){
  assert.ok(renderer.includes(`'${id}'`),`production renderer missing outfit: ${id}`);
}
assert.ok(!normalizer.includes('getImageData')&&!normalizer.includes('alphaMetrics')&&!normalizer.includes('medianX'),'retired runtime pixel normalizer must remain inert');
assert.ok(!normalizer.includes('MutationObserver')&&!normalizer.includes('toDataURL'),'retired runtime rewrite path must remain inert');
console.log('avatar fixed-anchor production template contract passed');
require('./avatar-basic-pack-contract-selftest.js');
