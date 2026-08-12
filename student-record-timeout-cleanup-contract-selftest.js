const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('activity-records.js','utf8');

assert.ok(src.includes('new AbortController()'),'학생 기록 조회는 중단 가능한 요청을 사용해야 합니다.');
assert.ok(src.includes('setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS)'),'학생 기록 조회 제한시간이 지나면 요청을 중단해야 합니다.');
assert.ok(src.includes('signal:controller.signal'),'학생 기록 조회 요청에 AbortSignal을 전달해야 합니다.');
assert.ok(src.includes('finally{clearTimeout(timeout)}'),'학생 기록 조회가 끝나면 제한시간 타이머를 정리해야 합니다.');

console.log('student record timeout cleanup contract self-test passed');
