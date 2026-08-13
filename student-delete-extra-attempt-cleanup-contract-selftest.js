const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const start=src.indexOf('const deleteStudentData=db.transaction');
const end=src.indexOf("app.delete('/api/admin/player/:name'",start);
assert.ok(start>=0&&end>start,'student delete transaction must exist');
const block=src.slice(start,end);
for(const token of [
  "const extraPrefix=`activity-attempt-extra:v1:${encodeURIComponent(name)}:`",
  "SELECT key FROM settings WHERE key LIKE ? ESCAPE '\\'",
  "db.prepare('DELETE FROM settings WHERE key=?').run(row.key)",
  "DELETE FROM players WHERE name=?"
])assert.ok(block.includes(token),`extra-attempt deletion cleanup missing: ${token}`);
assert.ok(block.indexOf('const extraPrefix=')<block.indexOf("DELETE FROM players WHERE name=?"),'extra-attempt keys must be removed before deleting player');
console.log('student delete extra attempt cleanup contract self-test passed');
