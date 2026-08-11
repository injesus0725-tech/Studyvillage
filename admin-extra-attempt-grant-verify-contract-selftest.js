const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg&&pkg.scripts&&pkg.scripts.verify||'');

assert.ok(verify,'package.json에 verify 스크립트가 필요합니다.');
assert.ok(
  verify.includes('node admin-extra-attempt-grant-safety-contract-selftest.js'),
  'verify에서 추가 도전권 지급 안전 계약검사를 실행해야 합니다.'
);

console.log('admin extra attempt grant verify contract self-test passed');
