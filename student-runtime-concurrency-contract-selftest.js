const fs=require('fs');
const assert=require('assert');

const records=fs.readFileSync('activity-records.js','utf8');
const shop=fs.readFileSync('student-shop.js','utf8');
const customize=fs.readFileSync('customize.js','utf8');
const presence=fs.readFileSync('presence.js','utf8');
const live=fs.readFileSync('live-events.js','utf8');

assert.ok(/let\s+loadPromise=null(?:,authExpired=false)?/.test(records),'학생 기록 조회는 중복 요청 방지 Promise가 필요합니다.');
assert.ok(/if\([^)]*loadPromise[^)]*\)return loadPromise/.test(records),'학생 기록 조회가 겹치면 기존 요청을 재사용해야 합니다.');

assert.ok(shop.includes('let busy=false,loadPromise=null'),'학생 상점은 구매 중복과 조회 중복을 모두 막아야 합니다.');
assert.ok(shop.includes('if(busy)return'),'학생 상점 구매 버튼 연타를 막아야 합니다.');
assert.ok(shop.includes('if(loadPromise)return loadPromise'),'학생 상점 조회 요청이 겹치면 안 됩니다.');

assert.ok(customize.includes('polling=false,loadPromise=null'),'꾸미기 화면은 폴링과 조회 중복을 막아야 합니다.');
assert.ok(customize.includes('if(loadPromise)return loadPromise'),'꾸미기 조회 요청이 겹치면 안 됩니다.');
assert.ok(customize.includes("function active(){return !document.hidden&&navigator.onLine&&game?.classList.contains('active')}"),'꾸미기 폴링은 백그라운드·오프라인·비활성 게임 상태를 건너뛰어야 합니다.');
assert.ok(customize.includes('if(polling||!active())return'),'꾸미기 폴링은 중복 실행을 건너뛰어야 합니다.');
assert.ok(customize.includes('if(save.disabled)return false'),'꾸미기 저장 버튼 연타를 막아야 합니다.');

assert.ok(/pinging|polling|sending/.test(presence),'학생 접속 상태 전송은 중복 실행 방지가 필요합니다.');
assert.ok(/polling|loading|requestInFlight/.test(live),'학생 실시간 알림 조회는 중복 실행 방지가 필요합니다.');

console.log('student runtime concurrency contract self-test passed');
