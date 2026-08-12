const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-score-alerts.js','utf8');

assert.ok(src.includes('let loading=false'),'점수·XP 이상 알림 조회 중복 방지 상태가 필요합니다.');
assert.ok(src.includes('if(loading)return;loading=true'),'이상 알림 조회 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('finally{loading=false}'),'조회가 끝나면 중복 방지 상태를 반드시 해제해야 합니다.');
assert.ok(src.includes("window.addEventListener('focus',load)"),'창 포커스 복귀 시 최신 이상 알림을 확인해야 합니다.');
assert.ok(src.includes("document.addEventListener('visibilitychange'"),'탭 복귀 시 최신 이상 알림을 확인해야 합니다.');
assert.ok(src.includes('setInterval(()=>{if(!document.hidden)load()},30000)'),'자동 갱신 주기는 30초를 유지해야 합니다.');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'점수·XP 이상 알림 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(src.includes('async function timedFetch'),'점수·XP 이상 알림 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok((src.match(/timedFetch\(/g)||[]).length>=6,'알림 조회·확인·수정·되돌리기·장부 조회는 모두 제한시간 보호를 받아야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'수정 요청 시간이 초과되었습니다.'"),'점수/XP 수정 시간 초과를 교사에게 안내해야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'점수 장부 조회 시간이 초과되었습니다.'"),'점수 장부 조회 시간 초과를 교사에게 안내해야 합니다.');

console.log('admin score alert refresh safety contract self-test passed');
