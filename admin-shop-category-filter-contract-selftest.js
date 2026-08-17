const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-shop.js','utf8');
const css=fs.readFileSync('admin.css','utf8');

for(const [slot,label] of [['all','전체'],['hat','모자'],['glasses','안경'],['bag','가방'],['pet','친구'],['effect','효과'],['physical','실물']])assert.ok(src.includes(`data-admin-shop-slot="${slot}"`),`${label} 관리자 상점 필터가 필요합니다.`);
assert.ok(src.includes("row.dataset.shopSlot=String(item.slot||'')"),'각 카드에 서버의 안전한 종류 값을 연결해야 합니다.');
assert.ok(src.includes("card.hidden=activeSlot!=='all'&&card.dataset.shopSlot!==activeSlot"),'선택 종류가 아닌 기존 카드만 숨겨야 합니다.');
assert.ok(src.includes("candidate.setAttribute('aria-pressed',String(candidate===button))"),'현재 필터를 접근성 상태로 표시해야 합니다.');
const renderStart=src.indexOf('function render(data)');
const renderEnd=src.indexOf('async function load()',renderStart);
assert.ok(renderStart>=0&&renderEnd>renderStart,'상점 렌더 함수가 필요합니다.');
const renderBody=src.slice(renderStart,renderEnd);
assert.ok(renderBody.includes('applyFilter()'),'서버에서 다시 불러온 뒤에도 현재 필터를 다시 적용해야 합니다.');
assert.ok(renderBody.indexOf('applyFilter()')>renderBody.indexOf('list.appendChild(row)'),'새 카드들을 만든 뒤 현재 필터를 적용해야 합니다.');
assert.ok(!src.includes('filterBar.addEventListener')||src.indexOf('filterBar.addEventListener')<src.indexOf('function render(data)'),'필터는 렌더 함수를 다시 호출해 미저장 입력을 지우지 않아야 합니다.');
assert.ok(css.includes('.shop-admin-filters'),'관리자 필터 스타일이 필요합니다.');
assert.ok(css.includes('overflow-x:auto'),'좁은 태블릿 화면에서 필터가 잘리지 않아야 합니다.');
console.log('admin shop category filter contract self-test passed');
