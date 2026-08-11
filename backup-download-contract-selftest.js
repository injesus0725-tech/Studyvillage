/* v1.9 classroom backup download contract.
   Read-only: protects the teacher backup download flow without touching student data. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./admin.js',import.meta.url),'utf8');

for(const token of ["/api/admin/backup","backupButton.disabled=true","await r.blob()","Content-Disposition","a.download=filename","URL.revokeObjectURL(url)"]){
  assert.ok(source.includes(token),`admin.js: missing backup download step ${token}`);
}
assert.ok(source.includes("alert('백업 파일을 만들지 못했습니다.')"),'백업 실패 안내가 유지되어야 합니다.');

console.log('backup download contract: ok');
