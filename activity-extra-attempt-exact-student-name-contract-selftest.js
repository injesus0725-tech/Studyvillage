const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "const exactName=v=>{const name=String(v??'').trim();return name&&name.length<=12?name:''}",
  "const keyFor=(name,activityId)=>`${PREFIX}${encodeURIComponent(name)}:${activityId}`",
  "const playerName=exactName(name),id=clean(activityId,40);if(!playerName||!SAFE_ACTIVITY.test(id))return 0",
  "if(!playerName)return{ok:false,code:'invalid-player-name'}",
  "name:result.name,activityId,type:'grant'",
  "name:result.name,activityId,type:'consume'",
  "if(!name)return res.status(400).json({ok:false,code:'invalid-player-name'})"
])assert.ok(src.includes(token),`exact student extra-attempt guard missing: ${token}`);
assert.ok(!src.includes('encodeURIComponent(clean(name,12))'),'extra-attempt keys must never silently truncate student names');
assert.ok(src.indexOf("if(!playerName)return{ok:false,code:'invalid-player-name'}")<src.indexOf('setSetting(keyFor(playerName,id),String(n))'),'invalid names must fail before balance writes');
console.log('activity extra attempt exact student name contract self-test passed');
