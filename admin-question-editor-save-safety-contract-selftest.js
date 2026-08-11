const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-question-editor.js','utf8');

assert.ok(src.includes('saving=false'),'문제 편집 저장 상태 잠금이 필요합니다.');
assert.ok((src.match(/if\(saving\)return alert\('문제 저장이 끝난 뒤 다시 시도해 주세요\.'/g)||[]).length>=2,'수정과 원본 복귀 모두 중복 저장을 막아야 합니다.');
assert.ok((src.match(/saving=true;status\.textContent=/g)||[]).length>=2,'수정과 원본 복귀 저장 시작 시 잠금이 필요합니다.');
assert.ok((src.match(/finally\{saving=false\}/g)||[]).length>=2,'성공·실패 후 저장 잠금이 반드시 풀려야 합니다.');
assert.ok(src.includes('원본은 보존되고 수정 이력이 남습니다.'),'문제 수정 전 최종 확인 안내를 유지해야 합니다.');
assert.ok(src.includes('원본 복귀도 수정 이력에 남습니다.'),'원본 복귀 전 최종 확인 안내를 유지해야 합니다.');

console.log('admin question editor save safety contract self-test passed');
