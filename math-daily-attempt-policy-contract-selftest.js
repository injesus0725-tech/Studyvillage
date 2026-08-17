const fs=require('fs');
const assert=require('assert');
const settings=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const student=fs.readFileSync('server/activity-attempt-student.js','utf8');
const overview=fs.readFileSync('server/activity-attempt-overview.js','utf8');
const admin=fs.readFileSync('admin-attempt-policy.js','utf8');

assert.ok(settings.includes("DAILY_MATH_POLICY=Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'})"),'arithmetic must have a fixed daily three-attempt policy');
assert.ok(student.includes("timeZone:'Asia/Seoul'"),'daily attempts must follow the classroom timezone');
assert.ok(student.includes("type=? AND created_at>=? AND created_at<?"),'daily attempts must be counted from confirmed activity log rows');
assert.ok(student.includes("policy?.period==='daily'?{...record,attempts:dailyAttempts"),'only daily policies may replace cumulative attempts for gating');
assert.ok(student.includes('latestAttemptRecord=policyRecord'),'the transaction must recount the daily allowance before saving');
assert.ok(student.includes('consumeExtraAttempts'),'the existing teacher extra-attempt grant must remain available after the daily three attempts');
assert.ok(student.includes("period:latestPolicy?.period||'all-time'"),'the save response must explain the daily policy');
assert.ok(overview.includes('periodAttempts:decision.attempts'),'the teacher overview must separate today attempts from cumulative attempts');
assert.ok(admin.includes("daily?'오늘 ':''"),'the teacher overview must label daily remaining attempts');

console.log('math daily three-attempt policy contract self-test passed');
