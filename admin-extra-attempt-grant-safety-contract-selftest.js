const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-attempt-policy.js','utf8');

assert.ok(
  src.includes("if(!confirm(`${name} 학생에게 ${activityName} 추가 도전 1회를 허용할까요?`))return"),
  '추가 도전권 지급 전 교사 확인이 필요합니다.'
);
assert.ok(src.includes('b.disabled=true'),'추가 도전권 지급 중 버튼을 잠가야 합니다.');
assert.ok(
  src.includes('body:JSON.stringify({amount:1})'),
  '추가 도전권 지급 요청은 1회로 고정되어야 합니다.'
);
assert.ok(src.includes('finally{b.disabled=false}'),'추가 도전권 지급 성공/실패 후 버튼 잠금을 해제해야 합니다.');

console.log('admin extra attempt grant safety contract self-test passed');
