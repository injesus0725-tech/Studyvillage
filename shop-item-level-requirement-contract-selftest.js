const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/item-shop.js','utf8');
const admin=fs.readFileSync('admin-shop.js','utf8');
const student=fs.readFileSync('student-shop.js','utf8');

assert.ok(server.includes("LEVEL_REQUIREMENTS_KEY='shop:level-requirements:v1'"),'레벨 조건을 설정에 저장해야 합니다.');
assert.ok(server.includes("code:'invalid-required-level'"),'필요 레벨 입력 범위를 서버에서 검사해야 합니다.');
assert.ok(server.includes("code:'level-required'"),'조건 미달 구매를 서버에서 거절해야 합니다.');
assert.ok(server.indexOf("code:'level-required'")<server.indexOf('const price=readPrices(db)[id]'),'별 차감 전에 레벨을 검사해야 합니다.');
assert.ok(server.includes('currentLevel:Number(player.level)||1'),'학생 화면에 현재 레벨을 전달해야 합니다.');
assert.ok(server.includes('levelRequirements:req.body?.levelRequirements'),'관리자 API가 레벨 조건을 전달해야 합니다.');
assert.ok(!server.slice(server.indexOf('export function saveOwnedEquipment'),server.indexOf('export function grantItemByTeacher')).includes('level-required'),'기존 보유 아이템 장착은 레벨 조건으로 막지 않아야 합니다.');
assert.ok(admin.includes('data-shop-level'),'관리자 화면에 아이템별 필요 레벨 입력이 있어야 합니다.');
assert.ok(admin.includes('prices,availability,levelRequirements'),'관리자 저장 요청에 레벨 조건을 포함해야 합니다.');
assert.ok(student.includes('levelOk'),'학생 화면에서 구매 가능 레벨을 표시·차단해야 합니다.');
assert.ok(student.includes('Lv.${requiredLevel}부터 구매'),'조건 미달 이유를 학생에게 보여야 합니다.');
console.log('shop item level requirement contract self-test passed');
