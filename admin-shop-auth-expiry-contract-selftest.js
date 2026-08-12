const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-shop.js','utf8');

assert.ok(src.includes("if(r.status===401){status.textContent='관리자 로그인이 필요합니다.';return}"),'상점 설정 조회가 401이면 관리자 로그인 필요 상태를 표시해야 합니다.');
assert.ok(src.includes("finally{loading=false}"),'상점 설정 조회 종료 후 로딩 잠금을 해제해야 합니다.');

console.log('admin shop auth expiry contract self-test passed');
