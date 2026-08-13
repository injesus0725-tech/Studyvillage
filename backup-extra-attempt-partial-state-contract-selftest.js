const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "code:'missing-extra-attempt-current-setting'",
  "if(!extraAttemptBalances.has(scope))",
  "code:'extra-attempt-current-balance-mismatch'",
  "if(extraAttemptBalances.get(scope)!==lastBalance)",
  "code:'duplicate-backup-setting-key'",
  "code:'duplicate-extra-attempt-history-id'"
])assert.ok(src.includes(token),`partial extra-attempt backup guard missing: ${token}`);
assert.ok(src.includes("if(!extraAttemptBalances.has(scope))return{ok:false,code:'missing-extra-attempt-current-setting'"),'history without current balance must fail closed');
assert.ok(src.indexOf("if(!extraAttemptBalances.has(scope))")<src.indexOf("if(extraAttemptBalances.get(scope)!==lastBalance)"),'missing current balance must be rejected before comparing balance values');
console.log('backup extra attempt partial state contract self-test passed');
