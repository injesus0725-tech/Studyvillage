const fs=require('fs'),assert=require('assert');
const renderer=fs.readFileSync('avatar-renderer.js','utf8'),css=fs.readFileSync('avatar-assets.css','utf8'),server=fs.readFileSync('server/server.js','utf8'),index=fs.readFileSync('index.html','utf8'),expedition=fs.readFileSync('assets/avatar-fullbody-fix.js','utf8');
const shop=fs.readFileSync('student-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),contract=fs.readFileSync('assets/avatar-production-contract-v2.css','utf8'),variants=fs.readFileSync('assets/avatar-base-variants-v1.js','utf8'),normalizer=fs.readFileSync('assets/avatar-auto-normalize-v1.js','utf8'),spec=fs.readFileSync('AVATAR_ITEM_SPEC.md','utf8');

assert.ok(renderer.includes('viewBox="0 0 96 144"'),'avatar part compatibility renderer must retain its fixed canvas');
assert.ok(!renderer.includes('student-hero')&&!server.includes('student-hero')&&!server.includes('우주 탐험가'),'retired astronaut base must not return');
for(const slot of ['outfit','pet']){
  assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`missing production ${slot} layer`);
  assert.ok(expedition.includes(`'${slot}'`),`expedition must copy production ${slot}`);
}
assert.ok(renderer.includes("base-boy-v2.png")&&renderer.includes("base-girl-v2.png")&&renderer.includes("function defaultHair(){return''}"),'existing default male/female faces and hair must remain part of the base body art');
assert.ok(!variants.includes('character-boy-02')&&!variants.includes('character-girl-02'),'unfinished purchasable base variants must not be registered');
assert.ok(shop.includes('paintProductPreview(b,item,data.baseCharacter)')&&shop.includes('renderer.paintItem(part,item.id)'),'shop cards must show the exact wearable on the equipped male/female base');
for(const slot of ['character','outfit','effect','pet'])assert.ok(shop.includes(`data-shop-slot="${slot}"`),`상점에 ${slot} 생산 분류가 보여야 합니다.`);
for(const retired of ['hair','hat','glasses','bottom','shoes','bag','hand'])assert.ok(!shop.includes(`data-shop-slot="${retired}"`),`폐기된 ${retired} 분류를 상점에 다시 보여주면 안 됩니다.`);
assert.ok(renderer.includes('paintAvatarBase')&&customize.includes("const slots=['outfit','effect','pet']"),'base character must be selected separately and only outfit/effect/pet may remain as wearable production slots');
assert.ok(customize.includes("effect:'효과'")&&customize.includes("outfit:'한벌 의상'")&&customize.includes('for(const c of playerData?.baseCharacters||[])'),'wardrobe must show base character plus outfit/effect/pet production architecture');
assert.ok(customize.includes('paintOwnedPreview(b,info,available)'),'owned-item cards must use the same applied design');
assert.ok(contract.includes('.avatar-hair')&&contract.includes('display:none!important'),'legacy hair overlay must stay hidden so base-character face/hair remains intact');
assert.ok(contract.includes('transform:none!important'),'production CSS must not carry per-item transform corrections');
assert.ok(spec.includes('256×256')&&spec.includes('발바닥'),'production assets must be authored on the shared fixed 256 master canvas');
assert.ok(spec.includes('기본 캐릭터')&&spec.includes('기본 의상'),'outfit production must be authored against the base character and cover default clothing');
assert.ok(!normalizer.includes('getImageData')&&!normalizer.includes('alphaMetrics')&&!normalizer.includes('medianX'),'runtime alpha scanning and whole-image alignment must remain retired');
assert.ok(!normalizer.includes('MutationObserver')&&!normalizer.includes('toDataURL'),'runtime canvas/data-url rewriting must remain retired');
assert.ok(!variants.includes('avatar-auto-normalize-v1.js'),'base variant gate must not dynamically load the retired normalizer');
assert.ok(!index.includes('avatar-auto-normalize-v1.js'),'index must not load the retired normalizer');
assert.ok(!index.includes('assets/avatar-rpg-unification.js'),'legacy separate face/expression overlay runtime must stay disabled');
console.log('student base-character modular visual contract self-test passed');
