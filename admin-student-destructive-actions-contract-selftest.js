const fs=require('fs');
const assert=require('assert');

const admin=fs.readFileSync('admin.js','utf8');

assert.ok(
  admin.includes("if(action==='record'&&!confirm("),
  '성장 초기화는 교사 확인창을 거쳐야 합니다.'
);
assert.ok(
  admin.includes("if(action==='delete'&&!confirm("),
  '학생 계정 삭제는 교사 확인창을 거쳐야 합니다.'
);
assert.ok(
  admin.includes('pendingStudentActions'),
  '학생 계정 변경의 중복 실행 방지 장치가 필요합니다.'
);
assert.ok(
  admin.includes('pendingStudentActions.has(actionKey)'),
  '동일 학생·동일 작업의 중복 요청을 막아야 합니다.'
);
assert.ok(
  admin.includes('pendingStudentActions.delete(actionKey)'),
  '학생 계정 변경 작업 후 잠금 상태를 해제해야 합니다.'
);

console.log('admin destructive student actions contract self-test passed');
