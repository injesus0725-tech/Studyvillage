const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
assert.ok(src.includes('function clearStudentSessions(name)'),'student-specific session clearing helper must exist');
assert.ok(/reset-password[^\n]*clearStudentSessions\(name\)/s.test(src),'password reset must invalidate that student sessions');
assert.ok(/app\.delete\('\/api\/admin\/player\/:name'[^\n]*clearStudentSessions\(name\)/s.test(src),'student deletion must invalidate that student sessions');
assert.ok(src.includes('presence.delete(name)'),'student session invalidation must also clear stale presence');
console.log('student destructive action session contract self-test passed');
