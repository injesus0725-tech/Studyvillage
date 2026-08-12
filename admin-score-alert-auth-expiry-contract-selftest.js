const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-score-alerts.js','utf8');

assert.ok(src.includes("if(!t){panel.hidden=true;return}"),'관리자 토큰이 없으면 점수/XP 경고 패널을 숨겨야 합니다.');
assert.ok(src.includes("if(r.status===401){panel.hidden=true;return}"),'관리자 인증이 만료되면 오래된 점수/XP 경고 패널을 숨겨야 합니다.');
assert.ok(src.includes("finally{loading=false}"),'점수/XP 경고 조회 종료 후 로딩 잠금을 해제해야 합니다.');

console.log('admin score alert auth expiry contract self-test passed');
