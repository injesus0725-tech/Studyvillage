const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-question-review.js','utf8');

assert.ok(src.includes('const savingReviews=new Set()'),'문제 검토 저장 중 상태를 추적해야 합니다.');
assert.ok(src.includes('if(savingReviews.has(key))return'),'같은 문제의 검토 상태 저장이 겹치면 안 됩니다.');
assert.ok(src.includes('savingReviews.add(key)'),'저장 시작 시 문제별 잠금을 설정해야 합니다.');
assert.ok(src.includes("card.querySelectorAll('button[data-review-key]')"),'같은 문제의 검토 상태 버튼들을 함께 잠가야 합니다.');
assert.ok(src.includes('savingReviews.delete(key)'),'저장 종료 후 문제별 잠금을 해제해야 합니다.');
assert.ok(src.includes('buttons.forEach(x=>x.disabled=false)'),'성공·실패 후 버튼을 다시 사용할 수 있어야 합니다.');
assert.ok(src.includes('reviewsLoading=null'),'문제 검토 목록의 진행 중 요청을 추적해야 합니다.');
assert.ok(src.includes('if(reviewsLoading)return reviewsLoading'),'문제 검토 목록 조회가 겹치면 기존 요청을 재사용해야 합니다.');
assert.ok(src.includes('historyLoading=false'),'수정 이력 조회 중 상태를 추적해야 합니다.');
assert.ok(src.includes('if(historyLoading)return'),'수정 이력 조회가 겹치면 안 됩니다.');
assert.ok(src.includes("button.textContent='수정 이력 불러오는 중…'"),'수정 이력 조회 중임을 교사에게 보여줘야 합니다.');
assert.ok(src.includes("button.textContent='수정 이력 보기'"),'수정 이력 조회가 끝나면 버튼 문구를 복구해야 합니다.');

console.log('admin question review save safety contract self-test passed');
