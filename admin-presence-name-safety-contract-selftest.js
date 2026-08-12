const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-presence.js','utf8');
assert.ok(src.includes("esc=v=>String(v??'').replace"),'접속 현황에 학생 이름 HTML 이스케이프가 필요합니다.');
assert.ok(src.includes('${esc(row.name)}'),'학생 이름은 안전하게 이스케이프해서 표시해야 합니다.');
assert.ok(!src.includes('<strong>${row.name}</strong>'),'학생 이름을 그대로 innerHTML에 넣으면 안 됩니다.');
console.log('admin presence name safety contract self-test passed');