const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-shop.js','utf8');

assert.ok(src.includes("const esc=v=>String(v??'').replace"),'상점 아이템 표시용 이스케이프 함수가 필요합니다.');
assert.ok(src.includes('${esc(item.name)}'),'상점 아이템 이름은 안전하게 표시해야 합니다.');
assert.ok(src.includes('${esc(id)}'),'상점 아이템 ID는 안전하게 표시해야 합니다.');
assert.ok(src.includes('saving=false,loading=false'),'상점 저장과 조회 상태를 각각 추적해야 합니다.');
assert.ok(src.includes('async function load(){ensure();if(loading)return;')&&src.includes("return;loading=true;status.textContent='불러오는 중…'"),'상점 설정 조회가 겹치면 안 됩니다.');
assert.ok(src.includes('finally{loading=false}'),'상점 조회가 끝나면 조회 잠금을 풀어야 합니다.');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'상점 관리 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(src.includes('async function timedFetch'),'상점 관리 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok((src.match(/timedFetch\(/g)||[]).length>=3,'상점 조회와 저장은 모두 제한시간 보호를 받아야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'불러오기 시간 초과':'불러오기 실패'"),'조회 제한시간 초과를 교사가 구분할 수 있어야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'서버 응답 시간이 초과되었습니다.'"),'저장 제한시간 초과를 교사에게 안내해야 합니다.');

console.log('admin shop refresh safety contract self-test passed');
