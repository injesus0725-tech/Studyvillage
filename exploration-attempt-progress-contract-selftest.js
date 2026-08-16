const assert=require('assert');
const fs=require('fs');
const server=fs.readFileSync('server/activity-attempt-student.js','utf8'),admin=fs.readFileSync('admin-attempt-policy.js','utf8'),client=fs.readFileSync('village-layout.js','utf8');

assert.match(server,/app\.get\('\/api\/player\/me\/activity-attempt-status\/:activityId',requireSession/,'attempt status must require a student session');
assert.match(server,/evaluateWithExtra\(policy,record,extra\)/,'status must include teacher-granted extra attempts');
assert.match(server,/allowed:decision\.allowed,remaining:decision\.remaining/,'status must expose the authoritative allowance');
for(const id of ['exploration-forest-riddle','exploration-mountain-riddle'])assert(admin.includes(`'${id}'`),`${id} must appear in teacher attempt settings`);
assert.match(client,/await attemptStatus\(region\.id\)/,'the map must verify allowance before starting questions');
assert.match(client,/if\(!status\.allowed\)/,'an exhausted expedition must be blocked before play');
assert.match(client,/교실 서버 연결을 확인해 주세요/,'failure to verify a controlled attempt must fail closed');
assert.match(client,/⭐ 최고 \$\{best\}점/,'completed nodes must show the best score');
assert.match(client,/\$\{attempts\}회 완료/,'completed nodes must show attempt count');
assert.match(client,/studyvillage:exploration-map-open/,'opening the map must refresh progress');
console.log('exploration attempt progress contract selftest passed');
