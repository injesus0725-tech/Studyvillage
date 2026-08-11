const fs=require('fs');
const assert=require('assert');

for(const file of [
  'question-history-read-order-preservation-contract-selftest.js',
  'question-history-read-order-preservation-verify-contract-selftest.js',
  'question-history-read-order-preservation-contract-pair-selftest.js',
  'question-history-read-order-preservation-pair-verify-contract-selftest.js'
]){
  assert.ok(fs.existsSync(file),`${file} 파일이 필요합니다.`);
}

console.log('question history read order preservation targets self-test passed');
