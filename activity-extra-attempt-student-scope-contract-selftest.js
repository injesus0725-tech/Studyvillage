const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "const PREFIX='activity-attempt-extra:v1:'",
  "const exactName=v=>{const name=String(v??'').trim();return name&&name.length<=12?name:''}",
  "const keyFor=(name,activityId)=>`${PREFIX}${encodeURIComponent(name)}:${activityId}`",
  "const playerName=exactName(name),id=clean(activityId,40);if(!playerName||!SAFE_ACTIVITY.test(id))return 0",
  "if(!rawName)return{ok:false,code:'player-required'}",
  "if(!playerName)return{ok:false,code:'invalid-player-name'}",
  "if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'}",
  "if(!Number.isInteger(n)||n<0||n>1000)return{ok:false,code:'invalid-extra-attempts'}",
  "if(!Number.isInteger(add)||add<1||add>100)return{ok:false,code:'invalid-grant'}",
  "if(current<use)return{ok:false,code:'insufficient-extra-attempts',extraAttempts:current}"
])assert.ok(src.includes(token),`extra attempt isolation guard missing: ${token}`);
assert.ok(!src.includes('encodeURIComponent(clean(name,12))'),'student scope keys must not silently truncate names');
assert.ok(src.includes("rows.filter(r=>(!safeName||r.name===safeName)&&(!safeActivity||r.activityId===safeActivity))"),'history filters must keep student and activity scopes independent');
console.log('activity extra attempt exact student scope contract self-test passed');
