const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes("res.status(400).json({ok:false,code:'invalid-input'})"),
  '잘못된 문제 수정 이력 입력은 400 invalid-input으로 거부해야 합니다.'
);
assert.ok(
  src.includes("res.status(404).json({ok:false,code:'not-found'})"),
  '존재하지 않는 문제 수정 이력 되돌림 대상은 404 not-found로 거부해야 합니다.'
);
assert.ok(
  src.includes("if(i<0)return res.status(404)"),
  '존재하지 않는 이력 항목은 저장 변경 전에 즉시 거부해야 합니다.'
);

console.log('question history error response contract self-test passed');
