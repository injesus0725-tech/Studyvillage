const fs=require('fs');
const assert=require('assert');

const preservationGuard=fs.readFileSync('question-history-mark-undone-field-preservation-contract-selftest.js','utf8');
const verifyGuard=fs.readFileSync('question-history-mark-undone-field-preservation-verify-contract-selftest.js','utf8');

assert.ok(
  preservationGuard.includes('server/question-history.js'),
  '되돌림 필드 보존 검사는 server/question-history.js를 대상으로 해야 합니다.'
);
assert.ok(
  verifyGuard.includes('question-history-mark-undone-field-preservation-contract-selftest.js'),
  'verify 누락 감지 검사는 되돌림 필드 보존 검사를 대상으로 해야 합니다.'
);

console.log('question history mark undone field preservation contract pair self-test passed');
