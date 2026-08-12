const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-question-review.js','utf8');

assert.ok(src.includes('reviewsLoading=null'),'문제 검토 목록의 진행 중 읽기 상태를 추적해야 합니다.');
assert.ok(src.includes('if(reviewsLoading)return reviewsLoading'),'문제 검토 목록 읽기가 겹치면 기존 요청을 재사용해야 합니다.');
assert.ok(src.includes('reviewsLoading=(async()=>'),'문제 검토 목록 읽기 Promise를 저장해야 합니다.');
assert.ok(src.includes('finally{reviewsLoading=null}'),'문제 검토 목록 읽기 종료 후 잠금을 해제해야 합니다.');

console.log('admin question review load safety contract self-test passed');
