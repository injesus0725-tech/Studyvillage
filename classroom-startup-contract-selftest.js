/* v1.9 classroom startup UX contract.
   Read-only: protects single-instance behavior and visible startup failure guidance. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./electron/main.cjs',import.meta.url),'utf8');

for(const token of ['requestSingleInstanceLock','second-instance','showErrorBox','Studyvillage를 시작하지 못했습니다']){
  assert.ok(source.includes(token),`electron/main.cjs: missing ${token}`);
}
assert.match(source,/Windows에서 컴퓨터를 직접 재부팅/,'컴퓨터 재부팅은 사용자가 직접 하는 안내여야 합니다.');
assert.match(source,/자동으로 재부팅하지는 않습니다/,'Studyvillage가 자동 재부팅하지 않는다는 안내가 유지되어야 합니다.');

console.log('classroom startup contract: ok');
