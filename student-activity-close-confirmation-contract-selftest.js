const fs=require('fs'),assert=require('assert');
const session=fs.readFileSync('student-session.js','utf8');

assert.ok(session.includes(".math-practice-panel:not([hidden]) .quiz-close,#library-game:not([hidden]) #library-close,#quiz-panel:not([hidden]) #quiz-close"),'math, Bookmaru, and challenge hall close buttons must share the exit guard');
assert.ok(session.includes("const isQuiz=panel?.id==='quiz-panel'"),'challenge hall must use its own completion/close rule');
assert.ok(session.includes("panel?.querySelector('#quiz-progress')?.textContent==='완료'"),'completed challenge results may return without an unnecessary warning');
assert.ok(session.includes("panel?.querySelector('.math-prompt,.library-word')?.textContent?.includes('완료')"),'completed math/Bookmaru result screens may return without an unnecessary warning');
assert.ok(session.includes('제출해 저장된 문제까지는 이어하기 기록에 남습니다.'),'students must be told what checkpointed learning progress is preserved');
assert.ok(session.includes('아직 완료하지 않은 도전은 다음에 처음부터 다시 시작합니다.'),'challenge hall close warning must explain unfinished challenge behavior');
assert.ok(session.includes("quiz?.querySelector('#quiz-progress')?.textContent==='완료'&&quiz.querySelector('#quiz-next')?.hidden"),'challenge hall must block exit while its completed result is still being saved');
assert.ok(session.includes("next.textContent='마을로 돌아가기 🏡'"),'completed challenge result button must clearly return to the village');
assert.ok(session.includes("event.target.closest('#quiz-panel:not([hidden]) #quiz-next')"),'completed challenge result action must be intercepted before the legacy record-panel hop');
assert.ok(session.includes("document.querySelector('#quiz-panel #quiz-close')?.click()"),'completed challenge result action must reuse the safe close-to-village path');
assert.ok(session.includes('event.preventDefault();event.stopImmediatePropagation();'),'canceling or rerouting activity actions must not leak through to stale handlers');
console.log('student activity close confirmation contract self-test passed');
