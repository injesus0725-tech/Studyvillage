const fs=require('fs');
const assert=require('assert');

const admin=fs.readFileSync('admin-live-events.js','utf8');
const student=fs.readFileSync('live-events.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');

assert.ok(server.includes("app.post('/api/admin/live-events'"),'교사 실시간 메시지 API가 필요합니다.');
assert.ok(server.includes('activePresenceNames()'),'실시간 메시지는 현재 접속 학생만 대상으로 해야 합니다.');
assert.ok(server.includes('expiresAt:now+15000'),'실시간 메시지는 오래 서버에 남지 않아야 합니다.');
assert.ok(server.includes('liveEvents.length>50'),'실시간 메시지 큐는 무한히 쌓이면 안 됩니다.');
assert.ok(admin.includes('/api/admin/live-events'),'교사 화면은 실시간 메시지 API를 사용해야 합니다.');
assert.ok(student.includes('/api/live-events'),'학생 화면은 실시간 메시지를 서버에서 받아야 합니다.');
assert.ok(!/setInterval\([^,]+,\s*(?:[0-9]{1,3}|1000)\)/.test(student),'학생 실시간 메시지 확인을 1초 이하로 과도하게 반복하면 안 됩니다.');

console.log('admin live events contract self-test passed');
