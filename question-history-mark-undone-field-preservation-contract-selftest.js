const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');
const start=src.indexOf("app.post('/api/admin/question-history/:id/mark-undone'");
const route=src.slice(start);

assert.ok(start>=0,'문제 수정 이력 되돌림 표시 경로가 필요합니다.');
assert.ok(
  route.includes('rows[i]={...rows[i],undoneAt:new Date().toISOString()}'),
  '되돌림 표시는 기존 이력 항목의 필드를 보존하고 undoneAt만 갱신해야 합니다.'
);
assert.ok(
  route.includes('write(setSetting,rows)'),
  '되돌림 표시는 기존 이력 배열 전체를 보존해 저장해야 합니다.'
);
assert.ok(!route.includes('rows.splice('),'되돌림 표시 중 이력 항목을 삭제하면 안 됩니다.');
assert.ok(!route.includes('rows=rows.filter('),'되돌림 표시 중 이력 배열에서 항목을 제거하면 안 됩니다.');

console.log('question history mark undone field preservation contract self-test passed');
