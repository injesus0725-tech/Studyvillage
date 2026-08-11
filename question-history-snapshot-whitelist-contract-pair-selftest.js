const fs=require('fs');
const assert=require('assert');

const whitelist=fs.readFileSync('question-history-snapshot-whitelist-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-snapshot-whitelist-verify-contract-selftest.js','utf8');

assert.ok(
  whitelist.includes('server/question-history.js'),
  '문제 수정 이력 스냅샷 허용 필드 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-snapshot-whitelist-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 스냅샷 허용 필드 검사를 대상으로 해야 합니다.'
);

console.log('question history snapshot whitelist contract pair self-test passed');
