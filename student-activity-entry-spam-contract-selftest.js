const fs=require('fs');
const assert=require('assert');

const gate=fs.readFileSync('activity-gate.js','utf8');

for(const token of [
  'const pending=new Set()',
  'if(pending.has(id))return false',
  'pending.add(id)',
  'pending.delete(id)',
  'NOTICE_COOLDOWN_MS=1800'
]){
  assert.ok(gate.includes(token),`학생 활동 연타 방지 흐름 누락: ${token}`);
}

assert.ok(gate.includes("e.preventDefault();e.stopImmediatePropagation()"),'활동 시작 입력이 중복 전달되지 않도록 막아야 합니다.');
assert.ok(gate.includes('REQUEST_TIMEOUT_MS=5000'),'학생 활동 입장 확인 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(gate.includes('async function timedFetch'),'학생 활동 입장 확인 요청은 공통 제한시간 함수를 사용해야 합니다.');
assert.ok((gate.match(/timedFetch\(/g)||[]).length>=3,'도전 정책과 학생 기록 조회 모두 제한시간 보호를 받아야 합니다.');
assert.ok(gate.includes('catch{return{ok:true}}'),'도전 횟수 확인 서버가 일시적으로 응답하지 않아도 학생 활동을 불필요하게 막으면 안 됩니다.');
assert.ok(gate.includes('finally{clearTimeout(timer)}'),'활동 입장 확인 요청이 끝나면 제한시간 타이머를 정리해야 합니다.');

console.log('student activity entry spam suppression contract self-test passed');
