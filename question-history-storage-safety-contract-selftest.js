const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(src.includes("const STORE_KEY='question-edit:history-v1'"),'문제 수정 이력 저장 키가 유지되어야 합니다.');
assert.ok(src.includes('rows.slice(-500)'),'문제 수정 이력은 최근 500건으로 제한되어야 합니다.');
assert.ok(src.includes('q.options.slice(0,12)'),'문제 스냅샷 선택지는 최대 12개로 제한되어야 합니다.');
assert.ok(src.includes("app.get('/api/admin/question-history',requireAdmin"),'문제 수정 이력 조회는 관리자 인증을 거쳐야 합니다.');
assert.ok(src.includes("app.post('/api/admin/question-history/snapshot',requireAdmin"),'문제 수정 이력 기록은 관리자 인증을 거쳐야 합니다.');
assert.ok(src.includes("app.post('/api/admin/question-history/:id/mark-undone',requireAdmin"),'문제 수정 이력 상태 변경은 관리자 인증을 거쳐야 합니다.');

console.log('question history storage safety contract self-test passed');
