/* v1.9 classroom startup UX contract.
   Read-only: protects single-instance behavior and visible startup failure guidance. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./electron/main.cjs',import.meta.url),'utf8');

for(const token of ['requestSingleInstanceLock','second-instance','showErrorBox','Studyvillage를 시작하지 못했습니다']){
  assert.ok(source.includes(token),`electron/main.cjs: missing ${token}`);
}

console.log('classroom startup contract: ok');
