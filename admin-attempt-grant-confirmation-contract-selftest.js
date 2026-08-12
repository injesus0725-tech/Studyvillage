const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-attempt-policy.js','utf8');

assert.ok(src.includes("confirm(`${name} 학생에게 ${activityName} 추가 도전 1회를 허용할까요?`)"),'추가 도전권 지급 전 학생과 활동을 확인해야 합니다.');
assert.ok(src.includes("if(!confirm("),'확인 취소 시 추가 도전권을 지급하면 안 됩니다.');
assert.ok(src.includes('b.disabled=true'),'지급 요청 중에는 같은 버튼을 다시 누르지 못해야 합니다.');
assert.ok(src.includes('finally{b.disabled=false}'),'지급 요청이 끝나면 버튼이 다시 활성화되어야 합니다.');
assert.ok(src.includes("const esc=v=>String(v??'').replace"),'학생·활동·이력 문구를 안전하게 표시하는 이스케이프 함수가 필요합니다.');
assert.ok(src.includes('<strong>${esc(s.name)}</strong>'),'학생 이름은 HTML에 직접 넣지 않고 이스케이프해야 합니다.');
assert.ok(src.includes('${esc(e.detail||\'\')}'),'추가 도전권 이력 메모도 이스케이프해야 합니다.');
assert.ok(src.includes('let policies={},loading=false,historyLoading=false'),'정책과 이력 조회 중복 상태를 추적해야 합니다.');
assert.ok(src.includes('async function load(){if(loading)return;loading=true'),'전체 도전 정책 조회가 겹치면 안 됩니다.');
assert.ok(src.includes('async function loadHistory(){if(historyLoading)return;historyLoading=true'),'이력 새로고침 요청이 겹치면 안 됩니다.');
assert.ok(src.includes("historyRefresh.disabled=true;historyRefresh.textContent='불러오는 중…'"),'이력 조회 중에는 새로고침 버튼을 잠가야 합니다.');
assert.ok(src.includes("historyRefresh.disabled=false;historyRefresh.textContent='새로고침'"),'이력 조회 후 새로고침 버튼을 복구해야 합니다.');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'도전 횟수 관리 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(src.includes('async function timedFetch'),'도전 횟수 관리 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok((src.match(/timedFetch\(/g)||[]).length>=6,'정책·현황·이력 조회와 저장·추가 지급은 제한시간 보호를 받아야 합니다.');

console.log('admin attempt grant confirmation contract self-test passed');
