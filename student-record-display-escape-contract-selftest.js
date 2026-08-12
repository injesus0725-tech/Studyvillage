const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('activity-records.js','utf8');

assert.ok(src.includes("esc=v=>String(v??'').replace(/[&<>'\"]/g"),'학생 기록 출력 문자열을 HTML 이스케이프해야 합니다.');
assert.ok(src.includes('${esc(subject)}'),'과목명 출력은 이스케이프되어야 합니다.');
assert.ok(src.includes('${esc(meta.topic)}'),'주제명 출력은 이스케이프되어야 합니다.');
assert.ok(src.includes('${esc(meta.name)}'),'활동명 출력은 이스케이프되어야 합니다.');
assert.ok(src.includes("${esc(e.detail||e.kind||'별 변경')}"),'별 변경 사유 출력은 이스케이프되어야 합니다.');

console.log('student record display escape contract self-test passed');
