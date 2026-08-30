const fs=require('fs'),assert=require('assert');
const renderer=fs.readFileSync('avatar-renderer.js','utf8'),css=fs.readFileSync('avatar-assets.css','utf8'),server=fs.readFileSync('server/server.js','utf8'),index=fs.readFileSync('index.html','utf8'),expedition=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const shop=fs.readFileSync('student-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),contract=fs.readFileSync('assets/avatar-production-contract-v2.css','utf8'),variants=fs.readFileSync('assets/avatar-base-variants-v1.js','utf8'),normalizer=fs.readFileSync('assets/avatar-auto-normalize-v1.js','utf8');

assert.ok(renderer.includes('viewBox="0 0 96 144"'),'avatar part compatibility renderer must retain its fixed canvas');
assert.ok(!renderer.includes('student-hero')&&!server.includes('student-hero')&&!server.includes('우주 탐험가'),'retired astronaut base must not return');
for(const slot of ['outfit','pet']){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`missing production ${slot} layer`);
  assert.ok(expedition.includes(`'${slot}'`),`expedition must copy production ${slot}`);
}
assert.ok(renderer.includes("base-boy-v2.png")&&renderer.includes("base-girl-v2.png")&&renderer.includes("function defaultHair(){return''}"),'existing default male/female faces and hair must remain part of the base body art');
assert.ok(!variants.includes('character-boy-02')&&!variants.includes('character-girl-02'),'unfinished purchasable base variants must not be registered');
assert.ok(shop.includes('paintProductPreview(b,item)')&&shop.includes('renderer.paintItem(part,item.id)'),'shop cards must show the exact applied wearable item');
for(const slot of ['character','outfit','effect','pet'])assert.ok(shop.includes(`data-shop-slot="${slot}"`),`상점에 ${slot} 생산 분류가 보여야 합니다.`);
for(const retired of ['hair','hat','glasses','bottom','shoes','bag','hand'])assert.ok(!shop.includes(`data-shop-slot="${retired}"`),`폐기된 ${retired} 분류를 상점에 다시 보여주면 안 됩니다.`);
assert.ok(renderer.includes('paintAvatarBase')&&customize.includes("const slots=['outfit','effect','pet']"),'base character must be selected separately and only outfit/effect/pet may remain as wearable production slots');
assert.ok(customize.includes("effect:'효과'")&&customize.includes("outfit:'한벌 의상'")&&customize.includes('for(const c of playerData?.baseCharacters||[])'),'wardrobe must show base character plus outfit/effect/pet production architecture');
assert.ok(customize.includes('paintOwnedPreview(b,info,available)'),'owned-item cards must use the same applied design');
assert.ok(contract.includes('.avatar-hair')&&contract.includes('display:none!important'),'legacy hair overlay must stay hidden so base-character face/hair remains intact');
assert.ok(contract.includes('transform:none!important'),'production CSS must not carry per-item transform corrections');
assert.ok(normalizer.includes('const MASTER_SIZE=256'),'production assets must normalize to the shared 256 master canvas');
assert.ok(normalizer.includes("outfit:{centerX:128,bottomY:246,maxHeight:180,maxWidth:248}"),'all outfits must share one master anchor');
assert.ok(normalizer.includes("pet:{centerX:180,bottomY:246,maxHeight:112,maxWidth:96}"),'all pets must share one close-to-leg master anchor');
assert.ok(normalizer.includes('medianX')&&normalizer.includes('alphaMetrics'),'outfit alignment must use visible alpha mass instead of transparent file margins');
assert.ok(!normalizer.includes('outfit-silver-knight')&&!normalizer.includes('pet-maltese-production'),'normalizer may not contain per-item exceptions');
assert.ok(variants.includes('avatar-auto-normalize-v1.js?v=20260830c'),'shared normalizer must load for student avatar surfaces');
assert.ok(!index.includes('assets/avatar-rpg-unification.js'),'legacy separate face/expression overlay runtime must stay disabled');
console.log('student base-character modular visual contract self-test passed');
