const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-attempt-policy.js','utf8');

assert.ok(src.includes("confirm(`${name} 학생에게 ${activityName} 추가 도전 1회를 허용할까요?`)"),'추가 도전권 지급 전 학생과 활동을 확인해야 합니다.');
assert.ok(src.includes("if(!confirm("),'확인 취소 시 추가 도전권을 지급하면 안 됩니다.');
assert.ok(src.includes('b.disabled=true'),'지급 요청 중에는 같은 버튼을 다시 누르지 못해야 합니다.');
assert.ok(src.includes('finally{b.disabled=false}'),'지급 요청이 끝나면 버튼이 다시 활성화되어야 합니다.');

console.log('admin attempt grant confirmation contract self-test passed');
