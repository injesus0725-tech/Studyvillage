const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/item-shop.js','utf8');
const student=fs.readFileSync('student-shop.js','utf8');

assert.ok(server.includes('serverNow:new Date(now).toISOString()'),'상점 응답에 교사 서버 시각이 포함돼야 합니다.');
assert.ok(student.includes('function scheduleTransition(data)'),'예약 경계 자동 갱신기가 필요합니다.');
assert.ok(student.includes('const serverNow=Date.parse(data.serverNow)'),'학생 기기 시계 대신 서버 시각을 기준으로 해야 합니다.');
assert.ok(student.includes('[item.saleStartsAt,item.saleEndsAt]'),'시작·종료 경계를 모두 예약해야 합니다.');
assert.ok(student.includes('transitionTimer=setTimeout(()=>{transitionTimer=null;load()},delay)'),'경계가 지나면 서버 상태를 다시 읽어야 합니다.');
assert.ok(student.includes('const fresh=data!==lastData'),'종류 필터 변경으로 타이머가 중복 예약되지 않아야 합니다.');
assert.ok(student.includes("window.addEventListener('pagehide'"),'화면을 떠날 때 예약 타이머를 정리해야 합니다.');
assert.ok(student.includes('Math.min(2147483000'),'장기 예약 타이머의 브라우저 한계를 지켜야 합니다.');
console.log('student shop schedule refresh contract self-test passed');
