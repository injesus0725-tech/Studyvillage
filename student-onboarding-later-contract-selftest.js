const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('onboarding.js','utf8');
assert.ok(src.includes("skip.addEventListener('click',()=>finish(false))"),'나중에 보기는 안내 완료로 기록하면 안 됩니다.');
assert.ok(src.includes("next.textContent=index===steps.length-1?'마을 시작하기 ✓':'다음 ▶'"),'마지막 단계 완료 버튼을 유지해야 합니다.');
assert.ok(src.includes('else finish(true)'),'안내를 끝까지 본 경우에만 완료 기록을 남겨야 합니다.');
console.log('student onboarding later contract self-test passed');
