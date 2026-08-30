const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('student-shop.js','utf8');
const css=fs.readFileSync('style.css','utf8');

for(const [slot,label] of [['all','전체'],['character','기본 캐릭터'],['outfit','한벌 의상'],['effect','효과'],['pet','펫'],['physical','실물']])assert.ok(src.includes(`data-shop-slot="${slot}"`),`${label} 상점 필터가 필요합니다.`);
for(const retired of ['face','expression','hair','hat','glasses','bottom','shoes','bag','hand'])assert.ok(!src.includes(`data-shop-slot="${retired}"`),`폐기된 ${retired} 상점 필터가 남아 있으면 안 됩니다.`);
assert.ok(src.includes("activeSlot==='all'||item.slot===activeSlot"),'선택한 종류만 표시해야 합니다.');
assert.ok(src.includes("aria-pressed',String(candidate===button)"),'현재 필터를 접근성 상태로 표시해야 합니다.');
assert.ok(src.includes('if(lastData)render(lastData)'),'필터 변경은 서버 재요청 없이 즉시 반영해야 합니다.');
assert.ok(src.includes('filters.hidden=true;list.hidden=true'),'상점이 닫히면 필터도 숨겨야 합니다.');
assert.ok(src.includes('b.disabled=bought||!available||salePending||saleEnded||!levelOk||!affordable||busy'),'필터 후에도 구매 안전 조건을 유지해야 합니다.');
assert.ok(src.includes("item.slot==='character'"),'기본 캐릭터 상품 미리보기가 필요합니다.');
assert.ok(css.includes('.student-shop-filters'),'태블릿용 필터 스타일이 필요합니다.');
assert.ok(css.includes('overflow-x:auto'),'좁은 화면에서 필터가 잘리지 않아야 합니다.');
console.log('student shop production category filter contract self-test passed');
