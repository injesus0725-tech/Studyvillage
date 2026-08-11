const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-presence.js','utf8');
assert.ok(src.includes("id=\"presence-refresh\""),'교사 접속 현황에 수동 새로고침 버튼이 필요합니다.');
assert.ok(src.includes("refresh?.addEventListener('click',load)"),'새로고침 버튼은 즉시 접속 현황을 다시 불러와야 합니다.');
assert.ok(src.includes('setInterval(load,10000)'),'자동 확인 간격은 10초를 유지해야 합니다.');
assert.ok(src.includes('if(!token()||app.hidden||document.hidden||loading)return'),'숨겨진 화면이나 중복 요청에서는 불필요한 조회를 막아야 합니다.');
assert.ok(src.includes('마지막 확인'),'교사가 접속 현황의 최신 확인 시각을 볼 수 있어야 합니다.');
console.log('admin presence refresh contract self-test passed');
