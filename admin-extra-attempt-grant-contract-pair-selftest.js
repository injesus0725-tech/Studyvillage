const fs=require('fs');
const assert=require('assert');

const confirmation='admin-attempt-grant-confirmation-contract-selftest.js';
const safety='admin-extra-attempt-grant-safety-contract-selftest.js';

assert.ok(fs.existsSync(confirmation),'추가 도전권 지급 확인창 계약검사가 필요합니다.');
assert.ok(fs.existsSync(safety),'추가 도전권 지급 안전 계약검사가 필요합니다.');

const confirmationSrc=fs.readFileSync(confirmation,'utf8');
const safetySrc=fs.readFileSync(safety,'utf8');

assert.ok(confirmationSrc.includes('admin-attempt-policy.js'),'확인창 계약검사는 admin-attempt-policy.js를 검사해야 합니다.');
assert.ok(safetySrc.includes('admin-attempt-policy.js'),'안전 계약검사는 admin-attempt-policy.js를 검사해야 합니다.');
assert.ok(safetySrc.includes('body:JSON.stringify({amount:1})'),'안전 계약검사는 추가 도전권 지급량 1회 고정을 확인해야 합니다.');
assert.ok(safetySrc.includes('b.disabled=true')&&safetySrc.includes('finally{b.disabled=false}'),'안전 계약검사는 지급 중 버튼 잠금과 해제를 함께 확인해야 합니다.');

console.log('admin extra attempt grant contract pair self-test passed');
