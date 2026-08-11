const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg&&pkg.scripts&&pkg.scripts.verify||'');

assert.ok(verify,'package.json에 verify 스크립트가 필요합니다.');
assert.ok(
  verify.includes('node admin-shop-save-safety-contract-selftest.js'),
  'verify에서 교사 상점 저장 안전 계약검사를 실행해야 합니다.'
);

console.log('admin shop save verify contract self-test passed');
