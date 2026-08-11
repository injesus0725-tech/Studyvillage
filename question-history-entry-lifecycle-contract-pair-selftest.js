const fs=require('fs');
const assert=require('assert');

const lifecycleGuard=fs.readFileSync('question-history-entry-lifecycle-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-entry-lifecycle-verify-contract-selftest.js','utf8');

assert.ok(
  lifecycleGuard.includes('server/question-history.js'),
  '문제 수정 이력 항목 생명주기 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-entry-lifecycle-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 항목 생명주기 검사를 대상으로 해야 합니다.'
);

console.log('question history entry lifecycle contract pair self-test passed');
