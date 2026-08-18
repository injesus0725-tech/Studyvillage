const fs=require('fs');
const assert=require('assert');

const gate=fs.readFileSync('activity-gate.js','utf8');
const state=fs.readFileSync('activity-state.js','utf8');

for(const token of [
  'const pending=new Set()',
  "if(pending.has(id))return{ok:false,code:'pending'}",
  'pending.add(id)',
  'pending.delete(id)',
  'NOTICE_COOLDOWN_MS=1800'
])assert.ok(gate.includes(token),`학생 활동 연타 방지 흐름 누락: ${token}`);

assert.ok(gate.includes("event.stopImmediatePropagation()"),'승인 전 활동 시작 이벤트가 다른 런타임으로 중복 전달되지 않도록 막아야 합니다.');
assert.ok(gate.includes("event.detail?.gateApproved")&&gate.includes("gateApproved:true"),'승인된 재전송 이벤트만 실제 활동으로 전달되어야 합니다.');
assert.ok(gate.includes('REQUEST_TIMEOUT_MS=5000'),'학생 활동 입장 확인 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(gate.includes('async function timedFetch'),'학생 활동 입장 확인 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok(gate.includes('response=await timedFetch(`/api/player/me/activity-attempt-status/'),'도전 횟수 확인은 제한시간 보호를 받아야 합니다.');
assert.ok(state.includes('REQUEST_TIMEOUT_MS=3000')&&state.includes('await timedFetch(`/api/activity-state/'),'활동 개방 상태 확인도 별도의 제한시간 보호를 받아야 합니다.');
assert.ok(gate.includes("return{ok:false,code,status:0,message:errorMessage(name,0,code)}"),'도전 횟수를 확인할 수 없을 때는 구조화된 실패 결과로 입장을 차단해야 합니다.');
assert.ok(gate.includes('finally{clearTimeout(timer)}'),'활동 입장 확인 요청이 끝나면 제한시간 타이머를 정리해야 합니다.');
assert.ok(state.includes('finally{clearTimeout(timer)}'),'활동 개방 상태 확인이 끝나면 제한시간 타이머를 정리해야 합니다.');

console.log('student activity entry spam suppression contract self-test passed');
