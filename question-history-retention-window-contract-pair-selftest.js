const fs=require('fs');
const assert=require('assert');

const retentionGuard=fs.readFileSync('question-history-retention-window-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-retention-window-verify-contract-selftest.js','utf8');

assert.ok(
  retentionGuard.includes('server/question-history.js'),
  '문제 수정 이력 저장 한도 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-retention-window-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 저장 한도 검사를 대상으로 해야 합니다.'
);

console.log('question history retention window contract pair self-test passed');
