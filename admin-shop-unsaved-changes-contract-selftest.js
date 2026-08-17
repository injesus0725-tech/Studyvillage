const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-shop.js','utf8');

assert.ok(src.includes("activeSlot='all',dirty=false"),'상점 미저장 상태를 추적해야 합니다.');
assert.ok(src.includes("panel.addEventListener('input',markDirty)"),'모든 상점 입력 변경을 감지해야 합니다.');
assert.ok(src.includes("status.textContent='저장하지 않은 변경'"),'교사에게 미저장 상태를 보여야 합니다.');
assert.ok(src.includes("if(dirty&&!confirm('저장하지 않은 상점 변경을 버리고 다시 불러올까요?'))return"),'다시 불러오기 전에 미저장 변경 폐기를 확인해야 합니다.');
assert.ok(src.includes("window.addEventListener('beforeunload'"),'페이지 이탈 전에 미저장 변경을 보호해야 합니다.');
assert.ok(src.includes('event.preventDefault();event.returnValue'),'브라우저 이탈 확인창을 표준 방식으로 요청해야 합니다.');
const renderStart=src.indexOf('function render(data)');
const renderEnd=src.indexOf('async function load()',renderStart);
assert.ok(renderStart>=0&&renderEnd>renderStart,'상점 렌더 함수가 필요합니다.');
const renderBody=src.slice(renderStart,renderEnd);
assert.ok(renderBody.includes('dirty=false'),'서버 응답을 정상 렌더한 뒤 미저장 상태를 해제해야 합니다.');
assert.ok(renderBody.indexOf('dirty=false')>renderBody.indexOf('renderDelivery(data)'),'상품과 전달 요청을 모두 렌더한 뒤 미저장 상태를 해제해야 합니다.');
assert.ok(src.includes("for(const input of panel.querySelectorAll('input'))input.disabled=value"),'저장 중에는 모든 상점 입력을 잠가야 합니다.');
assert.ok(src.includes('finally{setSaving(false)}'),'저장 성공·실패 뒤 입력 잠금을 반드시 풀어야 합니다.');
console.log('admin shop unsaved changes contract self-test passed');
