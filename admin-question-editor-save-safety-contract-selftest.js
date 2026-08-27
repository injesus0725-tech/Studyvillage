const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-question-editor.js','utf8');
assert.ok(src.includes("details.className='question-editor-unit'")&&src.includes("subjectDetails.className='question-editor-subject'"),'large question banks must open by subject and unit instead of rendering one long list');
assert.ok(src.includes("details.addEventListener('toggle'")&&src.includes("details.dataset.rendered==='1'"),'question cards must render only when their unit is opened');

assert.ok(src.includes('saving=false'),'문제 편집 저장 상태 잠금이 필요합니다.');
assert.ok((src.match(/if\(saving\)return alert\('문제 저장이 끝난 뒤 다시 시도해 주세요\.'/g)||[]).length>=2,'수정과 원본 복귀 모두 중복 저장을 막아야 합니다.');
assert.ok((src.match(/saving=true;status\.textContent=/g)||[]).length>=2,'수정과 원본 복귀 저장 시작 시 잠금이 필요합니다.');
assert.ok((src.match(/finally\{saving=false\}/g)||[]).length>=2,'성공·실패 후 저장 잠금이 반드시 풀려야 합니다.');
assert.ok(src.includes('원본은 보존되고 수정 이력이 남습니다.'),'문제 수정 전 최종 확인 안내를 유지해야 합니다.');
assert.ok(src.includes('원본 복귀도 수정 이력에 남습니다.'),'원본 복귀 전 최종 확인 안내를 유지해야 합니다.');
assert.ok(src.includes('renderPromise=null'),'문제 목록 갱신 중복 상태를 추적해야 합니다.');
assert.ok(src.includes('if(renderPromise)return renderPromise'),'이미 목록을 갱신 중이면 같은 작업을 재사용해야 합니다.');
assert.ok(src.includes("refreshButton.disabled=true;refreshButton.textContent='목록 갱신 중…'"),'목록 갱신 중에는 새로고침 버튼을 잠가야 합니다.');
assert.ok(src.includes("refreshButton.disabled=false;refreshButton.textContent='문제 목록 새로고침'"),'목록 갱신 후 새로고침 버튼을 복구해야 합니다.');
assert.ok(src.includes('finally{renderPromise=null}'),'목록 갱신이 끝나면 중복 상태를 해제해야 합니다.');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'문제 편집 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(src.includes('async function timedFetch'),'문제 편집 네트워크 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok((src.match(/timedFetch\(/g)||[]).length>=4,'수정본 조회·저장·원본 복귀 요청은 제한시간 보호를 받아야 합니다.');
assert.ok(src.includes("err.name==='AbortError'?'서버 응답 시간이 초과되었습니다.'"),'저장 제한시간 초과를 교사가 이해할 수 있게 안내해야 합니다.');

console.log('admin question editor save safety contract self-test passed');
