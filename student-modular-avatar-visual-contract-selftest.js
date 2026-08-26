const fs=require('fs'),assert=require('assert');
const renderer=fs.readFileSync('avatar-renderer.js','utf8'),css=fs.readFileSync('avatar-assets.css','utf8'),server=fs.readFileSync('server/server.js','utf8'),index=fs.readFileSync('index.html','utf8'),expedition=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const shop=fs.readFileSync('student-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8');
assert.ok(renderer.includes('viewBox="0 0 96 144"'),'every mini-me part must share one fixed canvas');
assert.ok(!renderer.includes('student-hero')&&!server.includes('student-hero')&&!server.includes('우주 탐험가'),'retired astronaut base must not return');
for(const slot of ['hair','outfit','bottom','shoes','hat','glasses','bag','hand','pet']){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`missing fixed ${slot} layer`);
  assert.ok(expedition.includes(`'${slot}'`),`expedition must copy ${slot}`);
}
for(const id of ['bottom-jeans','bottom-shorts','bottom-skirt'])assert.ok(renderer.includes(`'${id}'`),`missing anatomical lower-body asset ${id}`);
assert.ok(css.includes('inset:0!important')&&css.includes('.avatar-bottom'),'avatar parts must fill the same anchored box');
assert.ok(!css.includes('visibility:hidden!important'),'hats must not make the character bald; their opaque SVG must naturally cover only the hair beneath them');
assert.ok(renderer.includes("hat('wizard','#352956')")&&renderer.includes('Q36 16 43 4'),'wizard hat must use a curved RPG silhouette instead of a flat comedy triangle');
assert.ok(shop.includes('paintProductPreview(b,item)')&&shop.includes('StudyVillageAvatar.paintItem(part,item.id)'),'shop cards must show the exact applied SVG item');
assert.ok(shop.includes("item.slot==='hat'")&&shop.includes("paintItem(hair,'hair-short')"),'hat shop previews must include hair beneath the brim');
assert.ok(customize.includes('paintOwnedPreview(b,info,available)'),'owned-item cards must use the same applied design');
console.log('student modular mini-me visual contract self-test passed');
