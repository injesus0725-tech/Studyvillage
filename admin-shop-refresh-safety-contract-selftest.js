const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-shop.js','utf8');

assert.ok(src.includes("const esc=v=>String(v??'').replace"),'상점 아이템 표시용 이스케이프 함수가 필요합니다.');
assert.ok(src.includes('${esc(item.name)}'),'상점 아이템 이름은 안전하게 표시해야 합니다.');
assert.ok(src.includes('${esc(id)}'),'상점 아이템 ID는 안전하게 표시해야 합니다.');
assert.ok(src.includes('saving=false,loading=false'),'상점 저장과 조회 상태를 각각 추적해야 합니다.');
assert.ok(src.includes('async function load(){ensure();if(loading)return;loading=true'),'상점 설정 조회가 겹치면 안 됩니다.');
assert.ok(src.includes('finally{loading=false}'),'상점 조회가 끝나면 조회 잠금을 풀어야 합니다.');

console.log('admin shop refresh safety contract self-test passed');
