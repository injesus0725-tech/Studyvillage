const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg&&pkg.scripts&&pkg.scripts.verify||'');

assert.ok(verify,'package.json에 verify 스크립트가 필요합니다.');
assert.ok(
  verify.includes('node question-history-undone-preservation-contract-selftest.js'),
  'verify에서 문제 수정 이력 되돌림 보존 계약검사를 실행해야 합니다.'
);

console.log('question history undone verify contract self-test passed');
