const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txStart=src.indexOf('const tx=db.transaction(()=>{');
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction missing');
const tx=src.slice(txStart,txEnd);
for(const token of [
  'const latestPolicies=readActivityAttemptPolicies(key=>getSetting(db,key))',
  'latestPolicyId=policyIdFor(activityId,latestPolicies)',
  'latestPolicy=latestPolicies[latestPolicyId]||{}',
  'latestAttemptRecord=policyRecord(db,name,activityId,latestPolicy,latest||{})',
  'latestDecision=evaluateWithExtra(latestPolicy,latestAttemptRecord,latestExtra)',
  'policyId:latestPolicyId',
  "policy:{...latestDecision.policy,period:latestPolicy?.period||'all-time'}"
])assert.ok(tx.includes(token),`latest policy guard missing: ${token}`);
assert.ok(tx.indexOf('latestPolicies=readActivityAttemptPolicies')<tx.indexOf('latestDecision=evaluateWithExtra'),'latest policy must be read before final save decision');
console.log('activity latest policy save contract self-test passed');
