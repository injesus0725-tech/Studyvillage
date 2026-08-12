const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-presence.js','utf8');

assert.ok(src.includes("if(r.status===401){count.textContent='확인 필요'"),'관리자 인증 만료 시 이전 접속 인원 표시를 그대로 두면 안 됩니다.');
assert.ok(src.includes("updated.textContent='관리자 로그인 필요'"),'관리자 인증 만료 상태를 마지막 확인 영역에 알려야 합니다.');
assert.ok(src.includes("list.innerHTML='<p class=\"empty\">관리자 로그인이 필요합니다.</p>'"),'관리자 인증 만료 시 이전 학생 접속 목록을 지워야 합니다.');
assert.ok(src.includes('finally{clearTimeout(timeout);loading=false'),'인증 만료 후에도 요청 타이머와 조회 잠금을 정리해야 합니다.');

console.log('admin presence auth expiry contract self-test passed');
