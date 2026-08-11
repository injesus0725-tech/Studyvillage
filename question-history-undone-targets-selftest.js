const fs=require('fs');
const assert=require('assert');

for(const file of [
  'question-history-undone-preservation-contract-selftest.js',
  'question-history-undone-verify-contract-selftest.js',
  'question-history-undone-contract-pair-selftest.js',
  'question-history-undone-pair-verify-contract-selftest.js'
]){
  assert.ok(fs.existsSync(file),`${file} 파일이 필요합니다.`);
}

console.log('question history undone targets self-test passed');
