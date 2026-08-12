const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "const HISTORY_KEY='activity-attempt-extra-history:v1'",
  "const safeName=clean(name,12),safeActivity=clean(activityId,40),max=Math.max(1,Math.min(1000,Number(limit)||200))",
  ".slice(-max).reverse()",
  "rows.push(entry);setSetting(HISTORY_KEY,JSON.stringify(rows.slice(-1000)))",
  "type:'grant'",
  "type:'set'",
  "type:'consume'",
  "createdAt:new Date().toISOString()"
])assert.ok(src.includes(token),`extra attempt history guard missing: ${token}`);
assert.ok(src.includes("if(!safeName||!SAFE_ACTIVITY.test(id)||!['grant','set','consume'].includes(type))return{ok:false,code:'invalid-history-entry'}"),'invalid audit history entries must be rejected');
assert.ok(src.includes("return rows.filter(r=>(!safeName||r.name===safeName)&&(!safeActivity||r.activityId===safeActivity))"),'history filters must isolate student/activity records');
console.log('activity extra attempt history bounds contract self-test passed');
