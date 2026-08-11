const fs=require('fs');
const assert=require('assert');

const fallbackGuard=fs.readFileSync('question-history-corrupt-storage-fallback-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-corrupt-storage-fallback-verify-contract-selftest.js','utf8');

assert.ok(
  fallbackGuard.includes('server/question-history.js'),
  '문제 수정 이력 손상 저장값 폴백 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-corrupt-storage-fallback-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 손상 저장값 폴백 검사를 대상으로 해야 합니다.'
);

console.log('question history corrupt storage fallback contract pair self-test passed');
