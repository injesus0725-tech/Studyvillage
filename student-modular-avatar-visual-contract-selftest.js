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
assert.ok(renderer.includes("base-boy-v2.png")&&renderer.includes("base-girl-v2.png")&&renderer.includes("function defaultHair(){return''}"),'머리와 얼굴은 완성형 남녀 캐릭터 본체에 포함되어야 합니다.');
assert.ok(renderer.includes("hat-wizard-rpg-v4.png")&&!renderer.includes("'hat-wizard':{svg"),'wizard hat must use the approved premium raster asset instead of the comedy SVG triangle');
assert.ok(shop.includes('paintProductPreview(b,item)')&&shop.includes('StudyVillageAvatar.paintItem(part,item.id)'),'shop cards must show the exact applied SVG item');
assert.ok(shop.includes("!['face','expression','hair','hat','glasses'].includes(item.slot)"),'상점은 제거된 얼굴 조립 부품을 노출하지 않아야 합니다.');
assert.ok(renderer.includes('paintAvatarBase')&&customize.includes("['outfit','bottom','shoes','bag','hand','pet']"),'완성형 본체에는 옷·손 아이템·친구만 조합해야 합니다.');
assert.ok(customize.includes('paintOwnedPreview(b,info,available)'),'owned-item cards must use the same applied design');
console.log('student modular mini-me visual contract self-test passed');
