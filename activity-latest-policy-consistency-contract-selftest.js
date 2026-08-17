const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txStart=src.indexOf('const tx=db.transaction(()=>{');
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction must exist');
const tx=src.slice(txStart,txEnd);
for(const token of [
  'const latestPolicies=readActivityAttemptPolicies',
  'latestPolicyId=policyIdFor(activityId,latestPolicies)',
  'latestPolicy=latestPolicies[latestPolicyId]||{}',
  'readExtraAttempts(key=>getSetting(db,key),name,latestPolicyId)',
  'latestAttemptRecord=policyRecord(db,name,activityId,latestPolicy,latest||{})',
  'evaluateWithExtra(latestPolicy,latestAttemptRecord,latestExtra)',
  'consumeExtraAttempts(key=>getSetting(db,key),(key,value)=>setSetting(db,key,value),name,latestPolicyId',
  "policyId:latestPolicyId,policy:{...latestDecision.policy,period:latestPolicy?.period||'all-time'}"
])assert.ok(tx.includes(token),`latest policy consistency guard missing: ${token}`);
assert.ok(tx.indexOf('latestPolicies=readActivityAttemptPolicies')<tx.indexOf("SELECT * FROM activity_records"),'latest policy must be resolved before final save decision');
assert.ok(tx.indexOf('latestDecision=evaluateWithExtra')<tx.indexOf('INSERT INTO activity_records'),'latest policy decision must gate persistence');
console.log('activity latest policy consistency contract self-test passed');
