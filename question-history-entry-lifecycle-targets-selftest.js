const fs=require('fs');
const assert=require('assert');

const targets=[
  'question-history-entry-lifecycle-contract-selftest.js',
  'question-history-entry-lifecycle-verify-contract-selftest.js',
  'question-history-entry-lifecycle-contract-pair-selftest.js',
  'question-history-entry-lifecycle-pair-verify-contract-selftest.js'
];

for(const target of targets){
  assert.ok(fs.existsSync(target),`문제 수정 이력 항목 생명주기 필수 검사 파일이 필요합니다: ${target}`);
}

console.log('question history entry lifecycle targets self-test passed');
