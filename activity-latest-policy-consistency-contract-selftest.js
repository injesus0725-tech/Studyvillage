const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txMatch=/\btx\s*=\s*db\.transaction\(\(\)=>\{/.exec(src);
const txStart=txMatch?.index??-1;
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction must exist');
const tx=src.slice(txStart,txEnd);
for(const pattern of [
  /latestPolicies\s*=\s*readActivityAttemptPolicies/,
  /latestPolicyId\s*=\s*policyIdFor\(activityId,latestPolicies\)/,
  /latestPolicy\s*=\s*latestPolicies\[latestPolicyId\]\|\|\{\}/,
  /readExtraAttempts\(key=>getSetting\(db,key\),name,latestPolicyId\)/,
  /latestAttemptRecord\s*=\s*policyRecord\(db,name,activityId,latestPolicy,latest\|\|\{\}\)/,
  /evaluateWithExtra\(latestPolicy,latestAttemptRecord,latestExtra\)/,
  /consumeExtraAttempts\(key=>getSetting\(db,key\),\(key,value\)=>setSetting\(db,key,value\),name,latestPolicyId/,
  /policyId:latestPolicyId,policy:\{\.\.\.latestDecision\.policy,period:latestPolicy\?\.period\|\|['"]all-time['"]\}/
])assert.ok(pattern.test(tx),`latest policy consistency guard missing: ${pattern}`);
assert.ok(tx.search(/latestPolicies\s*=\s*readActivityAttemptPolicies/)<tx.indexOf('SELECT * FROM activity_records'),'latest policy must be resolved before final save decision');
assert.ok(tx.search(/latestDecision\s*=\s*evaluateWithExtra/)<tx.indexOf('INSERT INTO activity_records'),'latest policy decision must gate persistence');
console.log('activity latest policy consistency contract self-test passed');
