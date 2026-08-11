const fs=require('fs');
const assert=require('assert');

const fallback=fs.readFileSync('question-history-corrupt-storage-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-corrupt-storage-verify-contract-selftest.js','utf8');

assert.ok(
  fallback.includes('server/question-history.js'),
  '손상된 문제 수정 이력 안전검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-corrupt-storage-contract-selftest.js'),
  'verify 누락 감지 검사는 손상된 문제 수정 이력 안전검사를 대상으로 해야 합니다.'
);

console.log('question history corrupt storage contract pair self-test passed');
