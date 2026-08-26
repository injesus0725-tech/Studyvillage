const fs=require('fs'),assert=require('assert');
const stability=fs.readFileSync('assets/student-stability-fixes.js','utf8'),guard=fs.readFileSync('assets/student-riddle-completion-guard.js','utf8'),loader=fs.readFileSync('assets/student-question-overrides.js','utf8'),game=fs.readFileSync('game.js','utf8'),plan=fs.readFileSync('V1_COMPLETION_PLAN.md','utf8');
for(const token of ['legacyQuizRetryInstalled','for(let attempt=0;attempt<3;attempt++)','makeCompletedQuizReturnSafe','결과 확인 완료 · 마을로 돌아가기','data-save-recovery-exit'])assert.ok(stability.includes(token),`legacy quiz recovery missing ${token}`);
assert.ok(game.includes("function villageReady(){state.dialogueOpen=false")&&game.includes("window.dispatchEvent(new Event('studyvillage:return-to-village'))"),'legacy close must reset village interaction state');
for(const token of ['safeReturn','cleanupVillage','inside-building','building-interior','studyvillage:return-to-village','data.riddleCompletionReturn'])assert.ok(guard.includes(token),`riddle completion guard missing ${token}`);
assert.ok(loader.includes('student-riddle-completion-guard.js'),'riddle completion guard must load in the student runtime');
assert.ok(plan.includes('기존 도전관 수수께끼 완료 뒤 저장 대기'),'reported legacy completion regression must remain tracked until real-device confirmation');
console.log('legacy quiz completion recovery contract self-test passed');
