import fs from 'node:fs';
import assert from 'node:assert/strict';

const server=fs.readFileSync(new URL('./server/item-shop.js',import.meta.url),'utf8');
const admin=fs.readFileSync(new URL('./admin-shop.js',import.meta.url),'utf8');
const student=fs.readFileSync(new URL('./student-shop.js',import.meta.url),'utf8');

assert.match(server,/AVAILABILITY_KEY='shop:availability:v1'/,'아이템 판매 상태를 별도 설정으로 보존해야 합니다.');
assert.match(server,/typeof availability\[id\]!=='boolean'/,'판매 상태는 boolean만 허용해야 합니다.');
assert.match(server,/code:'item-unavailable'/,'판매 중지 아이템 구매를 서버에서 거절해야 합니다.');
assert.ok(server.indexOf("code:'item-unavailable'")<server.indexOf("SELECT stars,owned_items_json FROM players"),'잔액·소유권 처리 전에 판매 중지를 검사해야 합니다.');
assert.doesNotMatch(server.slice(server.indexOf('export function saveOwnedEquipment'),server.indexOf('export function grantItemByTeacher')),/readAvailability|item-unavailable/,'판매 중지 아이템도 기존 소유자는 계속 장착할 수 있어야 합니다.');
assert.match(server,/availability:req\.body\?\.availability/,'관리자 API가 판매 상태를 전달해야 합니다.');
assert.match(admin,/data-shop-available/,'관리자 화면에 아이템별 판매 토글이 있어야 합니다.');
assert.match(admin,/JSON\.stringify\(\{enabled:toggle\.checked,prices,availability(?:,levelRequirements)?\}\)/,'관리자 저장 요청에 판매 상태가 포함돼야 합니다.');
assert.match(student,/available=item\.available!==false/,'학생 화면이 이전 데이터와 호환되며 판매 상태를 읽어야 합니다.');
assert.match(student,/판매 중지/,'학생에게 판매 중지 상태를 알려야 합니다.');

console.log('shop item availability contract self-test passed');
