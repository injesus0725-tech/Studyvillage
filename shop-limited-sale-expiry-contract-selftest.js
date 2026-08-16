const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/item-shop.js','utf8');
const admin=fs.readFileSync('admin-shop.js','utf8');
const student=fs.readFileSync('student-shop.js','utf8');

assert.ok(server.includes("SALE_ENDS_KEY='shop:sale-ends:v1'"),'판매 종료 시각을 별도 설정으로 저장해야 합니다.');
assert.ok(server.includes('function normalizeSaleEnd(value)'),'판매 종료 시각을 서버에서 정규화해야 합니다.');
assert.ok(server.includes("code:'invalid-sale-end'"),'잘못된 종료 시각은 저장하지 않아야 합니다.');
assert.ok(server.includes("code:'sale-ended'"),'종료된 한정 아이템 구매를 서버에서 거절해야 합니다.');
const purchase=server.slice(server.indexOf('export function purchaseItem'),server.indexOf('export function saveOwnedEquipment'));
assert.ok(purchase.indexOf("code:'sale-ended'")<purchase.indexOf("SELECT level,stars,owned_items_json"),'잔액 조회·차감 전에 판매 종료를 검사해야 합니다.');
assert.ok(server.includes('limited[id]&&saleEnds[id]'),'한정 표시가 켜진 아이템에만 자동 종료를 적용해야 합니다.');
assert.ok(admin.includes('type="datetime-local"'),'교사가 로컬 시각으로 종료 시간을 입력할 수 있어야 합니다.');
assert.ok(admin.includes('date.toISOString()'),'관리자 입력을 시간대 안전한 ISO 시각으로 저장해야 합니다.');
assert.ok(student.includes("saleEnded=item.saleEnded===true"),'학생 화면이 서버의 종료 판정을 사용해야 합니다.');
assert.ok(student.includes("saleEnded?'판매 종료'"),'학생에게 판매 종료 상태를 표시해야 합니다.');
assert.ok(student.includes("d.code==='sale-ended'"),'구매 중 종료된 경우도 안내해야 합니다.');
console.log('shop limited sale expiry contract self-test passed');
