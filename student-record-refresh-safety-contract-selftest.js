const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('activity-records.js','utf8');
assert.ok(src.includes('let loadPromise=null'),'학생 기록 조회 진행 상태를 추적해야 합니다.');
assert.ok(src.includes('if(loadPromise)return loadPromise'),'학생 기록 조회가 겹치면 기존 요청을 재사용해야 합니다.');
assert.ok(src.includes('finally{loadPromise=null}'),'학생 기록 조회가 끝나면 중복 방지 상태를 해제해야 합니다.');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'학생 기록 조회 제한시간을 유지해야 합니다.');
console.log('student record refresh safety contract self-test passed');
