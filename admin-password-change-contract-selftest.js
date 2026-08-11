const fs=require('fs');
const assert=require('assert');

const adminHtml=fs.readFileSync('admin.html','utf8');
const adminJs=fs.readFileSync('admin.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');

assert.ok(adminHtml.includes('id="change-admin-password"'),'관리자 화면에 비밀번호 변경 버튼이 필요합니다.');
assert.ok(adminJs.includes("fetch('/api/admin/password'"),'관리자 비밀번호 변경 요청이 서버에 연결되어야 합니다.');
assert.ok(server.includes("app.post('/api/admin/password',requireAdmin"),'관리자 인증 후에만 비밀번호를 변경할 수 있어야 합니다.');
assert.ok(server.includes('adminSessions.clear()'),'관리자 비밀번호 변경 뒤 기존 관리자 로그인을 종료해야 합니다.');
assert.ok(adminJs.includes("sessionStorage.removeItem('studyvillage-admin-token')"),'비밀번호 변경 뒤 브라우저 관리자 로그인도 종료되어야 합니다.');

console.log('admin password change contract self-test passed');
