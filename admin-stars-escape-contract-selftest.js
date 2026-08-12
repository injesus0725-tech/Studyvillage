const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-stars.js','utf8');

assert.ok(src.includes('replace(/[&<>\'\\"]/g'),'교사용 별 관리 출력은 HTML 특수문자를 이스케이프해야 합니다.');
assert.ok(src.includes('"\"":"&quot;"')||src.includes("'\"':'&quot;'"),'큰따옴표는 &quot;로 이스케이프되어야 합니다.');
assert.ok(src.includes('${esc(p.name)}'),'학생 이름은 option 값과 표시 텍스트에서 이스케이프되어야 합니다.');

console.log('admin stars escape contract self-test passed');
