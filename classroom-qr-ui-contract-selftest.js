import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('./connect.html',import.meta.url),'utf8');

assert.match(html,/id="grid" class="grid"/, '현재 학생용 QR 전용 영역이 있어야 합니다.');
assert.match(html,/id="alternate-wrap" class="alternate-wrap"/, '대체 접속 주소 접기 영역이 있어야 합니다.');
assert.match(html,/id="alternate-grid" class="grid"/, '대체 QR 전용 영역이 있어야 합니다.');
assert.match(html,/id="address-select"/, '학생용 주소 직접 선택 메뉴가 있어야 합니다.');
assert.match(html,/id="use-address"/, '선택 주소 적용 버튼이 있어야 합니다.');
assert.match(html,/다른 접속 주소 보기/, '대체 주소를 펼치는 안내 문구가 있어야 합니다.');
assert.match(html,/networkItems\.find\(item=>item\.url===saved\)\|\|networkItems\.find\(item=>item\.recommended\)\|\|networkItems\[0\]\|\|null/, '저장 주소→추천 주소→첫 주소 순으로 안전하게 선택해야 합니다.');
assert.match(html,/networkItems\.filter\(item=>item\.url!==chosen\.url\)/, '현재 학생용 주소는 대체 주소 목록에서 제외되어야 합니다.');
assert.match(html,/grid\.appendChild\(makeCard\(chosen,\{primary:true,chosen:true\}\)\)/, '현재 학생용 QR은 기본 화면에 바로 보여야 합니다.');
assert.match(html,/alternateWrap\.hidden=true/, '새로고침 중에는 이전 대체 주소 영역을 숨겨야 합니다.');
assert.match(html,/setClassroomNote\(d\.classroomNote\|\|/, '교실 네트워크 안내가 QR 화면에 표시되어야 합니다.');
assert.match(html,/localStorage\.setItem\(SELECTED_KEY,chosen\.url\)/, '교사가 직접 고른 학생용 주소를 기억해야 합니다.');

console.log('classroom qr ui contract: ok');
