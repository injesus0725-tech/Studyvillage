const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(
  src.includes('before:safeQuestionSnapshot(before),after:safeQuestionSnapshot(after)'),
  '문제 수정 이력은 변경 전후 값을 모두 안전한 스냅샷으로 저장해야 합니다.'
);
assert.ok(
  src.includes('createdAt:new Date().toISOString(),undoneAt:null'),
  '새 문제 수정 이력은 생성 시각을 기록하고 되돌림 시각은 null로 시작해야 합니다.'
);
assert.ok(
  src.includes('rows.push(entry);write(setSetting,rows);return entry'),
  '새 이력은 기존 이력 뒤에 추가해 저장한 뒤 그 항목을 반환해야 합니다.'
);

console.log('question history entry lifecycle contract self-test passed');
