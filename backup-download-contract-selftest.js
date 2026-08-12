/* v1.9 classroom backup download contract.
   Read-only: protects the teacher backup download flow without touching student data. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./admin.js',import.meta.url),'utf8');
const guard=fs.readFileSync(new URL('./admin-network-guard.js',import.meta.url),'utf8');

for(const token of ["/api/admin/backup","backupButton.disabled=true","await r.blob()","Content-Disposition","a.download=filename","URL.revokeObjectURL(url)"]){
  assert.ok(source.includes(token),`admin.js: missing backup download step ${token}`);
}
assert.ok(source.includes("alert('백업 파일을 만들지 못했습니다.')"),'백업 실패 안내가 유지되어야 합니다.');
assert.ok(guard.includes("response?.status===401&&!isLoginUrl(url)"),'백업을 포함한 관리자 보호 API는 공통 세션 만료 처리를 받아야 합니다.');
assert.ok(guard.includes("message.textContent='관리자 로그인이 만료되었습니다. 다시 로그인해 주세요.'"),'세션 만료 이유를 교사에게 알려야 합니다.');

console.log('backup download contract: ok');
