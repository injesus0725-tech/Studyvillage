const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-score-alerts.js','utf8');
assert.ok(/(?:const|let)\s+[^;]*\bpending\s*=\s*new Set\(\)/.test(src),'점수/XP 기록 처리 중 중복 실행 방지가 필요합니다.');
assert.ok(src.includes('if(pending.has(key))return'),'같은 점수/XP 기록의 처리 요청이 겹치면 안 됩니다.');
assert.ok(src.includes("button.closest('.attention-card')"),'같은 점수/XP 기록 카드의 관련 버튼을 함께 잠가야 합니다.');
assert.ok(src.includes('buttons.forEach(x=>x.disabled=true)'),'처리 중 관련 버튼을 잠가야 합니다.');
assert.ok(src.includes('finally{pending.delete(key);buttons.forEach(x=>x.disabled=false)}'),'처리 후에는 중복 방지를 해제하고 버튼을 다시 사용할 수 있어야 합니다.');

console.log('admin score alert action safety contract self-test passed');