const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

for(const route of [
  "app.get('/api/admin/question-history',requireAdmin",
  "app.post('/api/admin/question-history/snapshot',requireAdmin",
  "app.post('/api/admin/question-history/:id/mark-undone',requireAdmin"
]){
  assert.ok(src.includes(route),`관리자 전용 문제 수정 이력 경로가 requireAdmin을 거쳐야 합니다: ${route}`);
}

console.log('question history admin route auth contract self-test passed');
