const fs=require('fs'),assert=require('assert');
const guard=fs.readFileSync('assets/expedition-entry-guard.js','utf8');
const index=fs.readFileSync('index.html','utf8');
for(const token of [
  "#student-explore-panel button[data-expedition]",
  "headers().Authorization",
  "StudyVillageConnection",
  "activity-attempt-status/",
  "status===401",
  "status===404",
  "data.allowed",
  "stopImmediatePropagation()"
])assert.ok(guard.includes(token),`expedition entry guard missing ${token}`);
assert.ok(guard.includes('교실 서버 계정으로 로그인된 상태가 아니에요.'),'local-only login must be explained before a server-authoritative expedition starts');
assert.ok(guard.includes('최신 버전으로 다시 실행해 주세요.'),'server route/version mismatch must be distinguishable from an exhausted attempt limit');
assert.ok(guard.includes("window.StudyVillageAuth?.clearSession?.()"),'expired unauthenticated sessions must be cleared instead of repeatedly failing');
assert.ok(index.indexOf('assets/expedition-entry-guard.js')<index.indexOf('assets/student-study-menu.js'),'expedition preflight guard must load before the expedition hub handler');
assert.ok(guard.includes('approvedStatus')&&guard.includes('consumeApproved(input)'),'the hub must reuse the preflight allowance response instead of making a second network allowance request');
assert.ok(guard.includes('originalFetch(statusPath(activityId)'),'the real allowance request must happen in the preflight layer');
assert.ok(guard.includes("button.dataset.expeditionStarting='true'")&&guard.includes('holdUntilTransition(button)'),'rapid repeated taps must stay locked until the expedition transition completes or times out');
assert.ok(guard.includes('START_LOCK_MS=7000'),'expedition start lock must have a bounded recovery timeout');
console.log('expedition entry guard contract self-test passed');
