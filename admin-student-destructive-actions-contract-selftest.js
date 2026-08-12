const fs=require('fs');
const assert=require('assert');

const admin=fs.readFileSync('admin.js','utf8');
const guard=fs.readFileSync('admin-network-guard.js','utf8');

assert.ok(
  admin.includes("if(action==='record'&&!confirm("),
  '성장 초기화는 교사 확인창을 거쳐야 합니다.'
);
assert.ok(
  admin.includes("if(action==='delete'&&!confirm("),
  '학생 계정 삭제는 교사 확인창을 거쳐야 합니다.'
);
assert.ok(
  admin.includes('pendingStudentActions'),
  '학생 계정 변경의 중복 실행 방지 장치가 필요합니다.'
);
assert.ok(
  admin.includes('pendingStudentActions.has(actionKey)'),
  '동일 학생·동일 작업의 중복 요청을 막아야 합니다.'
);
assert.ok(
  admin.includes('pendingStudentActions.delete(actionKey)'),
  '학생 계정 변경 작업 후 잠금 상태를 해제해야 합니다.'
);
assert.ok(guard.includes("response?.status===401&&!isLoginUrl(url)"),'관리자 보호 API의 401은 공통 로그인 만료 처리로 연결되어야 합니다.');
assert.ok(guard.includes("sessionStorage.removeItem('studyvillage-admin-token')"),'관리자 세션 만료 시 저장된 토큰을 제거해야 합니다.');
assert.ok(guard.includes("app.hidden=true")&&guard.includes("login.hidden=false"),'관리자 세션 만료 시 교사 화면을 숨기고 로그인 화면을 보여줘야 합니다.');

console.log('admin destructive student actions contract self-test passed');
