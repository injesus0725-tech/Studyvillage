const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "const PREFIX='activity-attempt-extra:v1:'",
  "const keyFor=(name,activityId)=>`${PREFIX}${encodeURIComponent(clean(name,12))}:${activityId}`",
  "const id=clean(activityId,40);if(!SAFE_ACTIVITY.test(id))return 0",
  "if(!clean(name,12))return{ok:false,code:'player-required'}",
  "if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'}",
  "if(!Number.isInteger(n)||n<0||n>1000)return{ok:false,code:'invalid-extra-attempts'}",
  "if(!Number.isInteger(add)||add<1||add>100)return{ok:false,code:'invalid-grant'}",
  "if(current<use)return{ok:false,code:'insufficient-extra-attempts',extraAttempts:current}"
])assert.ok(src.includes(token),`extra attempt isolation guard missing: ${token}`);
assert.ok(src.includes("rows.filter(r=>(!safeName||r.name===safeName)&&(!safeActivity||r.activityId===safeActivity))"),'history filters must keep student and activity scopes independent');
console.log('activity extra attempt student scope contract self-test passed');
