const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('activity-records.js','utf8');

assert.ok(src.includes("fetch('/api/player/me'"),'학생 기록 새로고침은 현재 학생 정보만 읽어야 합니다.');
assert.ok(src.includes("fetch('/api/player/me/score-ledger?limit=100'"),'점수 장부 조회량은 100건으로 제한되어야 합니다.');
assert.ok(src.includes("fetch('/api/player/me/stars?limit=100'"),'별 장부 조회량은 100건으로 제한되어야 합니다.');
assert.ok(src.includes("cache:'no-store'"),'학생 기록 새로고침은 오래된 캐시를 재사용하지 않아야 합니다.');

console.log('student record request bounds contract self-test passed');
