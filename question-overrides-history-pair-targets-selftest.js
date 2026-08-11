const fs=require('fs');
const assert=require('assert');

for(const file of [
  'question-overrides-history-safety-contract-selftest.js',
  'question-overrides-history-verify-contract-selftest.js',
  'question-overrides-history-contract-pair-selftest.js',
  'question-overrides-history-pair-verify-contract-selftest.js'
]){
  assert.ok(fs.existsSync(file),`${file} 파일이 필요합니다.`);
}

console.log('question override history pair targets self-test passed');
