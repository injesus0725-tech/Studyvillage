const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=pkg.scripts&&pkg.scripts.verify||'';

assert.ok(verify.includes('node student-record-request-bounds-contract-selftest.js'),'verify에서 학생 기록 요청 범위 안전 검사를 실행해야 합니다.');

console.log('student record request bounds verify contract self-test passed');
