const fs=require('fs'),assert=require('assert');
const shop=fs.readFileSync('server/item-shop.js','utf8');
const renderer=fs.readFileSync('avatar-renderer.js','utf8');
const customize=fs.readFileSync('customize.js','utf8');
const studentShop=fs.readFileSync('student-shop.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');
const catalog=fs.readFileSync('server/whole-character-catalog.js','utf8');
assert.ok(shop.includes("AVATAR_RESET_KEY='avatar:whole-character-reset:v1'"),'구매·장착 초기화는 한 번만 실행되어야 합니다.');
assert.ok(shop.includes("owned_items_json='[]',equipment_json='{}'")&&shop.includes('setSetting(db,AVATAR_RESET_KEY'),'기존 테스트 구매 목록과 장착 상태를 초기화해야 합니다.');
assert.ok(!shop.includes('RETIRED_AVATAR_SLOTS'),'교사가 허용한 얼굴·머리·모자·안경 슬롯을 서버가 일괄 판매 중지하지 않아야 합니다.');
assert.ok(renderer.includes("base-boy-v2.png")&&renderer.includes("base-girl-v2.png"),'완성형 남녀 캐릭터 본체를 사용해야 합니다.');
for(const slot of ['hair','outfit','bottom','shoes','bag','hand','pet'])assert.ok(customize.includes("'"+slot+"'"),`착용 슬롯 누락: ${slot}`);
assert.ok(shop.includes("REMOVED_STYLE_SLOTS=new Set(['face','expression','hat','glasses'])")&&studentShop.includes("[data-shop-slot=\"face\"],[data-shop-slot=\"expression\"],[data-shop-slot=\"hat\"],[data-shop-slot=\"glasses\"]"),'별도 얼굴·표정·모자·안경 상품과 필터를 제거해야 합니다.');
for(const gender of ['boy','girl'])for(let number=2;number<=10;number++){const id=`character-${gender}-${String(number).padStart(2,'0')}`;assert.ok(catalog.includes(`id:'${id}'`),`구매형 완성 캐릭터 누락: ${id}`);assert.ok(renderer.includes(`${id}.png`),`완성 캐릭터 이미지 연결 누락: ${id}`);assert.ok(fs.existsSync(`assets/avatar-runtime/${id}.png`),`배포 캐릭터 이미지 누락: ${id}`)}
assert.ok(server.includes('availableBaseCharacters(r)')&&server.includes('owned.has(character.id)'),'구매한 완성형 캐릭터만 옷장에 보여야 합니다.');
assert.ok(customize.includes("info.slot==='character'")&&customize.includes('draftBase=itemId'),'구매 직후 완성형 캐릭터를 장착할 수 있어야 합니다.');
assert.ok(studentShop.includes('data-shop-slot="character"')&&studentShop.includes("item.slot==='character'"),'상점에 완성형 캐릭터 분류와 미리보기가 있어야 합니다.');
console.log('whole-character avatar migration contract self-test passed');
