const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes("function read(getSetting){try{const rows=JSON.parse(getSetting(STORE_KEY)||'[]');return Array.isArray(rows)?rows:[]}catch{return[]}}"),
  '문제 수정 이력 저장값이 비어 있거나 잘못된 JSON이거나 배열이 아니어도 빈 이력으로 안전하게 처리해야 합니다.'
);
assert.ok(
  !src.includes('catch{throw'),
  '문제 수정 이력 읽기 실패가 서버 오류로 다시 전파되면 안 됩니다.'
);

console.log('question history corrupt storage fallback contract self-test passed');
