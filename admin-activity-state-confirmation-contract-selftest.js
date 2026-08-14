const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-activity-state.js','utf8');
assert.ok(/(?:const|let)\s+[^;]*\bpending\s*=\s*new Set\(\)/.test(src),'활동 상태 변경 중 중복 클릭 방지가 필요합니다.');
assert.ok(src.includes('if(pending.has(id))return'),'같은 활동의 상태 변경 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('let loading=false'),'활동 상태 조회의 중복 실행 상태가 필요합니다.');
assert.ok(src.includes('if(!token()||loading)return;loading=true'),'활동 상태 조회 요청이 겹치면 안 됩니다.');
assert.ok(src.includes('finally{loading=false}'),'활동 상태 조회가 끝나면 중복 방지 상태를 풀어야 합니다.');
assert.ok(!src.includes('if(!r.ok)throw new Error();await load()'),'상태 변경 직후 같은 흐름에서 불필요한 중복 조회를 하면 안 됩니다.');
assert.ok(src.includes('문을 닫을까요?'),'활동 닫기에는 교사 확인이 필요합니다.');
assert.ok(src.includes('문을 다시 열까요?'),'활동 다시 열기에도 교사 확인이 필요합니다.');
assert.ok(src.includes('if(!confirm(message))return'),'열기·닫기 변경은 확인 후 실행되어야 합니다.');
assert.ok(src.includes('&quot;'),'활동 이름의 큰따옴표는 HTML에 안전하게 표시되어야 합니다.');
assert.ok(src.includes('&#39;'),'활동 이름의 작은따옴표는 HTML에 안전하게 표시되어야 합니다.');
assert.ok(src.includes('Authorization:`Bearer ${token()}`'),'활동 관리 요청은 관리자 토큰 함수의 반환값을 보내야 합니다.');
assert.ok(!src.includes('Authorization:`Bearer ${token}`'),'활동 관리 요청에 token 함수 자체를 보내면 안 됩니다.');
assert.ok((src.match(/r\.status===401/g)||[]).length>=2,'활동 상태 조회와 변경 모두 관리자 세션 만료를 처리해야 합니다.');
assert.ok(src.includes('관리자 로그인이 만료되었습니다. 다시 로그인해 주세요.'),'활동 관리에서 세션 만료를 명확히 안내해야 합니다.');
assert.ok(src.includes('finally{pending.delete(id);b.disabled=false;load()}'),'세션 만료 뒤에도 활동 버튼 잠금을 풀어야 합니다.');

console.log('admin activity state confirmation contract self-test passed');