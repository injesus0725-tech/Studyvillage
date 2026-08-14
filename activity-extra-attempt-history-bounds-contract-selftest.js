const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "const HISTORY_KEY='activity-attempt-extra-history:v1'",
  "rows=store.ok?store.rows.slice(-1000):[]",
  "const rawName=String(name??'').trim()",
  "if(rawName.length>12)return[]",
  "const safeName=rawName,safeActivity=clean(activityId,40),requestedLimit=Number(limit),max=Math.max(1,Math.min(1000,Number.isFinite(requestedLimit)?Math.floor(requestedLimit):200))",
  "if(safeActivity&&!SAFE_ACTIVITY.test(safeActivity))return[]",
  ".slice(-max).reverse()",
  "const rows=store.rows.slice(-999)",
  "rows.push(entry);setSetting(HISTORY_KEY,JSON.stringify(rows))",
  "type:'grant'",
  "type:'set'",
  "type:'consume'",
  "createdAt:new Date().toISOString()",
  "!Number.isInteger(beforeValue)||!Number.isInteger(afterValue)",
  "beforeValue<0||beforeValue>1000||afterValue<0||afterValue>1000",
  "const delta=Number.isInteger(change)?change:afterValue-beforeValue",
  "afterValue-beforeValue!==delta",
  "type==='grant'&&delta<=0",
  "type==='consume'&&delta>=0"
])assert.ok(src.includes(token),`extra attempt history guard missing: ${token}`);
assert.ok(src.includes("if(!safeName||!SAFE_ACTIVITY.test(id)||!['grant','set','consume'].includes(type))return{ok:false,code:'invalid-history-entry'}"),'invalid audit history entries must be rejected');
assert.ok(src.includes("return rows.filter(r=>(!safeName||r.name===safeName)&&(!safeActivity||r.activityId===safeActivity))"),'history filters must isolate student/activity records');
assert.ok(src.indexOf("if(rawName.length>12)return[]")<src.indexOf("return rows.filter"),'overlong student filters must fail closed before history filtering');
assert.ok(src.indexOf("if(safeActivity&&!SAFE_ACTIVITY.test(safeActivity))return[]")<src.indexOf("return rows.filter"),'invalid activity filters must fail closed before history filtering');
assert.ok(src.includes('Number.isFinite(requestedLimit)?Math.floor(requestedLimit):200'),'history limit must normalize finite values to integers and non-finite values to default');
console.log('activity extra attempt bounded read/write, exact filter, limit, and integrity contract self-test passed');
