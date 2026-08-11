const fs=require('fs');
const assert=require('assert');

const required=[
  'question-history-retention-window-contract-selftest.js',
  'question-history-retention-window-verify-contract-selftest.js',
  'question-history-retention-window-contract-pair-selftest.js',
  'question-history-retention-window-pair-verify-contract-selftest.js'
];

for(const file of required){
  assert.ok(fs.existsSync(file),`필수 문제 수정 이력 저장 한도 검사 파일이 필요합니다: ${file}`);
}

console.log('question history retention window targets self-test passed');
