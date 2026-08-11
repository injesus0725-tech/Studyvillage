const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg&&pkg.scripts&&pkg.scripts.verify||'');

assert.ok(verify,'package.json에 verify 스크립트가 필요합니다.');
assert.ok(
  verify.includes('node question-history-corrupt-storage-contract-selftest.js'),
  'verify에서 손상된 문제 수정 이력 저장값 안전검사를 실행해야 합니다.'
);

console.log('question history corrupt storage verify contract self-test passed');
