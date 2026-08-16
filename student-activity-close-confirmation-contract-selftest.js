const fs=require('fs'),assert=require('assert');
const session=fs.readFileSync('student-session.js','utf8');

assert.ok(session.includes("event.target.closest('.math-practice-panel:not([hidden]) .quiz-close,#library-game:not([hidden]) #library-close')"),'both learning activity close buttons must share the exit guard');
assert.ok(session.includes("panel?.querySelector('.math-prompt,.library-word')?.textContent?.includes('완료')"),'completed result screens may return without an unnecessary warning');
assert.ok(session.includes('제출해 저장된 문제까지는 이어하기 기록에 남습니다.'),'students must be told what progress is preserved');
assert.ok(session.includes('현재 문제에 입력만 하고 아직 제출하지 않은 답은 저장되지 않습니다.'),'students must be told which unsubmitted input is not preserved');
assert.ok(session.includes('event.preventDefault();event.stopImmediatePropagation();'),'canceling the confirmation must keep the activity open without leaking the action');
console.log('student activity close confirmation contract self-test passed');
