const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/question-history.js','utf8');

assert.ok(src.includes("const clean=(v,n=500)=>String(v??'').trim().slice(0,n)"),'문제 수정 이력 문자열 길이 제한 도우미가 유지되어야 합니다.');
assert.ok(src.includes('clean(q.word,300)'),'문제 낱말 스냅샷은 최대 300자로 제한되어야 합니다.');
assert.ok(src.includes('clean(q.question,1000)'),'문제 본문 스냅샷은 최대 1000자로 제한되어야 합니다.');
assert.ok(src.includes('clean(q.prompt,1000)'),'문제 안내문 스냅샷은 최대 1000자로 제한되어야 합니다.');
assert.ok(src.includes('map(v=>clean(v,500))'),'선택지 스냅샷은 항목당 최대 500자로 제한되어야 합니다.');
assert.ok(src.includes('const id=clean(activityId,80)'),'활동 ID 이력 값은 최대 80자로 제한되어야 합니다.');
assert.ok(src.includes('why=clean(reason,240)'),'수정 사유는 최대 240자로 제한되어야 합니다.');
assert.ok(src.includes("if(!id||!Number.isInteger(n)||n<1||!why)throw new Error('invalid-history-input')"),'잘못된 문제 수정 이력 입력은 저장 전에 거부되어야 합니다.');

console.log('question history input bounds contract self-test passed');
