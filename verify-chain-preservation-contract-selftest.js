const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg&&pkg.scripts&&pkg.scripts.verify||'');

assert.ok(verify,'package.json에 verify 스크립트가 필요합니다.');

for(const required of [
  'node server/restore-request-handler-selftest.js',
  'node classroom-network-guidance-contract-selftest.js',
  'node admin-student-destructive-actions-contract-selftest.js',
  'node admin-student-delete-contract-selftest.js'
]){
  assert.ok(verify.includes(required),`verify 누락: ${required}`);
}

console.log('full verification chain contract self-test passed');
