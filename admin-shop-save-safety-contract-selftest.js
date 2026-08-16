const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-shop.js','utf8');
assert.ok(src.includes('saving=false'),'상점 저장 중복 방지 상태가 필요합니다.');
assert.ok(src.includes('if(saving)return'),'저장 중 추가 저장 요청을 무시해야 합니다.');
assert.ok(src.includes('saveButton.disabled=value'),'저장 중 버튼을 잠가야 합니다.');
assert.ok(src.includes('finally{setSaving(false)}'),'성공/실패 후 저장 버튼을 다시 풀어야 합니다.');
assert.ok(src.includes("if(!confirm(`${toggle.checked?'상점을 켜고':'상점을 끄고'}")&&src.includes('판매하도록 저장할까요?'),'상점 설정 저장 전 최종 확인을 유지해야 합니다.');

const studentRoutes=fs.readFileSync('server/star-ledger.js','utf8');
const adminRoutes=fs.readFileSync('server/question-review.js','utf8');
assert.ok(studentRoutes.includes("import { installItemShopRoutes } from './item-shop.js';"),'학생 상점 라우트 연결 import가 필요합니다.');
assert.ok(studentRoutes.includes('installItemShopRoutes(app,{requireSession,requireAdmin,publishLiveEvent});'),'학생 상점 라우트는 학생 세션 인증과 제한된 축하 알림 발행기를 포함해 연결되어야 합니다.');
assert.ok(adminRoutes.includes("import { installItemShopRoutes } from './item-shop.js';"),'교사 상점 라우트 연결 import가 필요합니다.');
assert.ok(adminRoutes.includes('installItemShopRoutes(app,{requireAdmin});'),'교사 상점 라우트는 관리자 인증으로 연결되어야 합니다.');

console.log('admin shop save safety contract self-test passed');
