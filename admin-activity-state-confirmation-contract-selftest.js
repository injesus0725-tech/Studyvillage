const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-activity-state.js','utf8');
assert.ok(src.includes('pending=new Set()'),'활동 상태 변경 중 중복 클릭 방지가 필요합니다.');
assert.ok(src.includes('if(pending.has(id))return'),'같은 활동의 상태 변경 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('문을 닫을까요?'),'활동 닫기에는 교사 확인이 필요합니다.');
assert.ok(src.includes('문을 다시 열까요?'),'활동 다시 열기에도 교사 확인이 필요합니다.');
assert.ok(src.includes('if(!confirm(message))return'),'열기·닫기 변경은 확인 후 실행되어야 합니다.');

console.log('admin activity state confirmation contract self-test passed');