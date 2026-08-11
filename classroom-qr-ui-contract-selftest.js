import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('./connect.html',import.meta.url),'utf8');

assert.match(html,/id="grid" class="grid"/, '추천 QR 전용 영역이 있어야 합니다.');
assert.match(html,/id="alternate-wrap" class="alternate-wrap"/, '대체 접속 주소 접기 영역이 있어야 합니다.');
assert.match(html,/id="alternate-grid" class="grid"/, '대체 QR 전용 영역이 있어야 합니다.');
assert.match(html,/다른 접속 주소 보기/, '대체 주소를 펼치는 안내 문구가 있어야 합니다.');
assert.match(html,/const recommended=d\.urls\.find\(item=>item\.recommended\)\|\|d\.urls\[0\]/, '추천 주소가 없을 때 첫 주소를 안전하게 사용해야 합니다.');
assert.match(html,/const alternates=d\.urls\.filter\(item=>item!==recommended\)/, '추천 주소는 대체 주소 목록에서 제외되어야 합니다.');
assert.match(html,/grid\.appendChild\(makeCard\(recommended\)\)/, '추천 QR은 기본 화면에 바로 보여야 합니다.');
assert.match(html,/alternateWrap\.style\.display='none'/, '새로고침 중에는 이전 대체 주소 영역을 숨겨야 합니다.');
assert.match(html,/alternateWrap\.open=false/, '새로고침 시 대체 주소 접기 상태를 초기화해야 합니다.');
assert.match(html,/setClassroomNote\(d\.classroomNote\|\|/, '교실 네트워크 안내가 QR 화면에 표시되어야 합니다.');

console.log('classroom qr ui contract: ok');
