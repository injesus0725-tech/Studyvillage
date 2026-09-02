const fs=require('fs');
const assert=require('assert');
const settings=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const policy=fs.readFileSync('server/activity-attempt-policy.js','utf8');
for(const token of [
  "const STORE_KEY='activity-attempt-policies:v1'",
  'const checked=validateAttemptPolicyMap(raw)',
  "const withDailyReset=policy=>",
  "normalized.mode==='unlimited'?{...normalized,period:'all-time'}:{...normalized,period:'daily'}",
  "Object.entries(checked.policies).filter(([id])=>!RETIRED_ACTIVITY_IDS.has(id)).map(([id,policy])=>{const normalized=withDailyReset(policy)",
  "REPEAT_XP_ACTIVITIES.has(id)?{...normalized,xpMode:'every-attempt'}:normalized",
  "RETIRED_ACTIVITY_IDS=new Set(['riddle-demo','exploration-social','exploration-science'])",
  "'library-vocabulary':Object.freeze({mode:'limited',limit:1",
  "'math-arithmetic':Object.freeze({mode:'limited',limit:3",
  "'exploration-random':Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt'",
  'return{...DAILY_CORE_POLICIES,...saved}',
  "app.put('/api/admin/activity-attempt-policies',requireAdmin",
  'if(!checked.ok)return res.status(400)',
  'setSetting(STORE_KEY,JSON.stringify(checked.policies))'
])assert.ok(settings.includes(token),`activity attempt settings guard missing: ${token}`);
for(const retired of ["'riddle-demo':Object.freeze","'exploration-social':Object.freeze","'exploration-science':Object.freeze"])assert.ok(!settings.includes(retired),`retired active policy returned: ${retired}`);
for(const token of [
  'const MAX_LIMIT=1000',
  "const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/",
  'Math.max(1,Math.min(MAX_LIMIT,Number(input?.limit)||1))',
  "==='every-attempt'?'every-attempt':'first-completion'",
  "return{mode:ATTEMPT_MODES.UNLIMITED,limit:null",
  "if(!SAFE_ACTIVITY.test(activityId))return{ok:false,code:'invalid-activity-id'"
])assert.ok(policy.includes(token),`activity attempt policy guard missing: ${token}`);
console.log('activity attempt policy safety contract self-test passed');
