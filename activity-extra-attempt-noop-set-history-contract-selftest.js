const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
const routeStart=src.indexOf("app.put('/api/admin/activity-attempt-extra/:name/:activityId'");
assert.ok(routeStart>=0,'manual extra-attempt route must exist');
const route=src.slice(routeStart);
assert.ok(route.includes("if(result.extraAttempts!==before)appendExtraAttemptHistory"),'manual set must only write history when the balance changes');
assert.ok(route.includes("type:'set',amount:result.extraAttempts-before,before,after:result.extraAttempts"),'changed manual set must preserve exact before/after delta');
console.log('activity extra-attempt no-op set history contract self-test passed');
