const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-stars.js','utf8');

assert.ok(src.includes('studentsLoading=null'),'학생 목록 조회 중 상태를 추적해야 합니다.');
assert.ok(src.includes('if(studentsLoading)return studentsLoading'),'학생 목록 조회가 겹치면 기존 요청을 재사용해야 합니다.');
assert.ok(src.includes('selectedLoadSeq=0'),'별 장부 조회 순서를 추적해야 합니다.');
assert.ok(src.includes('const name=select.value,seq=++selectedLoadSeq'),'학생 선택마다 최신 조회 번호를 발급해야 합니다.');
assert.ok(src.includes('if(seq!==selectedLoadSeq||select.value!==name)return'),'이전 학생의 늦은 응답이 현재 화면을 덮으면 안 됩니다.');
assert.ok(src.includes("status.textContent='준비됨'"),'학생 선택을 해제하면 상태 안내를 초기화해야 합니다.');

console.log('admin stars refresh safety contract self-test passed');
