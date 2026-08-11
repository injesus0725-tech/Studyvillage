const fs=require('fs');
const assert=require('assert');

const orderGuard=fs.readFileSync('question-history-read-order-preservation-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-read-order-preservation-verify-contract-selftest.js','utf8');

assert.ok(
  orderGuard.includes('server/question-history.js'),
  '문제 수정 이력 조회 순서 보존 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-read-order-preservation-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 조회 순서 보존 검사를 대상으로 해야 합니다.'
);

console.log('question history read order preservation contract pair self-test passed');
