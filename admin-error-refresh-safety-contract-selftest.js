const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-errors.js','utf8');
assert.ok(src.includes('let clearing=false')&&src.includes('loading=false'),'오류 새로고침 중복 실행 상태가 필요합니다.');
assert.ok(src.includes('if(!token()||loading)return'),'오류 조회 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('refresh.disabled=true'),'조회 중에는 새로고침 버튼을 잠가야 합니다.');
assert.ok(src.includes("refresh.textContent='새로고침 중…'"),'조회 중임을 교사에게 보여줘야 합니다.');
assert.ok(src.includes("finally{loading=false;refresh.disabled=false;refresh.textContent='새로고침'}"),'조회 후 새로고침 상태와 버튼을 복구해야 합니다.');

console.log('admin error refresh safety contract self-test passed');
