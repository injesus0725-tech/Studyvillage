const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-question-review.js','utf8');

assert.ok(/(?:const|let)\s+[^;]*\bsavingReviews\s*=\s*new Set\(\)/.test(src),'문제 검토 저장 중 상태를 추적해야 합니다.');
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
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'문제 검토 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(src.includes('async function timedFetch'),'문제 검토 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok((src.match(/timedFetch\(/g)||[]).length>=6,'검사·목록·상태 저장·수정 이력·초기 확인 요청은 제한시간 보호를 받아야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'검사 시간 초과':'검사 실패'"),'문제 검사 시간 초과를 교사가 구분할 수 있어야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'문제 검토 상태 저장 시간이 초과되었습니다.'"),'검토 상태 저장 시간 초과를 교사에게 안내해야 합니다.');
assert.ok(src.includes('const controller=new AbortController()'),'문제 검토 요청 제한시간은 요청별 AbortController를 사용해야 합니다.');
assert.ok(src.includes('timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS)'),'문제 검토 요청은 설정된 제한시간 뒤 중단되어야 합니다.');
assert.ok(src.includes('finally{clearTimeout(timer)}'),'문제 검토 요청이 성공·실패·중단되더라도 제한시간 타이머를 정리해야 합니다.');
assert.ok(src.includes('signal:controller.signal'),'실제 fetch 요청에 AbortController signal이 전달되어야 합니다.');
assert.ok((src.match(/r\.status===401/g)||[]).length>=4,'문제 검사·목록·상태 저장·수정 이력에서 관리자 인증 만료를 각각 처리해야 합니다.');
assert.ok(src.includes("summary.textContent='관리자 로그인 필요'"),'인증 만료 시 이전 문제 검토 상태를 현재 상태처럼 보여주면 안 됩니다.');
assert.ok(src.includes('관리자 로그인이 만료되었습니다. 다시 로그인해 주세요.'),'인증 만료 원인을 교사에게 명확히 안내해야 합니다.');
assert.ok(src.includes("count.textContent='-'"),'문제 검사 인증 만료 시 이전 이상 건수를 그대로 유지하면 안 됩니다.');

console.log('admin question review save safety contract self-test passed');