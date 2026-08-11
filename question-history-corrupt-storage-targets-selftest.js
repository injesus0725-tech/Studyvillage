const fs=require('fs');
const assert=require('assert');

for(const file of [
  'question-history-corrupt-storage-contract-selftest.js',
  'question-history-corrupt-storage-verify-contract-selftest.js',
  'question-history-corrupt-storage-contract-pair-selftest.js',
  'question-history-corrupt-storage-pair-verify-contract-selftest.js'
]){
  assert.ok(fs.existsSync(file),`${file} 파일이 필요합니다.`);
}

console.log('question history corrupt storage targets self-test passed');
