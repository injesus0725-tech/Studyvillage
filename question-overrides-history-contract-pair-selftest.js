const fs=require('fs');
const assert=require('assert');

const safety=fs.readFileSync('question-overrides-history-safety-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-overrides-history-verify-contract-selftest.js','utf8');

assert.ok(
  safety.includes("server/question-overrides.js"),
  '문제 수정 이력 안전검사는 server/question-overrides.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-overrides-history-safety-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 안전검사를 대상으로 해야 합니다.'
);

console.log('question override history contract pair self-test passed');
