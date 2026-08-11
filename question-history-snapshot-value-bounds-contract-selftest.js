const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes('options:Array.isArray(q.options)?q.options.slice(0,12).map(v=>clean(v,500)):[]'),
  '문제 수정 이력 선택지는 배열일 때만 저장하고 최대 12개, 항목당 500자로 제한해야 합니다.'
);
assert.ok(
  src.includes('answer:Number.isInteger(Number(q.answer))?Number(q.answer):null'),
  '문제 수정 이력 정답은 정수로 해석 가능한 값만 숫자로 저장하고 그 외에는 null이어야 합니다.'
);
assert.ok(
  src.includes("const clean=(v,n=500)=>String(v??'').trim().slice(0,n)"),
  '문제 수정 이력 문자열 값은 null 안전 변환 후 공백 정리와 길이 제한을 거쳐야 합니다.'
);

console.log('question history snapshot value bounds contract self-test passed');
