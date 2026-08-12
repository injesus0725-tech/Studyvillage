const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('library-game.js','utf8');

assert.ok(src.includes('const controller=new AbortController()'),'낱말 활동 문제 불러오기에 AbortController가 필요합니다.');
assert.ok(src.includes('setTimeout(()=>controller.abort(),timeoutMs)'),'낱말 활동 문제 불러오기는 제한시간 후 중단되어야 합니다.');
assert.ok(src.includes('finally{clearTimeout(timeout)}'),'문제 불러오기 성공·실패 후 타임아웃 타이머를 정리해야 합니다.');
assert.ok(src.includes("question override unavailable; using bundled questions"),'문제 덮어쓰기 불러오기 실패 시 번들 문제를 유지해야 합니다.');

console.log('vocabulary startup timeout cleanup contract self-test passed');
