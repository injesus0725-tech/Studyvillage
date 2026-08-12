const fs=require('fs');
const assert=require('assert');

const admin=fs.readFileSync('admin-live-events.js','utf8');
const adminHtml=fs.readFileSync('admin.html','utf8');
const student=fs.readFileSync('live-events.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');

assert.ok(server.includes("app.post('/api/admin/live-events'"),'교사 실시간 메시지 API가 필요합니다.');
assert.ok(server.includes('activePresenceNames()'),'실시간 메시지는 현재 접속 학생만 대상으로 해야 합니다.');
assert.ok(server.includes('expiresAt:now+15000'),'실시간 메시지는 오래 서버에 남지 않아야 합니다.');
assert.ok(server.includes('liveEvents.length>50'),'실시간 메시지 큐는 무한히 쌓이면 안 됩니다.');
assert.ok(admin.includes('/api/admin/live-events'),'교사 화면은 실시간 메시지 API를 사용해야 합니다.');
assert.ok(admin.includes('if(r.status===401)'),'교사 방송의 접속 인원 확인은 관리자 인증 만료를 별도로 처리해야 합니다.');
assert.ok(admin.includes("audience.textContent='관리자 로그인 필요'"),'관리자 인증이 만료되면 접속 인원을 오래된 값으로 남기면 안 됩니다.');
assert.ok(admin.includes("audience.title='관리자 인증이 만료되었습니다.'"),'관리자 인증 만료 원인을 교사가 확인할 수 있어야 합니다.');
assert.ok(!admin.includes("s.src='admin-activity-state.js'"),'실시간 방송 스크립트가 활동 상태 스크립트를 다시 불러오면 안 됩니다.');
assert.strictEqual((adminHtml.match(/<script src="admin-activity-state\.js"><\/script>/g)||[]).length,1,'활동 상태 스크립트는 관리자 HTML에서 정확히 한 번만 불러야 합니다.');
assert.ok(student.includes('/api/live-events'),'학생 화면은 실시간 메시지를 서버에서 받아야 합니다.');
assert.ok(!/setInterval\([^,]+,\s*(?:[0-9]{1,3}|1000)\)/.test(student),'학생 실시간 메시지 확인을 1초 이하로 과도하게 반복하면 안 됩니다.');
assert.ok(student.includes('function resumeFromLatest(){cursor=null;start(true)}'),'재연결 시 지난 방송을 다시 받지 않도록 최신 위치부터 시작해야 합니다.');
assert.ok(student.includes("window.addEventListener('online',resumeFromLatest)"),'학생이 다시 온라인이 되면 과거 방송을 건너뛰어야 합니다.');
assert.ok(student.includes("window.addEventListener('studyvillage:session-ready',resumeFromLatest)"),'새 학생 세션은 이전 방송 이력을 이어받으면 안 됩니다.');

console.log('admin live events contract self-test passed');
