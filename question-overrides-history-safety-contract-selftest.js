const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-overrides.js','utf8');

assert.ok(src.includes("app.post('/api/admin/question-overrides',requireAdmin"),'문제 수정 저장은 관리자 인증을 거쳐야 합니다.');
assert.ok(src.includes("app.post('/api/admin/question-overrides/:activityId/:questionNumber/revert',requireAdmin"),'원본 복귀도 관리자 인증을 거쳐야 합니다.');
assert.ok(src.includes("app.delete('/api/admin/question-overrides/:activityId/:questionNumber',requireAdmin,(_req,res)=>res.status(405).json({ok:false,code:'use-history-safe-revert'})"),'수정본 직접 삭제 대신 이력 안전 복귀를 강제해야 합니다.');
assert.ok(src.includes('const entry=recordQuestionHistory({getSetting,setSetting,activityId,questionNumber,reason,before,after})'),'문제 수정과 원본 복귀 모두 이력을 기록해야 합니다.');
assert.ok(src.includes("catch(err){if(previous)overrides[k]=previous;else delete overrides[k];write(setSetting,overrides);res.status(500).json({ok:false,code:'question-edit-save-failed'"),'수정 이력 저장 실패 시 기존 수정본 상태로 롤백해야 합니다.');
assert.ok(src.includes("catch(err){overrides[k]=previous;write(setSetting,overrides);res.status(500).json({ok:false,code:'question-revert-failed'"),'원본 복귀 이력 저장 실패 시 기존 수정본을 복구해야 합니다.');

console.log('question override history safety contract self-test passed');
