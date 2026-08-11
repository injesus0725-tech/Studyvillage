const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes("function write(setSetting,rows){setSetting(STORE_KEY,JSON.stringify(rows.slice(-500)))}"),
  '문제 수정 이력 저장은 최신 500개만 보존하고 기존 최신 이력을 임의로 덮어쓰면 안 됩니다.'
);
assert.ok(
  !src.includes('rows.slice(0,500)'),
  '문제 수정 이력 저장 한도 적용 시 오래된 500개를 고정 보존하면 안 됩니다.'
);

console.log('question history retention window contract self-test passed');
