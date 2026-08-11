const fs=require('fs');
const assert=require('assert');

for(const file of [
  'question-history-mark-undone-field-preservation-contract-selftest.js',
  'question-history-mark-undone-field-preservation-verify-contract-selftest.js',
  'question-history-mark-undone-field-preservation-contract-pair-selftest.js',
  'question-history-mark-undone-field-preservation-pair-verify-contract-selftest.js'
]){
  assert.ok(fs.existsSync(file),`되돌림 필드 보존 안전검사 파일이 필요합니다: ${file}`);
}

console.log('question history mark undone field preservation targets self-test passed');
