const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "const exactName=v=>{const name=String(v??'').trim();return name&&name.length<=12?name:''}",
  "const keyFor=(name,activityId)=>`${PREFIX}${encodeURIComponent(name)}:${activityId}`",
  "const playerName=exactName(name),id=clean(activityId,40);if(!playerName||!SAFE_ACTIVITY.test(id))return 0",
  "if(!playerName)return{ok:false,code:'invalid-player-name'}",
  "if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'}",
  "name:result.name,activityId:id,type:'grant'",
  "name:result.name,activityId:id,type:'consume'",
  "if(!name)return res.status(400).json({ok:false,code:'invalid-player-name'})"
])assert.ok(src.includes(token),`exact student extra-attempt guard missing: ${token}`);
assert.ok(!src.includes('encodeURIComponent(clean(name,12))'),'extra-attempt keys must never silently truncate student names');
assert.ok(src.indexOf("if(!playerName)return{ok:false,code:'invalid-player-name'}")<src.indexOf('setSetting(keyFor(playerName,id),String(n))'),'invalid names must fail before balance writes');
for(const fn of ['grantExtraAttempts','consumeExtraAttempts']){
  const start=src.indexOf(`export function ${fn}`),end=src.indexOf('\nexport function ',start+1),body=src.slice(start,end<0?src.length:end);
  assert.ok(start>=0,`${fn} must exist`);
  assert.ok(body.indexOf("if(!playerName)return{ok:false,code:'invalid-player-name'}")<body.indexOf('readExtraAttempts(getSetting,playerName,id)'),`${fn} must reject invalid names before reading balances`);
  assert.ok(body.indexOf("if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'}")<body.indexOf('readExtraAttempts(getSetting,playerName,id)'),`${fn} must reject invalid activity ids before reading balances`);
}
console.log('activity extra attempt exact student name and pre-read validation contract self-test passed');
