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

console.log('student activity entry spam suppression contract self-test passed');
