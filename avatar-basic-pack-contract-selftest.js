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

for(const phrase of ['기본 캐릭터 → 머리 → 한벌 의상 → 효과 → 펫','체육관 / 보건실 / 3-1반 교실 / 급식실','마을 전체 그래픽 리디자인'])assert.ok(direction.includes(phrase),`production direction missing: ${phrase}`);
for(const slot of ['hair','outfit','effect','pet'])assert.ok(direction.includes(slot==='hair'?'머리':slot==='outfit'?'한벌 의상':slot==='effect'?'효과':'펫'),`direction missing ${slot}`);
for(const legacy of ['bottom','shoes','bag','hand','character'])assert.ok(shop.includes(`'${legacy}'`),`legacy slot must be explicitly retired: ${legacy}`);
assert.ok(shop.includes("ACTIVE_ITEM_IDS=Object.freeze([...Object.keys(avatarShopPackV3),'candy','stationery'])"),'only production avatar items may be active');
assert.ok(shop.includes("const out={hair:null,outfit:null,effect:null,pet:null}"),'equipment storage must expose exactly four avatar slots');
assert.ok(customize.includes("slots.splice(4)"),'wardrobe must expose exactly four avatar categories');
assert.ok(studentShop.includes('[data-shop-slot="character"]')&&studentShop.includes('[data-shop-slot="bottom"]'),'shop must remove completed characters and legacy category buttons');
assert.ok(!whole.includes('character-boy-02')&&!whole.includes('character-girl-02'),'purchasable completed characters must be gone');
assert.ok(whole.includes("id:'student-boy'")&&whole.includes("id:'student-girl'"),'only the two basic bodies must remain');
const expected=[
  'production/outfits/silver-knight.png','production/outfits/star-mage.png','production/outfits/school-scientist.png',
  'production/outfits/forest-archer.png','production/outfits/pirate-captain.png','production/outfits/moon-priest.png',
  'production/pets/maltese.png','production/pets/toy-poodle.png','production/pets/corgi.png',
  'production/pets/cheese-cat.png','production/pets/lop-rabbit.png','production/pets/baby-dragon.png'
];
for(const rel of expected){const full=path.join(root,'assets/avatar-runtime',rel);assert.ok(fs.existsSync(full),`missing production raster: ${rel}`);assert.ok(fs.statSync(full).size>3000,`production raster is unexpectedly small: ${rel}`);assert.ok(renderer.includes(rel),`renderer missing production raster: ${rel}`)}
for(const gender of ['boy','girl'])for(let n=2;n<=10;n++){const id=`character-${gender}-${String(n).padStart(2,'0')}`;assert.ok(!fs.existsSync(path.join(root,'assets/avatar-runtime',id+'.png')),`retired completed character remains: ${id}`)}
assert.ok(!fs.existsSync(path.join(root,'server/avatar-shop-pack-v5.js')),'temporary v5 catalog must be removed');
assert.ok(!catalog.includes('avatarShopPackV4')&&!catalog.includes('avatarShopPackV5'),'production catalog must not merge temporary packs');
console.log('four-slot production avatar contract passed');
