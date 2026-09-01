const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=__dirname;
const direction=fs.readFileSync(path.join(root,'AVATAR_PRODUCTION_DIRECTION.md'),'utf8');
const catalog=fs.readFileSync(path.join(root,'server/avatar-shop-pack-v3.js'),'utf8');
const renderer=fs.readFileSync(path.join(root,'avatar-renderer.js'),'utf8');
const shop=fs.readFileSync(path.join(root,'server/item-shop.js'),'utf8');
const customize=fs.readFileSync(path.join(root,'customize.js'),'utf8');
const studentShop=fs.readFileSync(path.join(root,'student-shop.js'),'utf8');
const whole=fs.readFileSync(path.join(root,'server/whole-character-catalog.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const contract=fs.readFileSync(path.join(root,'assets/avatar-production-contract-v2.css'),'utf8');
const variants=fs.readFileSync(path.join(root,'assets/avatar-base-variants-v1.js'),'utf8');
const outfitBake=fs.readFileSync(path.join(root,'scripts/bake-avatar-outfit-v2.py'),'utf8');
const previewBake=fs.readFileSync(path.join(root,'scripts/build-avatar-shop-previews.py'),'utf8');

for(const phrase of ['기본 캐릭터 변형 → 한벌 의상 → 효과 → 펫','체육관 / 보건실 / 3-1반 교실 / 급식실','마을 전체 그래픽 리디자인'])assert.ok(direction.includes(phrase),`production direction missing: ${phrase}`);
for(const phrase of ['별도의 `hair` 상품은 더 이상 만들지 않는다','몸체 크기, 목·어깨 위치, 발 중앙, 캔버스 기준점을 완전히 동일하게 유지'])assert.ok(direction.includes(phrase),`base variant direction missing: ${phrase}`);
for(const legacy of ['bottom','shoes','bag','hand'])assert.ok(shop.includes(`'${legacy}'`),`legacy slot must remain explicitly retired: ${legacy}`);
assert.ok(shop.includes("ACTIVE_ITEM_IDS=Object.freeze([...Object.keys(avatarShopPackV3),'candy','stationery'])"),'only production avatar items may be active');
for(const id of ['character-boy-02','character-boy-03','character-boy-04','character-boy-05','character-girl-02','character-girl-03','character-girl-04','character-girl-05']){
  assert.ok(!catalog.includes(`'${id}'`),`unfinished base variant must not be sold: ${id}`);
  assert.ok(!whole.includes(`id:'${id}'`),`unfinished base variant must not be exposed by server: ${id}`);
  assert.ok(!variants.includes(`'${id}'`),`unfinished base variant must not be registered: ${id}`);
}
for(const retiredHair of ['hair-short','hair-bob','hair-ponytail','hair-blue'])assert.ok(!catalog.includes(`'${retiredHair}'`),`standalone hair product must be retired: ${retiredHair}`);
assert.ok(whole.includes("id:'student-boy'")&&whole.includes("id:'student-girl'"),'the two free basic bodies must remain');
assert.ok(index.includes('avatar-renderer.js?v=20260901rpg14'),'avatar renderer cache version must be refreshed');
assert.ok(index.includes('avatar-base-variants-v1.js')&&index.includes('avatar-production-contract-v2.css'),'base production gate and production contract assets must load');
assert.ok(!index.includes('avatar-auto-normalize-v1.js'),'runtime pixel scanning normalizer must stay disabled for classroom performance');
assert.ok(contract.includes('transform:none!important'),'production contract must remove manual wearable transform corrections');
assert.ok(contract.includes('Runtime never scans pixels'),'production runtime must remain lightweight and use pre-aligned assets');
const expected=[
  'production/outfits/silver-knight.png','production/outfits/star-mage.png','production/outfits/school-scientist.png',
  'production/outfits/forest-archer.png','production/outfits/pirate-captain.png','production/outfits/moon-priest.png',
  'production/pets/maltese.png','production/pets/toy-poodle.png','production/pets/corgi.png',
  'production/pets/cheese-cat.png','production/pets/lop-rabbit.png','production/pets/baby-dragon.png'
];
for(const rel of expected){const full=path.join(root,'assets/avatar-runtime',rel);assert.ok(fs.existsSync(full),`missing production raster: ${rel}`);assert.ok(fs.statSync(full).size>3000,`production raster is unexpectedly small: ${rel}`);assert.ok(renderer.includes(rel),`renderer missing production raster: ${rel}`)}
for(const name of ['silver-knight.png','star-mage.png','school-scientist.png','forest-archer.png','pirate-captain.png','moon-priest.png']){
  const rel=`production/shop-previews/${name}`,full=path.join(root,'assets/avatar-runtime',rel);
  assert.ok(fs.existsSync(full)&&fs.statSync(full).size>3000,`missing baked one-layer shop preview: ${rel}`);
}
assert.ok(renderer.includes('onePiece:true'),'production outfits must use the shared one-piece head/neck mask');
assert.ok(studentShop.includes("shop-preview-base shop-preview-head-only"),'student shop must use the shared head/neck mask');
assert.ok(outfitBake.includes('FACE_KEEP_OUT = (104, 48, 153, 88)'),'outfit bake must preserve authored necklines from Y=89');
assert.ok(previewBake.includes('HEAD_BOTTOM = 89'),'shop preview head mask must meet the authored neckline at Y=89');
assert.ok(outfitBake.includes('TARGET_BODY_CENTROID = 128.0'),'mass-production outfits must share the scientist visual center');
assert.ok(outfitBake.includes('TARGET_NECKLINE_Y = 89'),'mass-production outfits must share the scientist neckline/shoulder anchor');
assert.ok(outfitBake.includes('FIXED_DECORATION_TOP_Y = 58'),'vertical normalization must preserve the shared decoration top');
assert.ok(outfitBake.includes('def body_center_x'),'mass-production bake must measure the shared torso window');
assert.ok(outfitBake.includes('def anatomical_top_y'),'mass-production bake must measure collar and both shoulders');
assert.ok(outfitBake.includes('Never split or non-uniformly warp a finished outfit'),'mass-production bake must preserve authored artwork without seam-producing warps');
assert.ok(outfitBake.includes('def normalize_uniform_body_scale'),'production bake must use one seam-free uniform template fit');
assert.ok(!outfitBake.includes("img.crop((0, source_y"),'production bake must not split completed outfit artwork at the neckline');
assert.ok(outfitBake.includes('SOURCE_OUTFIT_DIR'),'production bake must always rebuild from immutable source art');
assert.ok(outfitBake.includes('step = round(TARGET_BODY_CENTROID - current_x)'),'mass-production bake must normalize X automatically');
for(const itemSpecific of ['SOURCE_X_ADJUST','NECKLINE_RAISE'])assert.ok(!outfitBake.includes(itemSpecific),`item-specific correction must not remain: ${itemSpecific}`);
assert.ok(!fs.existsSync(path.join(root,'server/avatar-shop-pack-v5.js')),'temporary v5 catalog must be removed');
assert.ok(!catalog.includes('avatarShopPackV4')&&!catalog.includes('avatarShopPackV5'),'production catalog must not merge temporary packs');
assert.ok(studentShop.includes("item.slot==='character'"),'student shop must retain future base-character product support');
assert.ok(shop.includes("SELECT level,stars,base_character"),'shop state must expose the equipped male/female base');
assert.ok(shop.includes('baseCharacter'),'shop state must return the equipped base character');
assert.ok(studentShop.includes('paintProductPreview(b,item,data.baseCharacter)'),'outfit previews must use the student\'s equipped male/female head');
assert.ok(studentShop.includes("renderer.BASES?.[baseCharacter]?baseCharacter:'student-boy'"),'shop preview must safely normalize its base character');
assert.ok(index.includes('student-shop.js?v=20260901r7'),'female outfit preview change must bypass classroom cache');
assert.ok(customize.includes("info.slot==='character'"),'wardrobe must retain future base-character immediate equip support');
console.log('production avatar lightweight runtime contract passed');
