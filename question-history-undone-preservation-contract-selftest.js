const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes("app.post('/api/admin/question-history/:id/mark-undone',requireAdmin"),
  '문제 수정 이력 되돌림 표시 경로는 관리자 인증을 거쳐야 합니다.'
);
assert.ok(
  src.includes("rows[i]={...rows[i],undoneAt:new Date().toISOString()}"),
  '되돌림 처리는 이력 항목을 삭제하지 않고 undoneAt만 기록해야 합니다.'
);
assert.ok(
  src.includes("if(i<0)return res.status(404).json({ok:false,code:'not-found'})"),
  '존재하지 않는 이력 항목은 변경하지 않고 404로 응답해야 합니다.'
);
assert.ok(
  src.includes('write(setSetting,rows);res.json({ok:true,entry:rows[i]})'),
  '되돌림 표시 후 기존 이력 배열을 보존해 저장해야 합니다.'
);

console.log('question history undone preservation contract self-test passed');
