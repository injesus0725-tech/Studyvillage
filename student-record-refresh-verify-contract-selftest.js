const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=pkg.scripts&&pkg.scripts.verify||'';

assert.ok(verify.includes('node --check activity-records.js'),'verify에서 학생 기록 스크립트 문법을 검사해야 합니다.');
assert.ok(verify.includes('node student-record-refresh-safety-contract-selftest.js'),'verify에서 학생 기록 새로고침 안전 검사를 실행해야 합니다.');

console.log('student record refresh verify contract self-test passed');
