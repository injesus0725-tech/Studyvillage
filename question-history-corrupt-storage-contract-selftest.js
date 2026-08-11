const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes("try{const rows=JSON.parse(getSetting(STORE_KEY)||'[]')"),
  '문제 수정 이력 읽기는 저장 문자열 파싱 실패를 안전하게 처리해야 합니다.'
);
assert.ok(
  src.includes('return Array.isArray(rows)?rows:[]'),
  '문제 수정 이력 저장값이 배열이 아니면 빈 이력으로 처리해야 합니다.'
);
assert.ok(
  src.includes('catch{return[]}'),
  '손상된 문제 수정 이력 저장값은 예외를 전파하지 않고 빈 이력으로 복구해야 합니다.'
);

console.log('question history corrupt storage contract self-test passed');
