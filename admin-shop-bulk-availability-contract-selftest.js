const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-shop.js','utf8');

assert.ok(src.includes('data-shop-bulk="on"'), '현재 종류 모두 판매 버튼이 있어야 합니다.');
assert.ok(src.includes('data-shop-bulk="off"'), '현재 종류 모두 중지 버튼이 있어야 합니다.');
assert.ok(src.includes("setVisibleAvailability(button.dataset.shopBulk==='on')"), '일괄 버튼 값을 판매 체크 상태로 전달해야 합니다.');
const bulk=src.match(/function setVisibleAvailability\(value\)\{([\s\S]*?)\}\n  function setSaving/);
assert.ok(bulk, '현재 필터 판매 상태 일괄 변경 함수가 있어야 합니다.');
assert.ok(bulk[1].includes('if(card.hidden)continue'), '현재 필터에서 숨겨진 종류는 변경하지 않아야 합니다.');
assert.ok(bulk[1].includes("card.querySelector('[data-shop-available]')"), '판매 여부 체크만 변경해야 합니다.');
assert.ok(bulk[1].includes('input.checked=value'), '보이는 아이템의 판매 여부를 일괄 적용해야 합니다.');
assert.ok(bulk[1].includes('if(changed)setDirty()'), '일괄 변경은 미저장 상태로 남아야 합니다.');
assert.ok(!bulk[1].includes('fetch(')&&!bulk[1].includes('timedFetch('), '일괄 버튼만으로 서버에 즉시 저장하면 안 됩니다.');
assert.ok(src.includes("panel.querySelectorAll('[data-shop-bulk]'))button.disabled=value"), '저장 중에는 일괄 버튼도 잠가야 합니다.');
assert.ok(src.includes("if(!confirm(`${toggle.checked?'상점을 켜고'"), '기존 최종 저장 확인 절차를 유지해야 합니다.');
console.log('admin shop bulk availability contract self-test passed');
