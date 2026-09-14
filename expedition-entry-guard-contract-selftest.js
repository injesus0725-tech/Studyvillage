const fs=require('fs'),assert=require('assert');
const guard=fs.readFileSync('assets/expedition-entry-guard.js','utf8');
const exploration=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const index=fs.readFileSync('index.html','utf8');
for(const token of [
  "#student-explore-panel button[data-exp]",
  "headers().Authorization",
  "#exploration-cave",
  "study-expedition-active",
  "studyvillage:open-library-game",
  "studyvillage:open-math-practice",
  "studyvillage:open-curriculum-learning",
  "button.dataset.expeditionStarting='true'",
  "START_LOCK_MS=7000",
  "stopImmediatePropagation"
])assert.ok(guard.includes(token),`expedition entry guard missing ${token}`);
assert.ok(!guard.includes('button[data-expedition]'),'legacy expedition selector must not return');
assert.ok(exploration.includes("document.querySelector('.sv-quick-button.explore')?.remove()"),'top-menu exploration entry must stay removed');
assert.ok(exploration.includes("explore=document.querySelector('#exploration-cave')"),'village cave must remain the exploration entry point');
assert.ok(index.indexOf('assets/expedition-entry-guard.js')<index.indexOf('assets/student-exploration-v2.js'),'entry/isolation guard must load before exploration V2');
assert.ok(guard.includes('교실 서버 계정으로 로그인된 상태가 아니에요.'),'server-authoritative exploration must explain missing classroom login');
assert.ok(guard.includes("window.StudyVillagePanels?.closeForeground?.(hub)"),'cave entry must close competing foreground panels');
assert.ok(guard.includes("window.addEventListener('studyvillage:return-to-village'"),'return-to-village must release exploration entry locks');
console.log('expedition entry guard V2 contract self-test passed');
