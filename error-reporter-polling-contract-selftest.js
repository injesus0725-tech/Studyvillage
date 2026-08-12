const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('error-reporter.js','utf8');
assert.ok(src.includes('FLUSH_MS=10000'),'학생 오류 전송 확인 간격은 10초를 유지해야 합니다.');
assert.ok(src.includes('MAX_FLUSH_REPORTS=6'),'오류 보고는 한 주기에 소량만 전송해야 합니다.');
assert.ok(src.includes('if(flushing||!active())return'),'오프라인·숨김·비활성 게임 화면에서는 오류 전송을 반복하지 않아야 합니다.');
assert.ok(src.includes('function startFlush(){if(flushTimer||!active())return'),'오류 전송 반복 타이머가 중복 생성되면 안 됩니다.');
assert.ok(src.includes('const rows=read(STORAGE_KEY),batch=rows.slice(0,MAX_FLUSH_REPORTS),remaining=rows.slice(MAX_FLUSH_REPORTS),failed=[]'),'한 번의 오류 전송 작업이 전체 대기열을 오래 붙잡으면 안 됩니다.');
assert.ok(src.includes('if(authExpired){failed.push(...batch.slice(i+1));break}'),'세션 만료가 중간에 발생해도 아직 보내지 않은 오류 기록을 잃으면 안 됩니다.');
assert.ok(src.includes('write(STORAGE_KEY,[...failed,...remaining])'),'실패한 오류와 아직 보내지 않은 오류를 다음 주기까지 보존해야 합니다.');
assert.ok(src.includes("window.addEventListener('studyvillage:session-cleared',()=>{authExpired=true;stopFlush()})"),'세션이 정리되면 오류 전송 반복도 즉시 멈춰야 합니다.');
assert.ok(src.includes('function stopFlush(){if(flushTimer){clearInterval(flushTimer);flushTimer=null}}'),'숨김·오프라인 전환 시 반복 타이머를 정리해야 합니다.');
assert.ok(src.includes("window.addEventListener('offline',()=>{addEvent('network','브라우저 offline');stopFlush()})"),'오프라인이 되면 오류 전송 반복을 멈춰야 합니다.');
assert.ok(src.includes("document.addEventListener('visibilitychange',()=>{if(document.hidden)stopFlush();else startFlush()})"),'탭 가시성에 따라 오류 전송 반복을 중지·재개해야 합니다.');
assert.ok(src.includes("window.addEventListener('online',()=>{addEvent('network','브라우저 online');startFlush()})"),'재연결 시 오류 전송을 다시 시작해야 합니다.');
console.log('error reporter polling contract self-test passed');
