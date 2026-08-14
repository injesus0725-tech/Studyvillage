const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/star-ledger.js','utf8');
for(const token of [
  "app.post('/api/player/me/record'",
  "code:'invalid-record-relationship'",
  'attempts===0&&(totalScore!==0||bestScore!==0||lastScore!==0)',
  'attempts>0&&(bestScore<lastScore||totalScore<bestScore||totalScore>attempts*1000)'
])assert.ok(src.includes(token),`student aggregate record relationship guard missing: ${token}`);
console.log('student aggregate record relationship contract self-test passed');
