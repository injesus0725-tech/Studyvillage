/* v1.9 classroom startup UX contract.
   Read-only: protects single-instance behavior, visible startup failure guidance,
   safe shutdown behavior, and classroom SQLite write-safety baseline. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./electron/main.cjs',import.meta.url),'utf8');
const server=fs.readFileSync(new URL('./server/server.js',import.meta.url),'utf8');

for(const token of ['requestSingleInstanceLock','second-instance','showErrorBox','Studyvillage를 시작하지 못했습니다']){
  assert.ok(source.includes(token),`electron/main.cjs: missing ${token}`);
}
for(const token of ["server.once('listening'","server.once('error'",'server listen timed out']){
  assert.ok(source.includes(token),`electron/main.cjs: embedded server readiness must include ${token}`);
}
assert.match(source,/Windows에서 컴퓨터를 직접 재부팅/,'컴퓨터 재부팅은 사용자가 직접 하는 안내여야 합니다.');
assert.match(source,/자동으로 재부팅하지는 않습니다/,'Studyvillage가 자동 재부팅하지 않는다는 안내가 유지되어야 합니다.');
assert.match(source,/app\.on\('window-all-closed'/,'Studyvillage 창을 모두 닫으면 앱 종료 흐름이 유지되어야 합니다.');
assert.ok(!/shutdown\s*\(|reboot\s*\(|Restart-Computer|shutdown\.exe/i.test(source),'Studyvillage가 PC 종료/재부팅 명령을 실행하면 안 됩니다.');
assert.ok(server.includes("db.pragma('journal_mode = WAL')"),'교실 동시 저장 안정성을 위해 SQLite WAL 모드를 유지해야 합니다.');
assert.match(server,/db\.pragma\(['"]busy_timeout\s*=\s*\d+['"]\)/,'교실 동시 저장 중 잠깐의 SQLite 잠금을 기다리는 busy_timeout 설정이 유지되어야 합니다.');
assert.ok(server.includes('db.transaction('),'중요한 여러 기록 변경은 SQLite transaction으로 보호되어야 합니다.');

console.log('classroom startup/shutdown/sqlite safety contract: ok');
