const fs=require('fs');
const assert=require('assert');
const settings=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const student=fs.readFileSync('server/activity-attempt-student.js','utf8');
const overview=fs.readFileSync('server/activity-attempt-overview.js','utf8');
const admin=fs.readFileSync('admin-attempt-policy.js','utf8');

assert.ok(settings.includes("'math-arithmetic':Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'})"),'arithmetic must have a fixed daily three-attempt policy');
assert.ok(settings.includes("'library-vocabulary':Object.freeze({mode:'limited',limit:1,xpMode:'every-attempt',period:'daily'})"),'Bookmaru must award one fresh XP-eligible challenge each day');
assert.ok(student.includes("timeZone:'Asia/Seoul'"),'daily attempts must follow the classroom timezone');
assert.ok(student.includes("type=? AND created_at>=? AND created_at<?"),'daily attempts must be counted from confirmed activity log rows');
assert.ok(student.includes("activityId==='riddle'?'quiz-complete'"),'riddle entry status must count the same completion rows written by the riddle route');
assert.ok(overview.includes("recordId==='riddle'?'quiz-complete'"),'teacher remaining-attempt overview must count riddle completions');
assert.ok(student.includes("policy?.period==='daily'?{...record,attempts:dailyAttempts"),'only daily policies may replace cumulative attempts for gating');
assert.ok(student.includes('latestAttemptRecord=policyRecord'),'the transaction must recount the daily allowance before saving');
assert.ok(student.includes('consumeExtraAttempts'),'the existing teacher extra-attempt grant must remain available after the daily attempts');
assert.ok(student.includes("period:latestPolicy?.period||'all-time'"),'the save response must explain the daily policy');
assert.ok(overview.includes('periodAttempts:decision.attempts'),'the teacher overview must separate today attempts from cumulative attempts');
assert.ok(admin.includes('매일 00:00 갱신')&&admin.includes('오늘 남음'),'the teacher overview must clearly label daily reset and remaining attempts');

console.log('math daily three-attempt policy contract self-test passed');
