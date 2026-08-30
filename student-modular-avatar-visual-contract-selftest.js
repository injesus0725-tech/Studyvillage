const fs=require('fs'),assert=require('assert');
const renderer=fs.readFileSync('avatar-renderer.js','utf8'),css=fs.readFileSync('avatar-assets.css','utf8'),server=fs.readFileSync('server/server.js','utf8'),index=fs.readFileSync('index.html','utf8'),expedition=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const shop=fs.readFileSync('student-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),contract=fs.readFileSync('assets/avatar-production-contract-v2.css','utf8'),variants=fs.readFileSync('assets/avatar-base-variants-v1.js','utf8');

assert.ok(renderer.includes('viewBox="0 0 96 144"'),'avatar part compatibility renderer must retain its fixed canvas');
assert.ok(!renderer.includes('student-hero')&&!server.includes('student-hero')&&!server.includes('우주 탐험가'),'retired astronaut base must not return');
for(const slot of ['outfit','pet']){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`missing production ${slot} layer`);
  assert.ok(expedition.includes(`'${slot}'`),`expedition must copy production ${slot}`);
}
assert.ok(renderer.includes("base-boy-v2.png")&&renderer.includes("base-girl-v2.png")&&renderer.includes("function defaultHair(){return''}"),'existing default male/female faces and hair must remain part of the base body art');
for(const id of ['character-boy-02','character-boy-03','character-boy-04','character-boy-05','character-girl-02','character-girl-03','character-girl-04','character-girl-05'])assert.ok(variants.includes(`'${id}'`),`base variant renderer mapping missing ${id}`);
assert.ok(shop.includes('paintProductPreview(b,item)')&&shop.includes('renderer.paintItem(part,item.id)'),'shop cards must show the exact applied wearable item');
for(const slot of ['character','outfit','effect','pet'])assert.ok(shop.includes(`data-shop-slot="${slot}"`),`상점에 ${slot} 생산 분류가 보여야 합니다.`);
for(const retired of ['hair','hat','glasses','bottom','shoes','bag','hand'])assert.ok(!shop.includes(`data-shop-slot="${retired}"`),`폐기된 ${retired} 분류를 상점에 다시 보여주면 안 됩니다.`);
assert.ok(renderer.includes('paintAvatarBase')&&customize.includes("const slots=['outfit','effect','pet']"),'base character must be selected separately and only outfit/effect/pet may remain as wearable production slots');
assert.ok(customize.includes("effect:'효과'")&&customize.includes("outfit:'한벌 의상'")&&customize.includes('for(const c of playerData?.baseCharacters||[])'),'wardrobe must show base character plus outfit/effect/pet production architecture');
assert.ok(customize.includes('paintOwnedPreview(b,info,available)'),'owned-item cards must use the same applied design');
assert.ok(contract.includes('.avatar-hair')&&contract.includes('display:none!important'),'legacy hair overlay must stay hidden so base-character face/hair remains intact');
assert.ok(contract.includes('clip-path:inset(27% 0 0 0)'),'outfits must preserve the face/hair region');
assert.ok(contract.includes('scale(1.45)'),'production pets must retain the enlarged display scale');
assert.ok(!index.includes('assets/avatar-rpg-unification.js'),'legacy separate face/expression overlay runtime must stay disabled');
console.log('student base-character modular visual contract self-test passed');
