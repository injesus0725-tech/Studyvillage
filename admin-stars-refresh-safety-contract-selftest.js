const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-stars.js','utf8');

assert.ok(src.includes('studentsLoading=null'),'학생 목록 조회 중 상태를 추적해야 합니다.');
assert.ok(src.includes('if(studentsLoading)return studentsLoading'),'학생 목록 조회가 겹치면 기존 요청을 재사용해야 합니다.');
assert.ok(src.includes('selectedLoadSeq=0'),'별 장부 조회 순서를 추적해야 합니다.');
assert.ok(src.includes('const name=select.value,seq=++selectedLoadSeq'),'학생 선택마다 최신 조회 번호를 발급해야 합니다.');
assert.ok(src.includes('if(seq!==selectedLoadSeq||select.value!==name)return'),'이전 학생의 늦은 응답이 현재 화면을 덮으면 안 됩니다.');
assert.ok(src.includes("status.textContent='준비됨'"),'학생 선택을 해제하면 상태 안내를 초기화해야 합니다.');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'별 관리 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(src.includes('async function timedFetch'),'별 관리 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok((src.match(/timedFetch\(/g)||[]).length>=4,'학생 목록·별 이력·지급/차감 요청은 제한시간 보호를 받아야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'불러오기 시간 초과':'불러오기 실패'"),'별 이력 조회 시간 초과를 교사가 구분할 수 있어야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'서버 응답 시간이 초과되었습니다.'"),'별 지급·차감 시간 초과를 교사에게 안내해야 합니다.');

console.log('admin stars refresh safety contract self-test passed');
