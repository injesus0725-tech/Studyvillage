const fs=require('fs');
const assert=require('assert');

const server=fs.readFileSync('server/server.js','utf8');

assert.ok(
  server.includes("db.pragma('journal_mode = WAL')"),
  '교실 동시 저장 안정성을 위해 SQLite WAL 모드를 유지해야 합니다.'
);
assert.ok(
  server.includes('db.transaction('),
  '여러 기록을 함께 바꾸는 중요한 작업은 SQLite transaction으로 보호되어야 합니다.'
);

console.log('sqlite classroom write safety contract self-test passed');
