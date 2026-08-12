const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('data-service.js','utf8');
assert.ok(src.includes("timedFetch('/api/ranking',{cache:'no-store',headers:window.StudyVillageAuth?.authHeaders?.()||{}})"),'student ranking reads must carry the current login authentication');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'ranking reads must remain bounded by the shared request timeout');
console.log('student ranking auth contract self-test passed');
