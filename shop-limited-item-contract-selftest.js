const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/item-shop.js','utf8');
const admin=fs.readFileSync('admin-shop.js','utf8');
const student=fs.readFileSync('student-shop.js','utf8');

assert.ok(server.includes("LIMITED_KEY='shop:limited:v1'"),'한정 아이템 설정을 별도로 저장해야 합니다.');
assert.ok(server.includes("map(id=>[id,false])"),'기존 아이템의 한정 기본값은 꺼짐이어야 합니다.');
assert.ok(server.includes("code:'invalid-limited'"),'한정 설정은 boolean만 허용해야 합니다.');
assert.ok(server.includes('limited:limited[id]'),'학생과 관리자에게 아이템별 한정 상태를 전달해야 합니다.');
assert.ok(server.includes('limited:req.body?.limited'),'관리자 API가 한정 설정을 전달해야 합니다.');
assert.ok(admin.includes('data-shop-limited'),'관리자 화면에 한정 아이템 토글이 있어야 합니다.');
assert.ok(admin.includes('levelRequirements,limited'),'관리자 저장 요청에 한정 상태가 포함돼야 합니다.');
assert.ok(student.includes('item.limited?`<em')&&student.includes('>한정</em>`'),'학생 상점에 한정 배지를 표시해야 합니다.');
assert.ok(server.includes("readLimited(db)[id]&&saleEnd"),'한정 표시는 종료 시각이 함께 있을 때만 구매 종료에 사용해야 합니다.');
console.log('shop limited item contract self-test passed');
