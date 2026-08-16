const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/item-shop.js','utf8');
const admin=fs.readFileSync('admin-shop.js','utf8');
const student=fs.readFileSync('student-shop.js','utf8');

assert.ok(server.includes("SALE_STARTS_KEY='shop:sale-starts:v1'"),'판매 시작 시각을 별도 저장해야 합니다.');
assert.ok(server.includes("code:'invalid-sale-start'"),'잘못된 시작 시각은 거절해야 합니다.');
assert.ok(server.includes("code:'invalid-sale-window'"),'시작이 종료보다 늦은 판매 기간은 거절해야 합니다.');
assert.ok(server.includes("code:'sale-pending'"),'판매 시작 전 구매를 서버에서 거절해야 합니다.');
assert.ok(server.includes('salePending:!!(limited[id]&&saleStarts[id]'),'학생에게 서버의 판매 예정 판정을 전달해야 합니다.');
assert.ok(admin.includes('data-shop-sale-start'),'관리자 화면에 판매 시작 입력이 있어야 합니다.');
assert.ok(admin.includes('limited,saleStarts,saleEnds'),'관리자 저장 요청에 시작·종료 시각이 포함돼야 합니다.');
assert.ok(student.includes("salePending=item.salePending===true"),'학생 화면이 판매 예정 상태를 사용해야 합니다.');
assert.ok(student.includes('판매 예정 · ${esc(startLabel)}'),'학생에게 시작 시각을 표시해야 합니다.');
assert.ok(student.includes("d.code==='sale-pending'"),'구매 도중 시작 전 판정도 안내해야 합니다.');
console.log('shop limited sale start contract self-test passed');
