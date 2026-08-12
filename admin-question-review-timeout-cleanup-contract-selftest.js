const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-question-review.js','utf8');

assert.ok(src.includes('const controller=new AbortController()'),'문제 검토 요청 제한시간은 요청별 AbortController를 사용해야 합니다.');
assert.ok(src.includes('timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS)'),'문제 검토 요청은 설정된 제한시간 뒤 중단되어야 합니다.');
assert.ok(src.includes('finally{clearTimeout(timer)}'),'문제 검토 요청이 성공·실패·중단되더라도 제한시간 타이머를 정리해야 합니다.');
assert.ok(src.includes('signal:controller.signal'),'실제 fetch 요청에 AbortController signal이 전달되어야 합니다.');

console.log('admin question review timeout cleanup contract self-test passed');
