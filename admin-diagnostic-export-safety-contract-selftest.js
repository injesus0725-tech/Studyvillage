const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-errors.js','utf8');

assert.ok(src.includes('exporting=false'),'진단 파일 중복 실행 상태가 필요합니다.');
assert.ok(src.includes('if(exporting)return'),'진단 파일 내보내기 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('exporting=true;exportBtn.disabled=true'),'내보내기 시작 시 상태와 버튼을 잠가야 합니다.');
assert.ok(src.includes("exportBtn.textContent='진단 파일 만드는 중…'"),'진단 파일 생성 중임을 교사에게 보여줘야 합니다.');
assert.ok(src.includes("finally{exporting=false;exportBtn.disabled=false;exportBtn.textContent='🤖 진단 파일 내보내기'}"),'완료 후 내보내기 상태와 버튼을 복구해야 합니다.');

console.log('admin diagnostic export safety contract self-test passed');
