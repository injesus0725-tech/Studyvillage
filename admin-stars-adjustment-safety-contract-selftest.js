const fs=require('fs');
const assert=require('assert');

const source=fs.readFileSync('admin-stars.js','utf8');

assert.ok(
  source.includes("if(!Number.isInteger(amount)||amount<=0)"),
  '별 조정 수량은 1 이상의 정수만 허용해야 합니다.'
);
assert.ok(
  source.includes("if(!reason?.trim())"),
  '별 조정에는 교사가 입력한 사유가 필요합니다.'
);
assert.ok(
  source.includes("if(!confirm(`${name} 학생의 별을"),
  '별 조정 전 학생·수량·사유를 교사가 확인해야 합니다.'
);
assert.ok(
  source.includes("d.code==='insufficient-stars'"),
  '보유 별보다 큰 차감 요청은 명확한 실패 안내를 유지해야 합니다.'
);
assert.ok(
  source.includes("finally{setAdjusting(false)}"),
  '별 조정 요청 완료 후 중복 제출 잠금을 해제해야 합니다.'
);

console.log('admin star adjustment safety contract self-test passed');
