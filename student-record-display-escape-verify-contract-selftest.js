const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=pkg.scripts&&pkg.scripts.verify||'';

assert.ok(verify.includes('node --check activity-records.js'),'verify에서 학생 기록 스크립트 문법을 검사해야 합니다.');
assert.ok(verify.includes('node student-record-display-escape-contract-selftest.js'),'verify에서 학생 기록 출력 이스케이프 검사를 실행해야 합니다.');

console.log('student record display escape verify contract self-test passed');
