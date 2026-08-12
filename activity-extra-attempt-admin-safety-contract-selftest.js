const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  "app.get('/api/admin/activity-attempt-extra-history',requireAdmin",
  "app.get('/api/admin/activity-attempt-extra/:name/:activityId',requireAdmin",
  "app.post('/api/admin/activity-attempt-extra/:name/:activityId/grant',requireAdmin",
  "app.put('/api/admin/activity-attempt-extra/:name/:activityId',requireAdmin",
  "if(!Number.isInteger(n)||n<0||n>1000)return{ok:false,code:'invalid-extra-attempts'}",
  "if(!Number.isInteger(add)||add<1||add>100)return{ok:false,code:'invalid-grant'}",
  "rows.push(entry);setSetting(HISTORY_KEY,JSON.stringify(rows.slice(-1000)))"
])assert.ok(src.includes(token),`extra attempt admin safety guard missing: ${token}`);
assert.ok(src.includes("detail:'교사가 추가 도전 허용'"),'grant actions must leave an audit history detail');
assert.ok(src.includes("detail:'교사가 추가 도전 횟수 직접 수정'"),'manual set actions must leave an audit history detail');
console.log('activity extra attempt admin safety contract self-test passed');
