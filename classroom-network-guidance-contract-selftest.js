/* v1.9 wired teacher PC / Wi-Fi student device guidance contract.
   Read-only source contract: protects classroom guidance without changing network, question, or score data. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./server/network-access.js',import.meta.url),'utf8');

for(const token of ['WIRED_HINTS','WIRELESS_HINTS','connectionKind','kind','classroomNote']){
  assert.ok(source.includes(token),`network-access.js: missing ${token}`);
}
assert.match(source,/recommended\?\.kind==='wired'/,'유선 추천 주소일 때 교실 안내를 구분해야 합니다.');
assert.match(source,/교사 PC가 유선이어도 학생 패드가 Wi-Fi인 것은 정상입니다/,'유선 PC와 Wi-Fi 학생 패드 안내가 유지되어야 합니다.');
assert.match(source,/유선망과 Wi-Fi망 사이의 기기 통신이 허용/,'학교 유선망·무선망 간 통신 조건 안내가 유지되어야 합니다.');
assert.match(source,/학교 내부망에서 서로 통신할 수 있어야 합니다/,'일반 네트워크 통신 조건 안내가 유지되어야 합니다.');

console.log('classroom network guidance contract: ok');
