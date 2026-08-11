const fs=require('fs');
const assert=require('assert');

const auth=fs.readFileSync('question-history-admin-route-auth-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-admin-route-auth-verify-contract-selftest.js','utf8');

assert.ok(
  auth.includes('server/question-history.js'),
  '문제 수정 이력 관리자 인증 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-admin-route-auth-contract-selftest.js'),
  'verify 누락 감지 검사는 문제 수정 이력 관리자 인증 검사를 대상으로 해야 합니다.'
);

console.log('question history admin route auth contract pair self-test passed');
