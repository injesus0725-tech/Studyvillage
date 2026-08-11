const fs=require('fs');
const assert=require('assert');

const preservation=fs.readFileSync('question-history-undone-preservation-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-undone-verify-contract-selftest.js','utf8');

assert.ok(
  preservation.includes('server/question-history.js'),
  '문제 수정 이력 되돌림 보존 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-undone-preservation-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 되돌림 보존 검사를 대상으로 해야 합니다.'
);

console.log('question history undone contract pair self-test passed');
