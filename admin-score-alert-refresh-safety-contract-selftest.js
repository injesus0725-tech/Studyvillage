const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-score-alerts.js','utf8');

assert.ok(src.includes('let loading=false'),'점수·XP 이상 알림 조회 중복 방지 상태가 필요합니다.');
assert.ok(src.includes('if(loading)return;loading=true'),'이상 알림 조회 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('finally{loading=false}'),'조회가 끝나면 중복 방지 상태를 반드시 해제해야 합니다.');
assert.ok(src.includes("window.addEventListener('focus',load)"),'창 포커스 복귀 시 최신 이상 알림을 확인해야 합니다.');
assert.ok(src.includes("document.addEventListener('visibilitychange'"),'탭 복귀 시 최신 이상 알림을 확인해야 합니다.');
assert.ok(src.includes('setInterval(()=>{if(!document.hidden)load()},30000)'),'자동 갱신 주기는 30초를 유지해야 합니다.');

console.log('admin score alert refresh safety contract self-test passed');
