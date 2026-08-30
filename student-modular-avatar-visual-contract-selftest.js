const fs=require('fs'),assert=require('assert');
const renderer=fs.readFileSync('avatar-renderer.js','utf8'),css=fs.readFileSync('avatar-assets.css','utf8'),server=fs.readFileSync('server/server.js','utf8'),index=fs.readFileSync('index.html','utf8'),expedition=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const shop=fs.readFileSync('student-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8');
assert.ok(renderer.includes('viewBox="0 0 96 144"'),'every mini-me part must share one fixed canvas');
assert.ok(!renderer.includes('student-hero')&&!server.includes('student-hero')&&!server.includes('우주 탐험가'),'retired astronaut base must not return');
for(const slot of ['hair','outfit','bottom','shoes','hat','glasses','bag','hand','pet']){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`missing fixed legacy ${slot} layer`);
  assert.ok(expedition.includes(`'${slot}'`),`expedition must copy legacy ${slot}`);
}
for(const id of ['bottom-jeans','bottom-shorts','bottom-skirt'])assert.ok(renderer.includes(`'${id}'`),`missing anatomical lower-body asset ${id}`);
assert.ok(css.includes('inset:0!important')&&css.includes('.avatar-bottom'),'avatar parts must fill the same anchored box');
assert.ok(renderer.includes("base-boy-v2.png")&&renderer.includes("base-girl-v2.png")&&renderer.includes("function defaultHair(){return''}"),'머리와 얼굴은 완성형 남녀 캐릭터 본체에 포함되어야 합니다.');
assert.ok(renderer.includes("hat-wizard-rpg-v4.png")&&!renderer.includes("'hat-wizard':{svg"),'wizard hat must use the approved premium raster asset instead of the comedy SVG triangle');
assert.ok(shop.includes('paintProductPreview(b,item)')&&shop.includes('renderer.paintItem(part,item.id)'),'shop cards must show the exact applied item');
for(const slot of ['hair','outfit','bottom','shoes','bag','hand','pet','effect'])assert.ok(shop.includes(`data-shop-slot="${slot}"`),`상점에 ${slot} 분류가 보여야 합니다.`);
assert.ok(renderer.includes('paintAvatarBase')&&customize.includes("const slots=['hair','outfit','effect','pet','bottom','shoes','bag','hand']"),'완성형 본체에는 머리·한벌 의상·효과·펫을 중심으로 조합하고 기존 장비도 호환해야 합니다.');
assert.ok(customize.includes("effect:'효과'")&&customize.includes("outfit:'한벌 의상'"),'새 옷장은 효과와 한벌 의상을 핵심 분류로 표시해야 합니다.');
assert.ok(customize.includes('paintOwnedPreview(b,info,available)'),'owned-item cards must use the same applied design');
console.log('student four-slot mini-me visual compatibility contract self-test passed');
