const fs=require('fs');
const assert=require('assert');

const sync=fs.readFileSync('student-result-profile-sync.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));

assert.ok(sync.includes("studyvillage:library-complete"),'책마루 완료 이벤트에서 프로필 갱신이 필요합니다.');
assert.ok(sync.includes("#profile-score"),'상단 점수 표시 갱신이 필요합니다.');
assert.ok(sync.includes("#profile-level"),'상단 레벨 표시 갱신이 필요합니다.');
assert.ok(sync.includes("#profile-title"),'상단 칭호 표시 갱신이 필요합니다.');
assert.ok(sync.includes("quizNext.textContent!=='결과 다시 저장하기 ↻'"),'수수께끼 결과 재저장 버튼만 별도로 보호해야 합니다.');
assert.ok(sync.includes('event.stopImmediatePropagation()'),'결과 재저장 시 기존 클릭 처리와 중복 실행되지 않아야 합니다.');
assert.ok(sync.includes('retryingRiddleResult'),'결과 재저장 진행 상태를 추적해야 합니다.');
assert.ok(sync.includes('quizNext.disabled=true'),'결과 재저장 중 버튼 연타를 막아야 합니다.');
assert.ok(sync.includes('Promise.resolve(retry.call(quizNext,event)).finally'),'재저장 처리가 끝난 뒤에만 잠금을 해제해야 합니다.');
assert.ok(index.includes('<script src="student-result-profile-sync.js"></script>'),'학생 화면에서 프로필 갱신 모듈을 불러와야 합니다.');
assert.ok((pkg.build?.files||[]).includes('student-result-profile-sync.js'),'배포 파일에 프로필 갱신 모듈이 포함되어야 합니다.');

console.log('student result profile sync contract self-test passed');
