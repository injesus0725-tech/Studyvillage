const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const txStart=src.search(/(?:const\s+)?tx\s*=\s*db\.transaction\(\(\)=>\{/);
const txEnd=src.indexOf('const result=tx();',txStart);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction missing');
const tx=src.slice(txStart,txEnd);
for(const pattern of [
  /latestPolicies\s*=\s*readActivityAttemptPolicies\(key=>getSetting\(db,key\)\)/,
  /latestPolicyId\s*=\s*policyIdFor\(activityId,latestPolicies\)/,
  /latestPolicy\s*=\s*latestPolicies\[latestPolicyId\]\|\|\{\}/,
  /latestAttemptRecord\s*=\s*policyRecord\(db,name,activityId,latestPolicy,latest\|\|\{\}\)/,
  /latestDecision\s*=\s*evaluateWithExtra\(latestPolicy,latestAttemptRecord,latestExtra\)/,
  /policyId\s*:\s*latestPolicyId/,
  /policy\s*:\s*\{\.\.\.latestDecision\.policy,period:latestPolicy\?\.period\|\|'all-time'\}/
])assert.ok(pattern.test(tx),`latest policy guard missing: ${pattern}`);
assert.ok(tx.indexOf('latestPolicies')<tx.indexOf('latestDecision=evaluateWithExtra'),'latest policy must be read before final save decision');
console.log('activity latest policy save contract self-test passed');
