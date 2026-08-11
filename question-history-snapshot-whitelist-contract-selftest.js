const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');
const start=src.indexOf('export function safeQuestionSnapshot');
const end=src.indexOf('\nexport function recordQuestionHistory',start);
const snapshot=src.slice(start,end);

assert.ok(start>=0&&end>start,'safeQuestionSnapshot 함수가 필요합니다.');
assert.ok(snapshot.includes('return{word:'),'문제 수정 이력 스냅샷은 허용된 필드만 명시적으로 구성해야 합니다.');
assert.ok(snapshot.includes('question:'),'문제 본문 필드가 스냅샷에 유지되어야 합니다.');
assert.ok(snapshot.includes('prompt:'),'문제 안내문 필드가 스냅샷에 유지되어야 합니다.');
assert.ok(snapshot.includes('options:'),'문제 선택지 필드가 스냅샷에 유지되어야 합니다.');
assert.ok(snapshot.includes('answer:Number.isInteger(Number(q.answer))?Number(q.answer):null'),'정답 값은 정수일 때만 스냅샷에 기록되어야 합니다.');
assert.ok(!snapshot.includes('...q'),'원본 문제 객체 전체를 문제 수정 이력에 펼쳐 저장하면 안 됩니다.');

console.log('question history snapshot whitelist contract self-test passed');
