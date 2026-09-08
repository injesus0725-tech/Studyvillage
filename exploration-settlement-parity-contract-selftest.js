const assert=require('node:assert/strict');
const fs=require('node:fs');

const client=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const activity=fs.readFileSync('server/activity-attempt-student.js','utf8');
const ledger=fs.readFileSync('server/star-ledger.js','utf8');
const quickNav=fs.readFileSync('assets/admin-quick-navigation.js','utf8');
const shop=fs.readFileSync('server/item-shop.js','utf8');

assert.match(client,/trait:'정답 시 별 \+3개'/,'천사 안내는 실제 정산 규칙과 같아야 합니다.');
assert.match(client,/foxCount\+\+/,'여우가 약속한 별은 이후 다른 NPC를 만나도 누적되어야 합니다.');
assert.match(client,/angelCorrect,foxCount/,'천사와 여우 보상 기록을 서버 정산에 함께 보내야 합니다.');
assert.match(activity,/findBonusStars=Math\.min\(5,findCount,requestedStars\)/,'화면에 예약된 별 주머니를 탐험 전체에서 한 개로 잘라서는 안 됩니다.');
assert.match(activity,/npcStars=\(angelCorrect\?3:0\)\+foxCount/,'천사 정답과 여우 별을 최종 XP NPC와 독립적으로 정산해야 합니다.');
assert.match(ledger,/stars=Math\.max\(-before,baseStars\+npcDelta\)/,'기본 별과 탐험 중 증감을 합산한 값이 최종 지급량이어야 합니다.');
assert.match(quickNav,/\['전달 요청',\(\)=>document\.querySelector\('#shop-delivery-list'\)\]/,'관리자 빠른 메뉴에 전달 요청 바로가기가 있어야 합니다.');
assert.match(shop,/WHERE status='pending' ORDER BY id DESC LIMIT/,'관리자 전달 목록에는 처리 대기 요청만 남아야 합니다.');

console.log('exploration settlement parity contract selftest passed');
