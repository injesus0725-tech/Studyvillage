const fs=require('fs');
const assert=require('assert');

const storage=fs.readFileSync('question-history-storage-safety-contract-selftest.js','utf8');
const bounds=fs.readFileSync('question-history-input-bounds-contract-selftest.js','utf8');

assert.ok(
  storage.includes("server/question-history.js"),
  '문제 수정 이력 저장 안전검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  bounds.includes("server/question-history.js"),
  '문제 수정 이력 입력 제한 검사는 server/question-history.js를 대상으로 해야 합니다.'
);

console.log('question history safety contract pair self-test passed');
