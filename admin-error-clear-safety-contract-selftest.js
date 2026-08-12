const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-errors.js','utf8');
assert.ok(src.includes('let clearing=false'),'오류 기록 비우기 중복 실행 상태가 필요합니다.');
assert.ok(src.includes('if(clearing)return'),'오류 기록 비우기 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('clearBtn.disabled=true'),'비우는 동안 버튼을 잠가야 합니다.');
assert.ok(src.includes("clearBtn.textContent='비우는 중…'"),'비우는 중임을 교사에게 보여줘야 합니다.');
assert.ok(src.includes("finally{clearing=false;clearBtn.disabled=false;clearBtn.textContent='기록 비우기'}"),'처리 후 버튼과 상태를 복구해야 합니다.');

console.log('admin error clear safety contract self-test passed');