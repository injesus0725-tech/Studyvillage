const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-stars.js','utf8');
assert.ok((src.match(/r\.status===401/g)||[]).length>=3,'학생 목록·별 이력·별 조정 모두 관리자 세션 만료를 처리해야 합니다.');
assert.ok(src.includes("status.textContent='관리자 로그인이 필요합니다.'"),'별 관리 화면에 관리자 재로그인 안내가 필요합니다.');
assert.ok(src.includes("alert('관리자 로그인이 만료되었습니다. 다시 로그인해 주세요.')"),'별 지급/차감 중 세션 만료를 명확히 안내해야 합니다.');
assert.ok(src.includes('finally{setAdjusting(false)}'),'세션 만료 뒤에도 별 조정 버튼 잠금이 풀려야 합니다.');
console.log('admin stars auth expiry contract self-test passed');
