const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes("const rows=read(getSetting).slice().reverse()"),
  '문제 수정 이력 조회는 저장 배열을 직접 뒤집지 않고 복사본을 최신순으로 반환해야 합니다.'
);
assert.ok(
  src.includes("res.json({ok:true,history:rows})"),
  '문제 수정 이력 조회는 복사된 최신순 배열만 응답해야 합니다.'
);

console.log('question history read order preservation contract self-test passed');
