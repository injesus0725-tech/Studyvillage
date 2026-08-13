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
  "if(!Number.isInteger(use)||use<1||use>100)return{ok:false,code:'invalid-consume'}",
  "if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'}",
  "rows.push(entry);setSetting(HISTORY_KEY,JSON.stringify(rows))"
])assert.ok(src.includes(token),`extra attempt admin safety guard missing: ${token}`);
assert.ok(src.includes("detail:'교사가 추가 도전 허용'"),'grant actions must leave an audit history detail');
assert.ok(src.includes("detail:'교사가 추가 도전 횟수 직접 수정'"),'manual set actions must leave an audit history detail');
const grantStart=src.indexOf('export function grantExtraAttempts'),grantEnd=src.indexOf('\nexport function consumeExtraAttempts',grantStart),grant=src.slice(grantStart,grantEnd);
assert.ok(grant.indexOf("if(!SAFE_ACTIVITY.test(id))")<grant.indexOf('readExtraAttempts(getSetting,playerName,id)'),'admin grants must validate activity scope before reading balances');
assert.ok(grant.indexOf("if(!Number.isInteger(add)")<grant.indexOf('readExtraAttempts(getSetting,playerName,id)'),'admin grants must validate amount before reading balances');
const putStart=src.indexOf("app.put('/api/admin/activity-attempt-extra/:name/:activityId'"),put=src.slice(putStart);
assert.ok(put.indexOf("if(!SAFE_ACTIVITY.test(activityId))")<put.indexOf('readExtraAttempts(getSetting,name,activityId)'),'manual set must validate activity scope before reading balances');
console.log('activity extra attempt admin pre-read safety contract self-test passed');
